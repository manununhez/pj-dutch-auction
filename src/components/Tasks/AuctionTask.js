import React from "react";
import {
    Container, Row, Col, Media, Modal, ModalBody
} from "reactstrap";

import {
    TEXT_EMPTY,
    SPACE_KEY_CODE,
    ENTER_KEY_CODE,
    EVENT_KEY_DOWN,
    FREQ_CHANGE_MS,
    PRICE_STEP,
    FEMALE_VALUE,
    AUCTION_TUTORIAL_POPUP_TEXT,
    AUCTION_GAIN_TEXT_MALE,
    AUCTION_GAIN_TEXT_FEMALE,
    AUCTION_LOSE_TEXT,
    ONE_SECOND_MS,
    BID_STATE_NOT_STARTED,
    BID_STATE_RUNNING,
    BID_STATE_FINISHED,
    BID_STATE_DEMO,
    AUCTION_FOOTER_TEXT,
    GREEN,
    RED
} from '../../helpers/constants';

import "./style.css";

import Footer from "../Footers/Footer";

const DEBUG = (process.env.REACT_APP_DEBUG_LOG === "true") ? true : false;

class AuctionTask extends React.Component {
    constructor(props) {
        super(props);

        const gainText = this.props.sex === FEMALE_VALUE ? AUCTION_GAIN_TEXT_FEMALE : AUCTION_GAIN_TEXT_MALE
        this.state = {
            auctionLength: this.props.data[0].auctionLength,
            bid: this.props.data[0].priceStart,
            bidStartTimestamp: 0,
            bidStopTimestamp: 0,
            bidState: BID_STATE_NOT_STARTED,
            counterAuction: 0,
            demoModalOpen: false,
            demoModalWasAlreadyOpen: false,
            footerTextMessage: AUCTION_FOOTER_TEXT,
            gainText: gainText,
            isBidGain: false,
            spaceBarPressed: false,
            looseText: AUCTION_LOSE_TEXT,
            modalOpen: false,
            priceStart: this.props.data[0].priceStart,
            timeCount: 0
        };

        this.handleKeyDownEvent = this._handleKeyDownEvent.bind(this);

    }

    componentDidMount() {
        //for keyboard detection
        document.addEventListener(EVENT_KEY_DOWN, this.handleKeyDownEvent, false);

        // HTML prevent space bar from scrolling page
        window.addEventListener(EVENT_KEY_DOWN, function (e) {
            if (e.keyCode === SPACE_KEY_CODE && e.target === document.body) {
                e.preventDefault();
            }
        });
    }

    componentWillUnmount() {
        document.removeEventListener(EVENT_KEY_DOWN, this.handleKeyDownEvent, false);

        this._clearTimer()
    }

    _initTimerSeconds() {
        this.myIntervalSeconds = setInterval(() => {
            this.setState(({ timeCount }) => ({
                timeCount: timeCount + ONE_SECOND_MS
            }), () => {
                const { timeCount, auctionLength } = this.state

                if (DEBUG) console.log(`timeCount: ${timeCount}`)
                if (timeCount >= auctionLength) { //timeout. we finish and save data
                    this._finishBidAndSaveData(false, false)
                }
            })
        }, ONE_SECOND_MS)
    }

    _finishBidAndSaveData(isBidGain, spaceBarPressed) {
        //Aca el usuario para la apuesta. Se guarda el bid actual y se muestra el dialogo

        //showModal()
        this.setState(({
            bidState: BID_STATE_FINISHED,
            modalOpen: true,
            isBidGain: isBidGain,
            spaceBarPressed: spaceBarPressed,
            bidStopTimestamp: Date.now()
        }), () => {
            this._clearTimer(); //stop timer
        });
    }

    _initTimerPriceStep() {
        this.myIntervalPriceStep = setInterval(() => {
            this.setState(({ bid }) => ({
                bid: bid - PRICE_STEP
            }))
        }, FREQ_CHANGE_MS)
    }

    _initConfig() {
        this._initTimerPriceStep()
        this._initTimerSeconds()
    }

    _clearTimer() {
        clearInterval(this.myIntervalPriceStep)
        clearInterval(this.myIntervalSeconds)
    }

    _handleKeyDownEvent(event) {
        const { bidState, counterAuction,
            isBidGain, bid, priceStart, spaceBarPressed, bidStartTimestamp,
            bidStopTimestamp, demoModalWasAlreadyOpen } = this.state

        if (event.keyCode === SPACE_KEY_CODE) { //Transition between screens
            if (DEBUG) console.log("SPACE_KEY")

            if (bidState === BID_STATE_NOT_STARTED) { //bid not started yet
                if (this.props.demo && !demoModalWasAlreadyOpen) {
                    this.setState(({
                        bidState: BID_STATE_DEMO,
                        demoModalOpen: true,
                        demoModalWasAlreadyOpen: true
                    }))
                } else {
                    this.setState(({
                        bidState: BID_STATE_RUNNING,
                        bidStartTimestamp: Date.now()
                    }), () => {
                        this._initConfig(); //start timer
                    });
                }
            } else if (bidState === BID_STATE_RUNNING) { //bid currently running
                let isBidGain = bid < priceStart
                let spaceBarPressed = true
                this._finishBidAndSaveData(isBidGain, spaceBarPressed)
            }

            if (DEBUG) console.log(this.state)
        } else if (event.keyCode === ENTER_KEY_CODE) {
            if (bidState === BID_STATE_FINISHED) { //Se cierra el modal y se pasa al siguiente hotel
                //Cycle between the hotels (30)
                if (counterAuction < (this.props.data.length - 1)) {
                    //save results
                    this.setState(({ counterAuction }) => ({
                        bidState: BID_STATE_NOT_STARTED,
                        counterAuction: counterAuction + 1,
                        bid: this.props.data[counterAuction + 1].priceStart,
                        priceStart: this.props.data[counterAuction + 1].priceStart,
                        auctionLength: this.props.data[counterAuction + 1].auctionLength,
                        spaceBarPressed: false,
                        timeCount: 0,
                        modalOpen: false
                    }));
                }

                let bidTmp = isBidGain ? bid : priceStart
                let bidResult = {
                    priceStart: priceStart,
                    bid: bidTmp,
                    spaceBarPressed: spaceBarPressed,
                    bidOrder: (counterAuction + 1),
                    hotelId: this.props.data[counterAuction].hotelId,
                    hotelName: this.props.data[counterAuction].hotelName,
                    bidStartTimestamp: bidStartTimestamp,
                    bidStopTimestamp: bidStopTimestamp
                }

                this.props.action(bidResult)
            } else if (bidState === BID_STATE_DEMO) {
                this.setState(({
                    bidState: BID_STATE_RUNNING,
                    bidStartTimestamp: Date.now(),
                    demoModalOpen: false
                }), () => {
                    this._initConfig(); //start timer
                });
            }

        }
    }

    render() {
        const { counterAuction, bid, modalOpen, demoModalOpen, isBidGain, priceStart, bidState, footerTextMessage, gainText, looseText } = this.state
        const counterHotel = counterAuction + 1 + this.props.imageIndex
        const imgA = `http://nielek.home.pl/psychology/pictures/h${counterHotel}a.jpg`
        const imgB = `http://nielek.home.pl/psychology/pictures/h${counterHotel}b.jpg`
        const imgC = `http://nielek.home.pl/psychology/pictures/h${counterHotel}c.jpg`

        const hotelName = this.props.data[counterAuction].hotelName
        const hotelDescription = this.props.data[counterAuction].hotelDescription

        const AUCTION_GAIN_TEXT_MESSAGE = gainText.replace("$(value)", (priceStart - bid))
        const AUCTION_LOSE_TEXT_MESSAGE = looseText.replace("$(value)", (priceStart))

        const MODAL_BID_TEXT_COLOR = (isBidGain ? GREEN : RED)
        const AUCTION_AFTER_BID_MESSAGE = modalOpen ? (isBidGain ? getModalFormattedText(AUCTION_GAIN_TEXT_MESSAGE) : getModalFormattedText(AUCTION_LOSE_TEXT_MESSAGE)) : ""

        return (
            <Container className="themed-container container-xxl">
                <Modal returnFocusAfterClose={modalOpen} isOpen={modalOpen} size="lg" centered={true}>
                    <ModalBody className="modal-body">
                        <div style={{ paddingTop: "25px", color: MODAL_BID_TEXT_COLOR }}>
                            {AUCTION_AFTER_BID_MESSAGE}
                        </div>
                    </ModalBody>
                </Modal>
                <Modal returnFocusAfterClose={demoModalOpen} isOpen={demoModalOpen} size="lg" centered={true}>
                    <ModalBody className="modal-body">
                        <div style={{ paddingTop: "25px" }}>
                            {getModalFormattedText(AUCTION_TUTORIAL_POPUP_TEXT)}
                        </div>
                    </ModalBody>
                </Modal>

                <Row className="justify-content-md-left">
                    <Col xs="3" style={{ textAlign: "center", marginTop: "2em", padding: "0px" }}>
                        <div className="strikethrough">{priceStart}</div>
                        <div className="title">KUP TERAZ ZA</div>
                        <div className="auction-bid">{bid}</div>
                    </Col>
                    <Col xs="8" style={{ padding: "0px" }}>
                        <Row className="justify-content-md-center">
                            <div className="hotel-name">{hotelName}</div>
                        </Row>
                        {getFormattedText(hotelDescription)}
                        <Row className="justify-content-md-center">
                            <div className="img-container">
                                <Media object src={imgA} className="img-left" />
                                <Media object src={imgB} className="img-middle" />
                                <Media object src={imgC} className="img-right" />
                            </div>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    {(bidState === BID_STATE_NOT_STARTED) ? <Footer text={footerTextMessage} /> : <></>}
                </Row>
            </Container>
        );
    }
}

function getFormattedText(text) { //TODO when FirstTask, we should cache the text so we dont iterate every time
    let children = []

    text.split('<br>')
        .filter((item) => item !== TEXT_EMPTY)
        .forEach((item, index) => { //replace \n with margin bottom to emulate break line
            children.push(<><div className="hotel-description" key={"KEY_" + index}>{item}</div></>)
        });

    return children;
}

function getModalFormattedText(text) { //TODO when FirstTask, we should cache the text so we dont iterate every time
    let children = []

    text.split('<br>')
        .filter((item) => item !== TEXT_EMPTY)
        .forEach((item, index) => { //replace \n with margin bottom to emulate break line
            children.push(<><div className="modal-text" key={"KEY_" + index}>{item}</div></>)
        });

    return children;
}

export default AuctionTask;
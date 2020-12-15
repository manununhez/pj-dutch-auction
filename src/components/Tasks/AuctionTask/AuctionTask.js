import React from "react";
import {
    Container, Row, Col, Media, Modal, ModalBody
} from "reactstrap";

import {
    SPACE_KEY_CODE,
    ENTER_KEY_CODE,
    EVENT_KEY_DOWN,
    FREQ_CHANGE_MS,
    PRICE_STEP,
    AUCTION_GAIN_TEXT,
    AUCTION_LOSE_TEXT,
    ONE_SECOND_MS,
    BID_STATE_NOT_STARTED,
    BID_STATE_RUNNING,
    BID_STATE_FINISHED,
    AUCTION_FOOTER_TEXT,
    AUCTION_REWARD_BONUS_MESSAGE
} from '../../../helpers/constants';

import "./AuctionTask.css";

import FooterV1 from "../../Footers/FooterV1.0";

const DEBUG = (process.env.REACT_APP_DEBUG_LOG === "true") ? true : false;

class AuctionTask extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            counterAuction: 0,
            bid: this.props.data[0].priceStart,
            priceStart: this.props.data[0].priceStart,
            auctionLength: this.props.data[0].auctionLength,
            timeCount: 0,
            bidState: BID_STATE_NOT_STARTED,
            modalOpen: false,
            isBidGain: false,
            bidStartTimestamp: 0,
            bidStopTimestamp: 0
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
                    this._finishBidAndSaveData(false)
                }
            })
        }, ONE_SECOND_MS)
    }

    _finishBidAndSaveData(isBidGain) {
        //Aca el usuario para la apuesta. Se guarda el bid actual y se muestra el dialogo

        //showModal()
        this.setState(({
            bidState: BID_STATE_FINISHED,
            modalOpen: true,
            isBidGain: isBidGain,
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
            isBidGain, bid, priceStart, bidStartTimestamp,
            bidStopTimestamp } = this.state

        if (event.keyCode === SPACE_KEY_CODE) { //Transition between screens
            if (DEBUG) console.log("SPACE_KEY")

            if (bidState === BID_STATE_NOT_STARTED) { //bid not started yet
                this.setState(({
                    bidState: BID_STATE_RUNNING,
                    bidStartTimestamp: Date.now()
                }), () => {
                    this._initConfig(); //start timer
                });
            } else if (bidState === BID_STATE_RUNNING) { //bid currently running
                this._finishBidAndSaveData(true)
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
                        timeCount: 0,
                        modalOpen: false
                    }));
                }

                let bidTmp = isBidGain ? bid : priceStart
                let bidResult = {
                    priceStart: priceStart,
                    bid: bidTmp,
                    hotelId: this.props.data[counterAuction].hotelId,
                    hotelName: this.props.data[counterAuction].hotelName,
                    bidStartTimestamp: bidStartTimestamp,
                    bidStopTimestamp: bidStopTimestamp
                }

                this.props.action(bidResult)
            }

        }
    }

    render() {
        const { counterAuction, bid, modalOpen, isBidGain, priceStart, bidState } = this.state
        const counterHotel = counterAuction + 1 + this.props.imageIndex
        const imgA = `http://nielek.home.pl/psychology/pictures/h${counterHotel}a.jpg`
        const imgB = `http://nielek.home.pl/psychology/pictures/h${counterHotel}b.jpg`
        const imgC = `http://nielek.home.pl/psychology/pictures/h${counterHotel}c.jpg`

        const hotelName = this.props.data[counterAuction].hotelName
        const hotelDescription = this.props.data[counterAuction].hotelDescription
        return (
            <Container className="themed-container" fluid="xl">
                <Modal returnFocusAfterClose={modalOpen} isOpen={modalOpen} size="lg" centered={true}>
                    <ModalBody className="modal-body">
                        <div style={{ color: (isBidGain ? "green" : "red") }}>
                            {isBidGain ?
                                getFormattedText(AUCTION_GAIN_TEXT(priceStart - bid))
                                : getFormattedText(AUCTION_LOSE_TEXT(priceStart))}
                        </div>
                        <br />
                    </ModalBody>
                </Modal>
                <Row className="justify-content-md-center">
                    <div className="hotel-name">{hotelName}</div>
                </Row>
                <Row>
                    <Col xs="3" style={{ textAlign: "center" }}>
                        <div className="strikethrough">{priceStart}</div>
                        <div className="title">KUP TERAZ ZA</div>
                        <div className="auction-bid">{bid}</div>
                    </Col>
                    <Col xs="9">
                        <Row className="justify-content-md-left">
                            {getFormattedText(hotelDescription)}
                        </Row>
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
                    {(bidState === BID_STATE_NOT_STARTED) ? <FooterV1 text={AUCTION_FOOTER_TEXT} /> : <></>}
                </Row>
            </Container>
        );
    }
}

function getFormattedText(text) { //TODO when FirstTask, we should cache the text so we dont iterate every time
    let children = []

    text.split('<br>').forEach(item => { //replace \n with <br>
        if (item !== "")
            children.push(<><br /><div className="hotel-description">{item}</div></>)
    });

    return children;
}

export default AuctionTask;
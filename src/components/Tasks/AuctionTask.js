import React from "react";
import {
    Container, Row, Col, Media, Modal, ModalHeader
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
    AUCTION_FOOTER_TEXT
} from '../../helpers/constants';

import "./AuctionTask.css";

import FooterV1 from "../Footers/FooterV1.0";

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
            isBidGain: false
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
                if (timeCount >= auctionLength) {
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
            isBidGain: isBidGain
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
        const { bidState, counterAuction, isBidGain, bid, priceStart } = this.state

        if (event.keyCode === SPACE_KEY_CODE) { //Transition between screens
            if (DEBUG) console.log("SPACE_KEY")

            if (bidState === BID_STATE_NOT_STARTED) { //bid not started yet
                this.setState(({
                    bidState: BID_STATE_RUNNING
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
                    hotelName: this.props.data[counterAuction].hotelName
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
                <Modal returnFocusAfterClose={modalOpen} isOpen={modalOpen} size="lg" centered={true}
                    style={{ position: "fixed", top: "30%", left: "45%", transform: "translate(-40%, -40%)" }}>
                    <ModalHeader style={{ padding: "4em" }}>
                        <div style={{ textAlign: "center", color: (isBidGain ? "green" : "red") }}>
                            {isBidGain ?
                                getFormattedText(AUCTION_GAIN_TEXT(priceStart - bid))
                                : getFormattedText(AUCTION_LOSE_TEXT(priceStart))}
                        </div>
                        <br />
                    </ModalHeader>
                </Modal>
                <Row className="justify-content-md-center" style={{ padding: "20px" }}>
                    <h2>{hotelName}</h2>
                </Row>
                <Row>
                    <Col xs="3" style={{ textAlign: "center" }}>
                        <div className="strikethrough">{priceStart}</div>
                        <div style={{ display: "inline-block", fontSize: "27pt", fontWeight: "bold" }}>KUP TERAZ ZA</div>
                        <div className="auction-bid">{bid}</div>
                    </Col>
                    <Col xs="9">
                        <Row className="justify-content-md-left">
                            {getFormattedText(hotelDescription)}
                        </Row>
                        <Row className="justify-content-md-center">
                            <div style={{ display: "flex", marginTop: "1em", marginBottom: "1em" }}>
                                <Media object src={imgA} style={{ height: "150px", paddingLeft: "1em", paddingRight: "0.5em" }} alt="Generic placeholder image" />
                                <Media object src={imgB} style={{ height: "150px", paddingLeft: "0.5em", paddingRight: "0.5em" }} alt="Generic placeholder image" />
                                <Media object src={imgC} style={{ height: "150px", paddingLeft: "0.5em", paddingRight: "1em" }} alt="Generic placeholder image" />
                            </div>
                        </Row>
                    </Col>
                </Row>
                <Row>
                { (bidState === BID_STATE_NOT_STARTED) ? <FooterV1 text={AUCTION_FOOTER_TEXT} /> : <></>}
                </Row>
            </Container>
        );
    }
}

function getFormattedText(text) { //TODO when FirstTask, we should cache the text so we dont iterate every time
    let children = text.split('<br>').map(function (item, key) { //replace \n with <br>
        if (item !== "")
            return (<><br /><h4>{item}</h4></>)
    });

    return children;
}

export default AuctionTask;
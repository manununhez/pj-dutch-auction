import React from "react";

import { BRANDS } from '../../helpers/constants';

import "./AuctionTask.css";

// reactstrap components
import {
    Container,
    Row,
    Col,
    Media,
    Alert,
    Card,
    FormGroup,
    Label,
    Input
} from "reactstrap";

import {
    SPACE_KEY_CODE,
    EVENT_KEY_DOWN
} from '../../helpers/constants';

class AuctionTask extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            counterAuction: 0,
            auctionResults: []
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
    }

    _handleKeyDownEvent(event) {
        if (event.keyCode === SPACE_KEY_CODE) { //Transition between screens
            console.log("SPACE_KEY")
            const { counterAuction, auctionResults } = this.state
            console.log("Counter: " + counterAuction)
            console.log("this.props.data.size: " + this.props.data.length)
            if (counterAuction < (this.props.data.length - 1)) {
                //Implement timer logic
                //Here should be saved bid
                //save results
                auctionResults.push(1)

                this.setState(({ counterAuction }) => ({
                    counterAuction: counterAuction + 1,
                    auctionResults: auctionResults
                }));
            } else { //(counterAuction < (this.props.data.length)) We are in the last screen, so we dont update the counter again because causes ArrayIndexNotFound
                //We sent the last results without saving in state
                auctionResults.push(1)

                this.props.action(auctionResults)
            }

            console.log(this.state)
        }
    }

    render() {
        const { counterAuction } = this.state
        const counter = counterAuction + 1 + this.props.imageIndex
        const imgA = `http://nielek.home.pl/psychology/pictures/h${counter}a.jpg`
        const imgB = `http://nielek.home.pl/psychology/pictures/h${counter}b.jpg`
        const imgC = `http://nielek.home.pl/psychology/pictures/h${counter}c.jpg`
        return (
            <Container className="justify-content-md-center">
                <Row className="justify-content-md-center" style={{ padding: "20px" }}>
                    <h2>{this.props.data[counterAuction].hotelName}</h2>
                </Row>
                <Row>
                    <Col xs="3">
                        <Row>
                            <div className="strikethrough"> 800</div>
                        </Row>
                        <Row>
                            <div style={{ display: "inline-block", fontSize: "30pt", fontWeight: "bold" }}>KUP TERAZ ZA</div>
                        </Row>
                        <Row>
                            <div className="auction-bid"> 800</div>
                        </Row>
                    </Col>
                    <Col xs="9">
                        <Row className="justify-content-md-center">
                            {getFormattedText(this.props.data[counterAuction].hotelDescription)}
                        </Row>
                        <Row className="justify-content-md-center">
                            <Col>
                                <Media object src={imgA} style={{ height: "150px" }} alt="Generic placeholder image" />
                            </Col>
                            <Col>
                                <Media object src={imgB} style={{ height: "150px" }} alt="Generic placeholder image" />
                            </Col>
                            <Col>
                                <Media object src={imgC} style={{ height: "150px" }} alt="Generic placeholder image" />
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </Container>
        );
    }
}

function getFormattedText(text) { //TODO when FirstTask, we should cache the text so we dont iterate every time
    let children = text.split('<br>').map(function (item, key) { //replace \n with <br>
        return (<h4>{item}</h4>)
    });

    return children;
}

export default AuctionTask;
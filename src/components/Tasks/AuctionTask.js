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

class AuctionTask extends React.Component {
    render() {
        const counter = this.props.counter
        const imgA = `http://nielek.home.pl/psychology/pictures/h${counter}a.jpg`
        const imgB = `http://nielek.home.pl/psychology/pictures/h${counter}b.jpg`
        const imgC = `http://nielek.home.pl/psychology/pictures/h${counter}c.jpg`
        return (
            <Container className="justify-content-md-center">
                <Row className="justify-content-md-center" style={{ padding: "20px" }}>
                    <h2>{this.props.data.hotelName}</h2>
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
                            {getFormattedText(this.props.data.hotelDescription)}
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
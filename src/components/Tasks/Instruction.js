import React from "react";

import { Container, Row } from "reactstrap";

import "./style.css";

import {
    AUCTION_INSTRUCTION_DEMO_SCREEN,
    AUCTION_INSTRUCTION_SCREEN
} from '../../helpers/constants';

class Instruction extends React.Component {
    render() {
        return (
            <Container fluid="md">
                {this.props.name === AUCTION_INSTRUCTION_DEMO_SCREEN ?
                    <Row className="justify-content-md-center">
                        <div className="instr-title">Instrukcja</div>
                    </Row>
                    : <></>}
                {this.props.name === AUCTION_INSTRUCTION_SCREEN ?
                    <Row className="justify-content-md-center">
                        <div className="instr-title">Początek zadania</div>
                    </Row>
                    : <></>}
                <Row className="justify-content-md-center">
                    {this.props.text}
                </Row>
            </Container>
        )
    };
}

export default Instruction;
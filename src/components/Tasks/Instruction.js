import React from "react";

import { Container, Col, Row, Table } from "reactstrap";


import ReactStars from "react-rating-stars-component";

// get our fontawesome imports
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ATTRIBUTE_CUSTOM, SECOND_INSTRUCTION_SCREEN, ACTIVE_STAR, HIDDEN_STAR } from '../../helpers/constants';

class Instruction extends React.Component {
    render() {
        return (
            <Container fluid="md">
                <Row className="justify-content-md-center" style={{ padding: "20px" }}>
                    {this.props.text}
                </Row>
                <Row className="justify-content-md-center">
                    <Col lg="8" style={{ marginTop: "20px" }}>
                        {this.props.name === SECOND_INSTRUCTION_SCREEN ? getRatingStarBarTable() : <></>}
                    </Col>
                </Row>
            </Container>
        )
    };
}

/**
 * 
 */
function getRatingStarBarTable() {
    return (
        <Table responsive borderless size="sm">
            <thead>
                <tr>
                    <th><h5>Właściwość</h5></th>
                    <th><h5>Ważność</h5></th>
                </tr>
            </thead>
            <tbody>
                {/* TODO Actualizar estos atributos */}
                <tr>
                    <td style={{ textAlign: 'left', fontSize: '1.3em' }}>{ATTRIBUTE_CUSTOM.data.text[0]}</td>
                    <td className="align-middle">{RatingBarDemo(6)}</td>
                </tr>
                <tr>
                    <td style={{ textAlign: 'left', fontSize: '1.3em' }}>{ATTRIBUTE_CUSTOM.data.text[1]}</td>
                    <td className="align-middle">{RatingBarDemo(5)}</td>
                </tr>
                <tr>
                    <td style={{ textAlign: 'left', fontSize: '1.3em' }}>{ATTRIBUTE_CUSTOM.data.text[2]}</td>
                    <td className="align-middle">{RatingBarDemo(4)}</td>
                </tr>
                <tr>
                    <td style={{ textAlign: 'left', fontSize: '1.3em' }}>{ATTRIBUTE_CUSTOM.data.text[3]}</td>
                    <td className="align-middle">{RatingBarDemo(3)}</td>
                </tr>
                <tr>
                    <td style={{ textAlign: 'left', fontSize: '1.3em' }}>{ATTRIBUTE_CUSTOM.data.text[4]}</td>
                    <td className="align-middle">{RatingBarDemo(2)}</td>
                </tr>
                <tr>
                    <td style={{ textAlign: 'left', fontSize: '1.3em' }}>{ATTRIBUTE_CUSTOM.data.text[5]}</td>
                    <td className="align-middle">{RatingBarDemo(1)}</td>
                </tr>
            </tbody>
        </Table>
    );
}


/**
 * 
 * @param {*} value 
 */
function RatingBarDemo(value) {
    return (<ReactStars
        edit={false}
        size={20}
        count={6}
        value={value}
        half={false}
        color1={HIDDEN_STAR}
        color2={ACTIVE_STAR}
        emptyIcon={<FontAwesomeIcon icon={faPlus} style={{ marginLeft: "5px" }} />}
        filledIcon={<FontAwesomeIcon icon={faPlus} style={{ marginLeft: "5px" }} />}
    />);
}

export default Instruction;
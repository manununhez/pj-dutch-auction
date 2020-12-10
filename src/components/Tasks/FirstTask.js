import React from 'react';

// reactstrap components
import { Col, Container, Row, Table, Alert, Modal, ModalHeader, Card, CardBody } from "reactstrap";

import ReactStars from "react-rating-stars-component";

// get our fontawesome imports
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faSmile, faFrown } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    FIRST_TASK_PROPERTIES_TOTAL, FIRST_RADIO_VALUE, SECOND_RADIO_VALUE,
    THIRD_RADIO_VALUE, ACTIVE_STAR, HIDDEN_STAR, TEXT_FOOTER, SHOW_FEEDBACK_TRUE
} from '../../helpers/constants';

class FirstTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: []
        }
        this.toggle = this._toggle.bind(this);
    }

    _toggle(evt) {
        const { selectedOption } = this.state

        let selectedValue = evt.target.value

        selectedOption.push(selectedValue)

        this.props.action(selectedValue);

        this.setState({ selectedOption: selectedOption })
    }


    render() {
        const showFeedback = this.props.data[(this.props.counter * FIRST_TASK_PROPERTIES_TOTAL) - FIRST_TASK_PROPERTIES_TOTAL].showFeedback;
        const showFeedbackCorrectAnswer = this.props.result.isCorrectAnswer[this.props.counter - 1]
        return (
            <Container key={"KEY_" + this.props.counter}>
                {this.props.text}
                <Alert style={{ fontSize: "1.0rem" }} color="warning" isOpen={this.props.error.showError}>
                    <span className="alert-inner--text ml-1">
                        {this.props.error.textError}
                    </span>
                </Alert>
                <Modal returnFocusAfterClose={this.props.modalOpen} isOpen={this.props.modalOpen} style={{ position: "fixed", top: "40%", left: "45%", transform: "translate(-40%, -40%)" }}>
                    <ModalHeader style={{ padding: "4em" }}>
                        {/* if showsFeedback -- we take the first element of the showFeedback column attribute*/}
                        {(showFeedback === SHOW_FEEDBACK_TRUE)
                            ? <div style={{ textAlign: "center" }}>
                                {/* if correct Answer */}
                                {showFeedbackCorrectAnswer ? <FontAwesomeIcon color="green" icon={faSmile} size="4x" />
                                    : <FontAwesomeIcon color="red" icon={faFrown} size="4x" />}
                            </div>
                            : <></>
                        }
                        <br /><div><h4>{TEXT_FOOTER}</h4></div>
                    </ModalHeader>
                </Modal>
                <Row className="justify-content-center">
                    <Card><CardBody style={{ marginTop: "20px" }}>
                        <Col lg="auto">
                            <div>{getRatingStarBarTable(this.props.data, this.props.counter)}</div>
                        </Col>
                    </CardBody></Card>
                    <Card><CardBody style={{ marginTop: "20px" }}>
                        <Col lg="auto">
                            <div>{getTable(this.state.selectedOption[this.props.counter - 1], this.props.data, this.props.counter, this.toggle)}</div>
                        </Col>
                    </CardBody></Card>
                </Row>
            </Container>
        );
    }

}

/**
 * 
 * @param {*} data 
 * @param {*} counter 
 * @param {*} selectedValue 
 * @param {*} toggle 
 */
function getTable(selectedValue, data, counter, toggle) {
    return (
        <Table responsive>
            <thead>
                <tr>
                    <th>
                        <button color="primary" id={"btn_" + FIRST_RADIO_VALUE}
                            className={selectedValue === FIRST_RADIO_VALUE ? "btn btn-warning" : "btn btn-primary"} //Values from 1 to length
                            style={{ marginTop: "0px", marginBottom: "0px", fontSize: "0.9em" }}
                            onClick={toggle} value={FIRST_RADIO_VALUE}>
                            Pralka 1
                        </button>
                    </th>
                    <th>
                        <button color="primary" id={"btn_" + SECOND_RADIO_VALUE}
                            className={selectedValue === SECOND_RADIO_VALUE ? "btn btn-warning" : "btn btn-primary"} //Values from 1 to length style={{ marginTop: "0px", marginBottom: "0px", fontSize: "0.9em" }}
                            onClick={toggle} value={SECOND_RADIO_VALUE}>
                            Pralka 2
                        </button>
                    </th>
                    <th>
                        <button color="primary" id={"btn_" + THIRD_RADIO_VALUE}
                            className={selectedValue === THIRD_RADIO_VALUE ? "btn btn-warning" : "btn btn-primary"} //Values from 1 to length style={{ marginTop: "0px", marginBottom: "0px", fontSize: "0.9em" }}
                            onClick={toggle} value={THIRD_RADIO_VALUE}>
                            Pralka 3
                        </button>
                    </th>
                </tr>
            </thead>
            <tbody>
                {getTableBody(data, counter)}
            </tbody>
        </Table>
    );
}

/**
 * 
 * @param {*} data 
 * @param {*} counter 
 */
function getTableBody(data, counter) {
    let children = []
    var index_init = (counter * FIRST_TASK_PROPERTIES_TOTAL) - FIRST_TASK_PROPERTIES_TOTAL;//from 1, to avoid the header name of the cell. e.g.,videos.id[0] == title
    for (let i = index_init; i < (counter * FIRST_TASK_PROPERTIES_TOTAL); i++) {
        children.push(
            <tr key={i}>
                <td style={{ textAlign: 'center', fontSize: '1.3em' }}>{boldStyle(data[i].p1, data[i].pralka1)}</td>
                <td style={{ textAlign: 'center', fontSize: '1.3em' }}>{boldStyle(data[i].p2, data[i].pralka2)}</td>
                <td style={{ textAlign: 'center', fontSize: '1.3em' }}>{boldStyle(data[i].p3, data[i].pralka3)}</td>
            </tr>
        );
    }

    return children;
}

/**
 * 
 * @param {*} isBold 
 * @param {*} data 
 */
function boldStyle(isBold, data) {
    if (isBold === "1") //true, bold
        return (<strong>{data}</strong>);
    else return (<>{data}</>);
}

/**
 * 
 * @param {*} data 
 * @param {*} counter 
 */
function getPropertiesTableBody(data, counter) {
    let children = []
    let index_final = counter * FIRST_TASK_PROPERTIES_TOTAL;
    let index_init = index_final - FIRST_TASK_PROPERTIES_TOTAL;//from 1, to avoid the header name of the cell. e.g.,videos.id[0] == title
    let rating = 6; //6 stars
    for (let i = index_init; i < index_final; i++) {
        children.push(
            <tr key={i}>
                <td style={{ textAlign: 'left', fontSize: '1.3em' }}>{data[i].property}</td>
                <td className="align-middle">{RatingBarDemo(rating)}</td>
            </tr>
        );
        rating--;
    }

    return children;
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
    />
    );
}

/**
 * 
 * @param {*} data 
 * @param {*} counter 
 */
function getRatingStarBarTable(data, counter) {
    return (
        <Table responsive borderless>
            <thead>
                <tr>
                    <th><h4>Właściwość</h4></th>
                    <th><h4>Ważność</h4></th>
                </tr>
            </thead>
            <tbody>
                {getPropertiesTableBody(data, counter)}
            </tbody>
        </Table>
    );
}

export default FirstTask;
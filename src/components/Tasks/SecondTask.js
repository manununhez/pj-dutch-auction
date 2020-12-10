import React from "react";

import ReactStars from "react-rating-stars-component";

// get our fontawesome imports
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ATTRIBUTE_CUSTOM, ACTIVE_STAR, INACTIVE_STAR } from '../../helpers/constants';

// reactstrap components
import {
    Container,
    Row,
    Col,
    Table,
    Alert,
    Card,
    CardBody
} from "reactstrap";

class SecondTask extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOption: Array(ATTRIBUTE_CUSTOM.data.id.length).fill(0) //initialize and set to zero. This array of size 6, corresponds to each property rating (A1, A2, ...). +1 for the extra attribute added
        }

        this.validateInput = this._validateInput.bind(this);
    }

    _validateInput(id, rating) {
        const selectedOption = this.state.selectedOption;
        let indexItem = 0

        for (let i = 0; i < ATTRIBUTE_CUSTOM.data.id.length; i++) {
            if (ATTRIBUTE_CUSTOM.data.id[i] === id) {
                indexItem = i
                break;
            }
        }

        selectedOption[indexItem] = rating

        if (selectedOption.filter((item) => item === 0).length === 0) //all rating were selected
            this.props.action(selectedOption) //return values

        this.setState({ selectedOption: selectedOption })
    }

    render() {
        return (
            <Container className="justify-content-md-center">
                {this.props.text}
                <Alert style={{ fontSize: "1.0rem" }} color="warning" isOpen={this.props.error.showError}>
                    <span className="alert-inner--text ml-1">
                        {this.props.error.textError}
                    </span>
                </Alert>
                <Row className="justify-content-center">
                    <Card><CardBody style={{ marginTop: "20px" }}>
                        <Col>
                            <Table responsive borderless size="sm">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getTableBodyRatingBar(this.validateInput, this.state.selectedOption)}
                                </tbody>
                            </Table>
                        </Col>
                    </CardBody></Card>
                </Row>
            </Container>
        );
    }
}

/**
 * 
 * @param {*} action 
 * @param {*} rating 
 */
function getTableBodyRatingBar(action, value) {
    let children = [];

    for (let i = 0; i < ATTRIBUTE_CUSTOM.data.id.length; i++) {
        children.push(
            <tr key={ATTRIBUTE_CUSTOM.data.id[i]}>
                <td className="align-middle" style={{ fontSize: '1.2em' }}>{ATTRIBUTE_CUSTOM.data.text[i]}</td>
                <td>{RatingBarDemo(action, ATTRIBUTE_CUSTOM.data.id[i], value[i])}</td>
            </tr>
        );
    }

    return children;
}

/**
 * 
 * @param {*} action 
 * @param {*} id 
 * @param {*} value 
 */
function RatingBarDemo(action, id, value) {
    return (<ReactStars
        size={30}
        count={6}
        value={value}
        half={false}
        onChange={action.bind(this, id)}
        color1={INACTIVE_STAR}
        color2={ACTIVE_STAR}
        emptyIcon={<FontAwesomeIcon icon={faPlus} style={{ marginLeft: "5px" }} />}
        filledIcon={<FontAwesomeIcon icon={faPlus} style={{ marginLeft: "5px" }} />}
    />);
}


export default SecondTask;
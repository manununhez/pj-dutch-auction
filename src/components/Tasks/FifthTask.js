import React from "react";

import NumberFormat from 'react-number-format';
// reactstrap components
import {
    Container,
    Row,
    Alert,
    Card
} from "reactstrap";

const DEBUG = (process.env.REACT_APP_DEBUG_LOG === "true") ? true : false;

class FifthTask extends React.Component {
    constructor(props) {
        super(props);

        this.validateInput = this._validateInput.bind(this);
    }

    _validateInput(id, numberFormat) {
        // let e = { target: { id: id, value: numberFormat.formattedValue } }
        if (DEBUG) console.log(numberFormat.formattedValue)
        this.props.action(numberFormat.formattedValue)
    }

    render() {
        return (
            <Container fluid="md">
                <Row className="justify-content-md-center" style={{ padding: "10px" }}>
                    {this.props.text}
                </Row>
                <Alert style={{ fontSize: "1.0rem" }} color="warning" isOpen={this.props.error.showError}>
                    <span className="alert-inner--text ml-1">
                        {this.props.error.textError}
                    </span>
                </Alert>
                {getQuestions(this.props.questionsText, this.validateInput)}
            </Container>
        )
    };
}

/**
 * 
 * @param {*} data 
 * @param {*} questions 
 * @param {*} action 
 * @param {*} selectedAnswer 
 * @param {*} validateInput 
 */
function getQuestions(text, validateInput) {
    return (<Card body style={{ paddingLeft: '20px', paddingRight: '20px' }}>
        {/* pregunta */}
        <Row style={{ marginTop: "5px" }}>
            {text}
        </Row>
        {/* respuesta */}
        <Row style={{ alignItems: 'center' }}>
            <pre style={{ margingBottom: '0rem' }}> <h6>Około </h6></pre>
            <NumberFormat id={"id_fifth"} autoFocus={true}
                onValueChange={validateInput.bind(this, "id_fifth")} decimalScale={0} />
            <pre style={{ margingBottom: '0rem' }}> <h6> modeli.</h6></pre>
        </Row>
    </Card>
    );
}

export default FifthTask;
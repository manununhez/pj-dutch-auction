import React from "react";

import {
    Card,
    Container,
    Row,
    Col,
    Alert,
    FormGroup,
    Label,
    Input,
    CardBody
} from "reactstrap";

import NumberFormat from 'react-number-format';

import * as constant from '../../helpers/constants';

class PSForm extends React.Component {
    constructor(props) {
        super(props);

        this.validateInput = this._validateInput.bind(this);
    }

    _validateInput(id, numberFormat) {
        const value = numberFormat.formattedValue

        if (isNaN(value) || value === constant.TEXT_EMPTY) return

        let e = { target: { id: id, value: value } }

        this.props.action(e)
    }

    render() {
        return (
            <Container fluid="md">
                <Row className="justify-content-md-center" style={{ padding: "10px" }}>
                    {formatTitle(this.props.data)}
                </Row>
                <Alert style={{ fontSize: "1.0rem" }} color="warning" isOpen={this.props.error.showError}>
                    <span className="alert-inner--text ml-1">
                        {this.props.error.textError}
                    </span>
                </Alert>
                {getQuestions(this.props.data, this.props.action, this.props.output, this.validateInput)}
            </Container>
        )
    };
}

function formatTitle(question) {
    let txtFormatted = question.title.split('\\n').map(function (item, key) { //replace \n with margin bottom to emulate break line
        return (<div className="instr" key={key}>{item}</div>)
    })
    let key = "KEY_" + txtFormatted.length

    return getFontSizeTitle(txtFormatted, question.titleFontSize, key)
}

/**
 * 
 * @param {*} data 
 * @param {*} questions 
 * @param {*} action 
 * @param {*} selectedAnswer 
 * @param {*} validateInput 
 */
function getQuestions(question, action, selectedAnswer, validateInput) {

    let questionScheme = []
    // pregunta
    questionScheme.push(
        getFontSizeQuestion(question.question, question.questionFontSize, question.questionCode)
    );
    // respuesta
    if (question.type === constant.INPUT_TYPE) {
        questionScheme.push(
            <div style={{ display: "flex", alignItems: 'center' }}>
                <NumberFormat id={question.questionCode} autoFocus={true} onValueChange={validateInput.bind(this, question.questionCode)} decimalSeparator="," />
                <pre style={{ margingBottom: '0rem' }}> <h6>{question.answer}</h6></pre>
            </div>
        );
    } else if (question.type === constant.MULTIPLE_CHOICES_TYPE) {
        questionScheme.push(
            getMultipleOptions(question.answer, question.questionCode, action, selectedAnswer)
        );
    }

    return (
        <Card>
            <CardBody style={{ padding: '2em' }} key={question.questionCode}>{questionScheme}</CardBody>
        </Card>);// marginTop: '20px',
}

/**
 * 
 * @param {*} answers 
 * @param {*} questionCode 
 * @param {*} action 
 * @param {*} selectedAnswer 
 */
function getMultipleOptions(answers, questionCode, action, selectedAnswer) {
    let children = answers.map((answer) => {
        return (
            <FormGroup check>
                <Label>
                    <Input type="radio"
                        id={questionCode}
                        name="radio-button-demo"
                        value={answer}
                        onChange={action}
                        checked={isSelected(questionCode, selectedAnswer, answer)} />{' '}
                    {answer}
                </Label>
            </FormGroup>
        )
    });

    return (<Col lg="auto" style={{ marginTop: '1.5em' }}>{children}</Col>)
}

/**
 * 
 * @param {*} questionCode 
 * @param {*} selectedAnswer 
 * @param {*} answer 
 */
function isSelected(questionCode, selectedAnswer, answer) {
    let isSelected = false;
    for (let i = 0; i < selectedAnswer.length; i++) {
        if (selectedAnswer[i].questionCode === questionCode && selectedAnswer[i].answer === answer) {
            isSelected = true;
            break;
        }
    }

    return isSelected;
}

/**
 * 
 * @param {*} item 
 * @param {*} fontSize 
 * @param {*} key 
 */
function getFontSizeQuestion(item, fontSize, key) {
    let children = [];

    if (item !== constant.TEXT_EMPTY) {
        switch (fontSize) {
            case constant.FONT_SIZE_HEADING1:
                children.push(<h1 className="mb-2" key={"KEY_" + key}>{item}</h1>)
                break;
            case constant.FONT_SIZE_HEADING2:
                children.push(<h2 className="mb-2" key={"KEY_" + key}>{item}</h2>)
                break;
            case constant.FONT_SIZE_HEADING3:
                children.push(<h3 className="mb-2" key={"KEY_" + key}>{item}</h3>)
                break;
            case constant.FONT_SIZE_HEADING4:
                children.push(<h4 className="mb-2" key={"KEY_" + key}>{item}</h4>)
                break;
            case constant.FONT_SIZE_HEADING5:
                children.push(<h5 className="mb-2" key={"KEY_" + key}>{item}</h5>)
                break;
            case constant.FONT_SIZE_HEADING6:
                children.push(<h6 className="mb-2" key={"KEY_" + key}>{item}</h6>)
                break;
            default:
        }
    }

    return children;
}

function getFontSizeTitle(item, fontSize, key) {
    if (item !== constant.TEXT_EMPTY) {
        switch (fontSize) {
            case constant.FONT_SIZE_HEADING1:
                return (<div className="instr-h1" key={key}>{item}</div>)
            case constant.FONT_SIZE_HEADING2:
                return (<div className="instr-h2" key={key}>{item}</div>)
            case constant.FONT_SIZE_HEADING3:
                return (<div className="instr-h3" key={key}>{item}</div>)
            case constant.FONT_SIZE_HEADING4:
                return (<div className="instr-h4" key={key}>{item}</div>)
            case constant.FONT_SIZE_HEADING5:
                return (<div className="instr-h5" key={key}>{item}</div>)
            case constant.FONT_SIZE_HEADING6:
                return (<div className="instr-h6" key={key}>{item}</div>)
            default:
                return (<div className="instr-h3" key={key}>{item}</div>)
        }
    }
}

export default PSForm;
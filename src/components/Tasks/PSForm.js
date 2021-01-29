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

        this.state = {
            currentQuestion: this.props.data[0],
            currentQuestionNumber: 0,
            currentResult: constant.TEXT_EMPTY,
            error: {
                showError: false,
                textError: constant.TEXT_EMPTY
            }
        }
    }

    componentDidMount() {
        //for keyboard detection
        document.addEventListener(constant.EVENT_KEY_DOWN, this.handleKeyDownEvent, false);

        // HTML prevent space bar from scrolling page
        window.addEventListener(constant.EVENT_KEY_DOWN, function (e) {
            if (e.keyCode === constant.SPACE_KEY_CODE && e.target === document.body) {
                e.preventDefault();
            }
        });
    }

    componentWillUnmount() {
        document.removeEventListener(constant.EVENT_KEY_DOWN, this.handleKeyDownEvent, false);
    }

    handleKeyDownEvent = (event) => {
        if (event.keyCode === constant.SPACE_KEY_CODE) { //Transition between screens
            this._validateResults()
        }
    }

    _validateResults() {
        const { currentQuestionNumber, currentResult } = this.state

        if (currentResult === undefined || currentResult === constant.TEXT_EMPTY) {
            const error = { showError: true, textError: constant.ERROR_9 }
            this.setState({ error: error })
        } else {
            if (currentQuestionNumber === (this.props.data.length - 1)) {
                this._finishAndSendResults()
            } else {
                this._goToNextQuestion()
            }
        }
    }

    _goToNextQuestion() {
        const { currentResult, currentQuestion } = this.state
        const result = { questionCode: currentQuestion.questionCode, answer: currentResult }
        const error = { showError: false, textError: constant.TEXT_EMPTY }

        this.setState(({ currentQuestionNumber }) => ({
            currentQuestionNumber: currentQuestionNumber + 1,
            currentQuestion: this.props.data[currentQuestionNumber + 1],
            currentResult: constant.TEXT_EMPTY,
            error: error
        }), () => {
            this.props.action(result)
        })
    }

    _finishAndSendResults() {
        const { currentResult, currentQuestion } = this.state
        const result = { questionCode: currentQuestion.questionCode, answer: currentResult }
        const error = { showError: false, textError: constant.TEXT_EMPTY }

        this.setState(({
            currentResult: constant.TEXT_EMPTY,
            error: error
        }), () => {
            this.props.action(result)
        })
    }

    validateInput = (id, numberFormat) => {
        const value = numberFormat.formattedValue
        const error = { showError: false, textError: constant.TEXT_EMPTY } //This would clean the previous error message, if it was shown

        if (isNaN(value)) return

        this.setState({ currentResult: value, error: error })
    }

    validateMultipleChoicesType = (evt) => {
        const id = evt.target.id
        const value = evt.target.value
        const error = { showError: false, textError: constant.TEXT_EMPTY } //This would clean the previous error message, if it was shown

        if (id === undefined || id === constant.TEXT_EMPTY ||
            value === undefined || value === constant.TEXT_EMPTY) return

        this.setState({ currentResult: value, error: error })
    }

    render() {
        const { currentQuestion, error } = this.state
        const { showError, textError } = error

        return (
            <Container fluid="md">
                <Row className="justify-content-md-center" style={{ padding: "10px" }}>
                    {formatTitle(currentQuestion)}
                </Row>
                <Alert style={{ fontSize: "1.0rem" }} color="warning" isOpen={showError}>
                    <span className="alert-inner--text ml-1">
                        {textError}
                    </span>
                </Alert>
                {getQuestions(currentQuestion, this.validateMultipleChoicesType, this.validateInput)}
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
function getQuestions(question, validateMultipleChoices, validateInput) {

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
            getMultipleOptions(question.answer, question.questionCode, validateMultipleChoices)
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
function getMultipleOptions(answers, questionCode, validateMultipleChoices) {
    let children = answers.map((answer) => {
        return (
            <FormGroup check>
                <Label>
                    <Input type="radio"
                        id={questionCode}
                        name="radio-button-demo"
                        value={answer}
                        onChange={validateMultipleChoices}
                    />{' '}
                    {answer}
                </Label>
            </FormGroup>
        )
    });

    return (<Col lg="auto" style={{ marginTop: '1.5em' }}>{children}</Col>)
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
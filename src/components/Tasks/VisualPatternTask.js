import React from "react";

// reactstrap components
import {
    Container,
    Row,
    Col,
    Table,
    Card,
    CardBody
} from "reactstrap";

import {
    VISUAL_PATTERN_DIMENTION,
    VISUAL_PATTERN_TIMESCREEN_SECS,
    VISUAL_PATTERN_RETRY_ATTEMPTS,
    ONE_SECOND_MS,
    TILE_SUCCESS,
    TILE_EMPTY,
    TILE_ERROR,
    TILE_LEFT,
    SPACE_KEY_CODE,
    EVENT_KEY_DOWN,
    VISUAL_PATTERN_TEXT1,
    VISUAL_PATTERN_TEXT2,
    VISUAL_PATTERN_TEXT_START_PRESS_SPACE,
    VISUAL_PATTERN_RESULTS_CORRECT,
    VISUAL_PATTERN_RESULTS_FAILED,
    VISUAL_PATTERN_RESULTS_PRESS_SPACE
} from '../../helpers/constants';

import { randomNumber } from '../../helpers/utils';

const DEBUG = (process.env.REACT_APP_DEBUG_LOG === "true") ? true : false;

class VisualPatternTask extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visualTaskData: {
                row: 0,
                column: 0,
                blues: 0, //amount of blue tiles
                matrix: [] //contains the random generated pattern
            },
            level: 0,
            retry: VISUAL_PATTERN_RETRY_ATTEMPTS,
            seconds: VISUAL_PATTERN_TIMESCREEN_SECS,
            matrixResult: [], //contains the piles selected by the user. Initially empty
            matrixCheckResult: [], //this is a mix of matrix and matrixResult, in order to have in one place the errors and the original solution. Use to show "Check results"
            outputData: [],
            logtime: 0,
            isLevelFinished: false,
            showCompletedTable: true,
            showResults: false,
            showInitMessage: true
        };

        this.handleClick = this._handleClick.bind(this);
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

    _initConfig() {
        this._initMatrix();
        this._initTimer();
    }

    _initTimer() {
        this.myInterval = setInterval(() => {
            const { seconds } = this.state

            if (seconds > 0) {
                if ((seconds - 1) === 0) {
                    this.setState(({ seconds }) => ({
                        seconds: seconds - 1,
                        showCompletedTable: false,
                        logtime: Date.now()
                    }))
                } else {
                    this.setState(({ seconds }) => ({
                        seconds: seconds - 1
                    }))
                }
            } else if (seconds === 0) {
                clearInterval(this.myInterval)
            }
        }, ONE_SECOND_MS)
    }

    _clearTimer() {
        clearInterval(this.myInterval)
    }

    _initMatrix() {
        const { level } = this.state;

        const row = VISUAL_PATTERN_DIMENTION[level][0];
        const column = VISUAL_PATTERN_DIMENTION[level][1];
        const blues = VISUAL_PATTERN_DIMENTION[level][2];
        let matrix = Array(row * column).fill(0);
        let matrixCheckResult = Array(row * column).fill(0);
        let matrixResult = Array(row * column).fill(0);

        let min = 0
        let max = row * column - 1
        for (let i = 0; i < blues;) {
            let number = randomNumber(min, max);
            if (DEBUG) console.log("Random number: " + number)

            if (matrix[number] === TILE_EMPTY) {
                matrix[number] = TILE_SUCCESS;
                matrixCheckResult[number] = TILE_SUCCESS;
                i++;
            }
        }

        this.setState({
            visualTaskData: {
                row: row,
                column: column,
                matrix: matrix,
                blues: blues
            },
            showCompletedTable: true,
            matrixResult: matrixResult,
            matrixCheckResult: matrixCheckResult
        });
    }

    _handleKeyDownEvent(event) {
        if (event.keyCode === SPACE_KEY_CODE) { //Transition between screens
            const { matrixResult, showInitMessage, isLevelFinished, showCompletedTable, showResults, seconds } = this.state
            const isResultsShown = !showCompletedTable && !showInitMessage && showResults && isLevelFinished

            if (isResultsShown) { //the user is checking results and press space to show the message to start the game
                this._saveResults()
            } else if (showInitMessage) { //the user press space to start the game. The game starts!
                this.setState(({ showInitMessage }) => ({
                    showInitMessage: !showInitMessage
                }), () => {
                    this._initConfig();
                })
            } else if (matrixResult.includes(TILE_SUCCESS) && seconds === 0) { //the level game finished, the user press space to check results. Seconds == 0 to avoid press space before toe counter finishes. matrixResult.includes(TILE_SUCCESS) means that at least one tile was selected
                // go to check Results
                this._checkResults()
            }
        }
    }

    _checkResults() {
        const { matrixResult, matrixCheckResult, visualTaskData } = this.state
        const { matrix } = visualTaskData

        matrix.map((value, i) => {
            let selectedValue = TILE_EMPTY
            if (value === matrixResult[i]) {
                selectedValue = value
            } else {
                if (matrixResult[i] === TILE_SUCCESS)
                    selectedValue = TILE_ERROR
                else
                    selectedValue = TILE_LEFT

            }
            matrixCheckResult[i] = selectedValue
        })

        this.setState({
            showResults: true,
            isLevelFinished: true,
            showCompletedTable: false,
            showInitMessage: false,
            matrixCheckResult: matrixCheckResult
        })
    }

    _finishAndSendResults() {
        const { outputData } = this.state;

        this.props.action(outputData)
    }


    _updateGameStatus() {
        const { level, matrixCheckResult, retry } = this.state;
        const VISUAL_PATTERN_LEVELS = VISUAL_PATTERN_DIMENTION.length

        if (matrixCheckResult.includes(TILE_ERROR) || matrixCheckResult.includes(TILE_LEFT)) {
            if (retry > 1) { // 2 times -> 2, 1
                // decrease Retry
                if (DEBUG) console.log("Please, try again");
                this.setState(({ retry }) => ({
                    retry: retry - 1,
                    seconds: VISUAL_PATTERN_TIMESCREEN_SECS,
                }))
            } else {
                if (DEBUG) console.log("Debug only: Game over!")
                this._finishAndSendResults()
            }
        } else {
            if ((level + 1) < VISUAL_PATTERN_LEVELS) {
                // increase Level()
                if (DEBUG) console.log("Great, advance to the next level!");
                this.setState(({ level }) => ({
                    level: level + 1,
                    retry: VISUAL_PATTERN_RETRY_ATTEMPTS,
                    seconds: VISUAL_PATTERN_TIMESCREEN_SECS,
                }))
            } else {
                if (DEBUG) console.log("Debug only: Game finished. Well done!")
                this._finishAndSendResults()
            }
        }
    }

    _saveResults() {
        const { retry, matrixResult, matrixCheckResult, logtime,
            level, visualTaskData, outputData } = this.state;
        const { matrix } = visualTaskData;

        outputData.push({
            matrix: matrix,
            matrixResult: matrixResult,
            matrixCheckResult: matrixCheckResult,
            level: level,
            retry: VISUAL_PATTERN_RETRY_ATTEMPTS - retry,
            timestamp: (Date.now() - logtime) / 1000 //spent time
        })

        this.setState({
            outputData: outputData,
            showInitMessage: true,
            isLevelFinished: false,
            showResults: false
        }, () => {
            this._updateGameStatus()
        })
    }


    _handleClick(index) {
        const { matrixResult, isLevelFinished } = this.state;

        if (!isLevelFinished) { //to avoid double click in a tile already selected

            matrixResult[index] = matrixResult[index] === TILE_SUCCESS ? TILE_EMPTY : TILE_SUCCESS;

            this.setState({
                matrixResult: matrixResult
            })
            if (DEBUG) console.log(matrixResult);
            // if (DEBUG) console.log(matrixCheckResult);
            // if (DEBUG) console.log(this.state);
        }
    }

    render() {
        const { showInitMessage } = this.state;
        return (
            <>
                {showInitMessage ?
                    <h1 style={{
                        position: "fixed", top: "40%", left: "45%", textAlign: "center",
                        transform: "translate(-40%, -40%)"
                    }}>{VISUAL_PATTERN_TEXT1}</h1> :
                    displayTable(this.state, this.handleClick)}
            </>
        );
    }
}

/**
 * 
 * @param {*} state 
 * @param {*} handleClick 
 */
function displayTable(state, handleClick) {
    const { showCompletedTable, visualTaskData, matrixResult, matrixCheckResult, showResults } = state;
    const { row, column, matrix } = visualTaskData;

    return (
        <Container className="justify-content-md-center">
            {showCompletedTable ?
                getDemoTable(row, column, matrix) :
                getTable(row, column, matrix, matrixResult, matrixCheckResult, handleClick, showResults)}
        </Container>)
}

/**
 * 
 * @param {*} TRow 
 * @param {*} TColumn 
 * @param {*} matrix 
 * @param {*} matrixResult 
 * @param {*} matrixCheckResult 
 * @param {*} handleClick 
 * @param {*} showResults 
 */
function getTable(TRow, TColumn, matrix, matrixResult, matrixCheckResult, handleClick, showResults) {
    if (showResults) {
        return getTableResults(TRow, TColumn, matrix, matrixResult, matrixCheckResult)
    } else {
        return getTableTask(TRow, TColumn, matrixResult, handleClick)
    }
}

/**
 * 
 * @param {*} TRow 
 * @param {*} TColumn 
 * @param {*} matrix 
 * @param {*} matrixResult 
 * @param {*} matrixCheckResult 
 */
function getTableResults(TRow, TColumn, matrix, matrixResult, matrixCheckResult) {
    let areErrorsInTable = matrixCheckResult.filter((item) => item === TILE_ERROR).length > 0;
    let areLeftTilesInTable = matrixCheckResult.filter((item) => item === TILE_LEFT).length > 0;

    if (areErrorsInTable || areLeftTilesInTable) { //WRONG
        return (
            <>
                <Row className="justify-content-center">
                    <h4 style={{ textAlign: "center" }}>{VISUAL_PATTERN_RESULTS_FAILED}</h4>
                </Row>
                <Row className="justify-content-center">
                    <Card body style={{ marginTop: "20px", marginBottom: "20px" }}>
                        <Col>
                            <Table responsive bordered size="sm" style={{ width: "100%", marginBottom: "0" }}>
                                <thead>
                                    <tr>
                                        <th className="align-middle" style={{ textAlign: 'center', padding: '7px' }}>Poprawny wzór</th>
                                        <th className="align-middle" style={{ textAlign: 'center', padding: '7px' }}>Twoje zaznaczenie</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ textAlign: '-webkit-center' }}>
                                            {getTableResultsBody(TRow, TColumn, matrix)}
                                        </td>
                                        <td style={{ textAlign: '-webkit-center' }}>
                                            {getTableResultsBody(TRow, TColumn, matrixResult)}
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Card>
                </Row>
                <Row className="justify-content-center">
                    <h4 style={{ textAlign: "center" }}>{VISUAL_PATTERN_RESULTS_PRESS_SPACE}</h4>
                </Row>
            </>);
    } else { //SUCESS
        return (
            <>
                <Row className="justify-content-center">
                    <h4 style={{ textAlign: "center" }}>{VISUAL_PATTERN_RESULTS_CORRECT}</h4>
                </Row>
                <Row className="justify-content-center">
                    <Card style={{ marginTop: "20px", marginBottom: "20px" }}>
                        <CardBody>
                            {getTableResultsBody(TRow, TColumn, matrixCheckResult)}
                        </CardBody>
                    </Card>
                </Row>
                <Row className="justify-content-center">
                    <h4 style={{ textAlign: "center" }}>{VISUAL_PATTERN_RESULTS_PRESS_SPACE}</h4>
                </Row>
            </>);
    }
}

/**
 * 
 * @param {*} TRow 
 * @param {*} TColumn 
 * @param {*} matrixToDraw 
 */
function getTableResultsBody(TRow, TColumn, matrixToDraw) {
    let children = [];

    for (let i = 0; i < TRow; i++) {
        children.push(
            <tr key={"key_" + TRow + "_" + TColumn + "_" + i}>
                {getResultColumns(i, TRow, TColumn, matrixToDraw)}
            </tr>
        );
    }

    return (
        <Table responsive bordered size="sm" style={{ width: "50%", marginBottom: "0" }}>
            <tbody>
                {children}
            </tbody>
        </Table>);
}

/**
 * 
 * @param {*} row 
 * @param {*} TRow 
 * @param {*} TColumn 
 * @param {*} matrixToDraw 
 */
function getResultColumns(row, TRow, TColumn, matrixToDraw) {
    let children = [];

    let rows = (matrixToDraw.length / TRow) * (row + 1);

    for (let i = 0; i < TColumn; i++) {
        let currentDataIndex = (rows - (TColumn - (i + 1))) - 1;
        let backgroundColor = '';

        backgroundColor = (matrixToDraw[currentDataIndex] === TILE_SUCCESS ? 'blue' : 'white')

        children.push(
            <td className="align-middle" key={"key_td_" + TRow + "_" + TColumn + "_" + i}
                style={{
                    padding: '2.5rem', fontSize: '1.2em', backgroundColor: backgroundColor
                }} />
        );
    }

    return children;
}

/**
 * 
 * @param {*} TRow 
 * @param {*} TColumn 
 * @param {*} matrixToDraw 
 * @param {*} handleClick 
 */
function getTableTask(TRow, TColumn, matrixToDraw, handleClick) {
    let children = [];

    for (let i = 0; i < TRow; i++) {
        children.push(
            <tr key={"key_" + TRow + "_" + TColumn + "_" + i}>
                {getTaskColumns(i, TRow, TColumn, matrixToDraw, handleClick)}
            </tr>
        );
    }

    return (
        <>
            <Row className="justify-content-center">
                <h4 style={{ textAlign: "center" }}>{VISUAL_PATTERN_TEXT2}</h4>
            </Row>
            <Row className="justify-content-center">
                <Card style={{ marginTop: "20px", marginBottom: "20px" }}>
                    <CardBody>
                        <Table responsive bordered size="sm" style={{ width: "50%", marginBottom: "0" }}>
                            <tbody>
                                {children}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Row>
            <Row className="justify-content-center">
                <h4 style={{ textAlign: "center" }}>{VISUAL_PATTERN_TEXT_START_PRESS_SPACE}</h4>
            </Row>
        </>);
}

/**
 * 
 * @param {*} row 
 * @param {*} TRow 
 * @param {*} TColumn 
 * @param {*} matrixToDraw 
 * @param {*} handleClick 
 */
function getTaskColumns(row, TRow, TColumn, matrixToDraw, handleClick) {
    let children = [];

    let rows = (matrixToDraw.length / TRow) * (row + 1);

    for (let i = 0; i < TColumn; i++) {
        let currentDataIndex = (rows - (TColumn - (i + 1))) - 1;
        let backgroundColor = '';

        backgroundColor = (matrixToDraw[currentDataIndex] === TILE_SUCCESS ? 'blue' : 'white')

        children.push(
            <td className="align-middle" key={"key_td_" + TRow + "_" + TColumn + "_" + i}
                onClick={handleClick.bind(this, currentDataIndex)}
                style={{
                    padding: '2.5rem', fontSize: '1.2em', backgroundColor: backgroundColor
                }} />
        );
    }
    return children;
}

/**
 * 
 * @param {*} TRow 
 * @param {*} TColumn 
 * @param {*} data 
 */
function getDemoTable(TRow, TColumn, data) {
    let children = [];

    for (let i = 0; i < TRow; i++) {
        children.push(
            <tr key={"key_tr_" + TRow + "_" + TColumn + "_" + i}>
                {getDemoColumns(i, TRow, TColumn, data)}
            </tr>
        );
    }

    return (<>
        <Row className="justify-content-center">
            <Card style={{ marginTop: "100px", marginBottom: "20px" }}>
                <CardBody>
                    <Table responsive bordered size="sm" style={{ width: "50%", marginBottom: "0" }}>
                        <tbody>
                            {children}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        </Row>
    </>);
}

/**
 * 
 * @param {*} row 
 * @param {*} TRow 
 * @param {*} TColumn 
 * @param {*} data 
 */
function getDemoColumns(row, TRow, TColumn, data) {
    let children = [];

    let rows = (data.length / TRow) * (row + 1);

    for (let i = 0; i < TColumn; i++) {
        let currentDataIndex = (rows - (TColumn - (i + 1))) - 1;
        children.push(
            <td className="align-middle" key={"key_td_" + TRow + "_" + TColumn + "_" + i}
                style={{ padding: '2.5rem', fontSize: '1.2em', backgroundColor: (data[currentDataIndex] ? 'blue' : 'white') }} />
        );
    }
    return children;
}


export default VisualPatternTask;
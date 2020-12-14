import React from "react";

import { Container, Row } from "reactstrap";

import {
    REWARD_BONUS_MESSAGE, REWARD_RESULT_MESSAGE
} from '../../helpers/constants';

const DEBUG = (process.env.REACT_APP_DEBUG_LOG === "true") ? true : false;

class RewardInfo extends React.Component {
    render() {
        return (
            <Container fluid="md">
                <Row className="justify-content-md-center" style={{ padding: "20px" }}>
                {parserResults(this.props.data, this.props.config)}
                </Row>
            </Container>
        )
    };
}

function parserResults(data, config) {
    const threshold = parseFloat(config[0].threshold)
    const bonusPoint = config[0].bonusPoint
    const totalTasks = parseFloat(data.isCorrectAnswer.length);
    const totalCorrect = parseFloat(data.isCorrectAnswer.filter(item => item).length)
    let result = (totalCorrect / totalTasks) * 100;
    if (DEBUG) console.log("result Before: " + result)
    result = result.toFixed(2);
    if (DEBUG) console.log("result After: " + result)

    let textToDisplay = REWARD_RESULT_MESSAGE(result);
    let textBonus = "";

    if (DEBUG) console.log("TotalTasks: " + totalTasks)
    if (DEBUG) console.log("TotalCorrect: " + totalCorrect)
    if (DEBUG) console.log("result: " + result)
    if (DEBUG) console.log("Threshold: "+ threshold)

    if (result >= threshold)
        textBonus = textBonus + REWARD_BONUS_MESSAGE(bonusPoint);

    return (<div style={{ textAlign: "justify" }}>
                <h2>{textToDisplay}</h2><br />
                <h2>{textBonus}</h2><br />
            </div>);
}

export default RewardInfo;
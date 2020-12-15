import React from "react";

import { Container, Row } from "reactstrap";

import {
    REWARD_BONUS_MESSAGE, REWARD_RESULT_MESSAGE
} from '../../helpers/constants';

import { getAppMessage } from '../../helpers/utils';

const DEBUG = (process.env.REACT_APP_DEBUG_LOG === "true") ? true : false;

class RewardInfo extends React.Component {
    render() {
        return (
            <Container fluid="md">
                <Row className="justify-content-md-center" style={{ padding: "20px" }}>
                {parserResults(this.props.data, this.props.reward, this.props.appMessages)}
                </Row>
            </Container>
        )
    };
}

function parserResults(data, reward, appMessages) {
    const threshold = parseFloat(reward.threshold)
    const bonusPoint = reward.bonusPoint
    const totalTasks = parseFloat(data.isCorrectAnswer.length);
    const totalCorrect = parseFloat(data.isCorrectAnswer.filter(item => item).length)
    let result = (totalCorrect / totalTasks) * 100;
    if (DEBUG) console.log("result Before: " + result)
    result = result.toFixed(2);
    if (DEBUG) console.log("result After: " + result)

    let textToDisplay = getAppMessage(REWARD_RESULT_MESSAGE, appMessages).replace("$(result)", result);
    let textBonus = "";

    if (DEBUG) console.log("TotalTasks: " + totalTasks)
    if (DEBUG) console.log("TotalCorrect: " + totalCorrect)
    if (DEBUG) console.log("result: " + result)
    if (DEBUG) console.log("Threshold: "+ threshold)

    if (result >= threshold){
        let tmp = getAppMessage(REWARD_BONUS_MESSAGE, appMessages)
        let bonus = tmp.replace("$(bonus)", bonusPoint)

        textBonus = textBonus + bonus
    }

    return (<div style={{ textAlign: "justify" }}>
                <h2>{textToDisplay}</h2><br />
                <h2>{textBonus}</h2><br />
            </div>);
}

export default RewardInfo;
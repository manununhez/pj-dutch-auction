import React from "react";

import { Container, Row } from "reactstrap";

import {
    REWARD_BONUS_MESSAGE,
    REWARD_RESULT_MESSAGE,
    FEMALE_VALUE,
    AUCTION_REWARD_RESULT_MESSAGE_FEMALE,
    AUCTION_REWARD_RESULT_MESSAGE_MALE
} from '../../helpers/constants';

const DEBUG = (process.env.REACT_APP_DEBUG_LOG === "true") ? true : false;

class RewardAuctionInfo extends React.Component {
    render() {
        return (
            <Container fluid="md">
                <Row className="justify-content-md-center" style={{ padding: "20px" }}>
                    {totalReward(this.props.data, this.props.sex)}
                </Row>
            </Container>
        )
    };
}

function totalReward(data, sex) {
    const savedMoney = data
        .map(li => (li.priceStart - li.bid))
        .reduce((sum, val) => sum + val, 0);
    const textToDisplay = (sex === FEMALE_VALUE) ? getFormattedText(AUCTION_REWARD_RESULT_MESSAGE_FEMALE(savedMoney)) :
        getFormattedText(AUCTION_REWARD_RESULT_MESSAGE_MALE(savedMoney))
    return (<div style={{ textAlign: "justify" }}>
        {textToDisplay}
    </div>);
}

function parserResults(data) {
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

    if (result >= 40.0)
        textBonus = textBonus + REWARD_BONUS_MESSAGE;

    return (<div style={{ textAlign: "justify" }}>
        <h2>{textToDisplay}</h2><br />
        <h2>{textBonus}</h2><br />
    </div>);
}

function getFormattedText(text) { //TODO when FirstTask, we should cache the text so we dont iterate every time
    let children = text.split('<br>').map(function (item, key) { //replace \n with <br>
        if (item !== "")
            return (<><br /><h3>{item}</h3></>)
    });

    return children;
}

export default RewardAuctionInfo;
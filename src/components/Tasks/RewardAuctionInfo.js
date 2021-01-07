import React from "react";

import { Container, Row } from "reactstrap";

import {
    FEMALE_VALUE,
    AUCTION_REWARD_RESULT_MESSAGE_MALE_PART1,
    AUCTION_REWARD_RESULT_MESSAGE_MALE_PART2,
    AUCTION_REWARD_RESULT_MESSAGE_FEMALE_PART1,
    AUCTION_REWARD_RESULT_MESSAGE_FEMALE_PART2,
    AUCTION_REWARD_BONUS_MESSAGE
} from '../../helpers/constants';

import { getAppMessage } from '../../helpers/utils';

class RewardAuctionInfo extends React.Component {
    render() {
        return (
            <Container fluid="md">
                <Row className="justify-content-md-center" style={{ padding: "20px" }}>
                    {totalReward(this.props.data, this.props.sex, this.props.reward, this.props.appMessages)}
                </Row>
            </Container>
        )
    };
}

/**
 * 
 * @param {*} data 
 * @param {*} sex 
 */
function totalReward(data, sex, reward, appMessages) {
    const savedMoney = data
        .map(li => (li.priceStart - li.bid))
        .reduce((sum, val) => sum + val, 0);

    const threshold = parseInt(reward.threshold)

    let textToDisplay1 = ""
    let textToDisplay2 = ""
    if (sex === FEMALE_VALUE) {
        textToDisplay1 = getFormattedText(getAppMessage(AUCTION_REWARD_RESULT_MESSAGE_FEMALE_PART1, appMessages))
        textToDisplay2 = getFormattedText(getAppMessage(AUCTION_REWARD_RESULT_MESSAGE_FEMALE_PART2, appMessages))
    } else {
        textToDisplay1 = getFormattedText(getAppMessage(AUCTION_REWARD_RESULT_MESSAGE_MALE_PART1, appMessages))
        textToDisplay2 = getFormattedText(getAppMessage(AUCTION_REWARD_RESULT_MESSAGE_MALE_PART2, appMessages))
    }

    // ${result}

    let bonus = ""

    if (savedMoney >= threshold) {
        let tmp = getAppMessage(AUCTION_REWARD_BONUS_MESSAGE, appMessages)
        bonus = tmp.replace("$(bonus)", reward.bonusPoint).replace("$(result)", savedMoney)
    }

    return (<div style={{ textAlign: "justify" }}>
        {textToDisplay1}
        { bonus !== "" ? <><h3 style={{ marginTop: "25px" }}>{bonus}</h3></> : <></>}
        {textToDisplay2}
    </div>);
}

/**
 * 
 * @param {*} text 
 */
function getFormattedText(text) { //TODO when FirstTask, we should cache the text so we dont iterate every time
    let children = []

    text.split('<br>').forEach(item => { //replace \n with <br>
        if (item !== "")
            children.push(<><br /><h3>{item}</h3></>)
    });

    return children;
}

export default RewardAuctionInfo;
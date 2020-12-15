import React from "react";

import { Container, Row } from "reactstrap";

import {
    FEMALE_VALUE,
    AUCTION_REWARD_RESULT_MESSAGE_FEMALE,
    AUCTION_REWARD_RESULT_MESSAGE_MALE,
    AUCTION_REWARD_BONUS_MESSAGE
} from '../../helpers/constants';

class RewardAuctionInfo extends React.Component {
    render() {
        return (
            <Container fluid="md">
                <Row className="justify-content-md-center" style={{ padding: "20px" }}>
                    {totalReward(this.props.data, this.props.sex, this.props.reward)}
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
function totalReward(data, sex, reward) {
    const savedMoney = data
        .map(li => (li.priceStart - li.bid))
        .reduce((sum, val) => sum + val, 0);

    const textToDisplay = (sex === FEMALE_VALUE) ? getFormattedText(AUCTION_REWARD_RESULT_MESSAGE_FEMALE(savedMoney)) :
        getFormattedText(AUCTION_REWARD_RESULT_MESSAGE_MALE(savedMoney))

    const threshold = parseInt(reward.threshold)

    let bonus = ""

    if (savedMoney >= threshold) {
        bonus = AUCTION_REWARD_BONUS_MESSAGE(reward.bonusPoint)
    }

    return (<div style={{ textAlign: "justify" }}>
        {textToDisplay}
        { bonus !== "" ? <><br /><h3>{bonus}</h3></> : <></>}
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
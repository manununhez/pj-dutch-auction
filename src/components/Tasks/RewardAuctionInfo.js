import React from "react";

import { Container, Row } from "reactstrap";

import {
    FEMALE_VALUE,
    AUCTION_BID_REWARD_MESSAGE_MALE,
    AUCTION_BID_REWARD_MESSAGE_WITH_BONUS_MALE,
    AUCTION_BID_REWARD_MESSAGE_FEMALE,
    AUCTION_BID_REWARD_MESSAGE_WITH_BONUS_FEMALE,
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
    const isBonusAvailable = savedMoney >= threshold

    let textToDisplay = ""
    if (isBonusAvailable) {
        let message = sex === FEMALE_VALUE ? AUCTION_BID_REWARD_MESSAGE_WITH_BONUS_FEMALE : AUCTION_BID_REWARD_MESSAGE_WITH_BONUS_MALE
        let tmp = getFormattedText(getAppMessage(message, appMessages))
        textToDisplay = tmp.replace("$(bonus)", reward.bonusPoint).replace("$(result)", savedMoney)
    } else {
        let message = sex === FEMALE_VALUE ? AUCTION_BID_REWARD_MESSAGE_FEMALE : AUCTION_BID_REWARD_MESSAGE_MALE
        textToDisplay = getFormattedText(getAppMessage(message, appMessages))
    }

    return (<div style={{ textAlign: "justify" }}>
        {textToDisplay}
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
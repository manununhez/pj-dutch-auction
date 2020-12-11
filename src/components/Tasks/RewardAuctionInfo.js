import React from "react";

import { Container, Row } from "reactstrap";

import {
    FEMALE_VALUE,
    AUCTION_REWARD_RESULT_MESSAGE_FEMALE,
    AUCTION_REWARD_RESULT_MESSAGE_MALE
} from '../../helpers/constants';

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

/**
 * 
 * @param {*} data 
 * @param {*} sex 
 */
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

/**
 * 
 * @param {*} text 
 */
function getFormattedText(text) { //TODO when FirstTask, we should cache the text so we dont iterate every time
    let children = text.split('<br>').map(function (item, key) { //replace \n with <br>
        if (item !== "")
            return (<><br /><h3>{item}</h3></>)
    });

    return children;
}

export default RewardAuctionInfo;
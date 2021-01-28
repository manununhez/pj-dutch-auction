import React from "react";

import { Container, Row } from "reactstrap";

import {
    FEMALE_VALUE,
    AUCTION_BID_RESULT_MESSAGE_MALE,
    AUCTION_BID_RESULT_MESSAGE_FEMALE
} from '../../../helpers/constants';

class AuctionInfo extends React.Component {
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

    let message = sex === FEMALE_VALUE ? AUCTION_BID_RESULT_MESSAGE_FEMALE : AUCTION_BID_RESULT_MESSAGE_MALE
    let tmp = message.replace("$(result)", savedMoney)
    let textToDisplay = getFormattedText(tmp)

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

export default AuctionInfo;
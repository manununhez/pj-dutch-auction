import React from "react";

import { Container, Row } from "reactstrap";

import {
    TEXT_EMPTY,
    FEMALE_VALUE,
    BID_THRESHOLD,
    BID_BONUS,
    SPACE_KEY_CODE,
    EVENT_KEY_DOWN,
    AUCTION_BID_REWARD_MESSAGE_MALE,
    AUCTION_BID_REWARD_MESSAGE_WITH_BONUS_MALE,
    AUCTION_BID_REWARD_MESSAGE_FEMALE,
    AUCTION_BID_REWARD_MESSAGE_WITH_BONUS_FEMALE,
} from '../../helpers/constants';

const DEBUG = (process.env.REACT_APP_DEBUG_LOG === "true") ? true : false;

class RewardAuctionInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rewardAuctionInfo: []
        };

        this.handleKeyDownEvent = this._handleKeyDownEvent.bind(this);
    }

    _calculateReward() {
        const savedMoney = this.props.data
            .map(li => (li.priceStart - li.bid))
            .reduce((sum, val) => sum + val, 0);

        const isBonusAvailable = savedMoney >= BID_THRESHOLD

        this.setState({
            rewardAuctionInfo: { isBonusAvailable: isBonusAvailable, savedMoney: savedMoney }
        }, () => {
            if (DEBUG) console.log(this.state)
        })
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

        this._calculateReward()
    }

    componentWillUnmount() {
        document.removeEventListener(EVENT_KEY_DOWN, this.handleKeyDownEvent, false);
    }

    _handleKeyDownEvent(event) {
        if (event.keyCode === SPACE_KEY_CODE) { //Transition between screens
            const { rewardAuctionInfo } = this.state
            if (DEBUG) console.log("RewardOBTAINED:")
            if (DEBUG) console.log(rewardAuctionInfo.isBonusAvailable)
            this.props.action(rewardAuctionInfo.isBonusAvailable)
        }
    }

    render() {
        const { rewardAuctionInfo } = this.state
        const sex = this.props.sex
        return (
            <Container fluid="md">
                <Row className="justify-content-md-center" style={{ padding: "20px" }}>
                    {totalReward(rewardAuctionInfo, sex)}
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
function totalReward(rewardAuctionInfo, sex) {
    let textToDisplay = ""
    if (rewardAuctionInfo.isBonusAvailable) {
        let message = sex === FEMALE_VALUE ? AUCTION_BID_REWARD_MESSAGE_WITH_BONUS_FEMALE : AUCTION_BID_REWARD_MESSAGE_WITH_BONUS_MALE
        let tmp = message.replace("$(bonus)", BID_BONUS).replace("$(result)", rewardAuctionInfo.savedMoney)

        textToDisplay = getFormattedText(tmp)
    } else {
        let message = sex === FEMALE_VALUE ? AUCTION_BID_REWARD_MESSAGE_FEMALE : AUCTION_BID_REWARD_MESSAGE_MALE
        textToDisplay = getFormattedText(message)
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

    text.split('<br>')
        .filter((item) => item !== TEXT_EMPTY)
        .forEach(item => { //replace \n with <br>
            children.push(<><br /><h3>{item}</h3></>)
        });

    return children;
}

export default RewardAuctionInfo;
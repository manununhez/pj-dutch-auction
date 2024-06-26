import axios from 'axios';
import * as constant from '../helpers/constants';

const _apiHost = 'https://api.swps-pjatk-experiment.co/v2/'; //'http://localhost:5000/'
const fetch_versions_url = 'versions'
const fetch_psform_url = 'psform'
const fetch_apptext_url = 'apptext'
const fetch_inituserdata_url = 'inituserdata'
const fetch_hotels_url = 'hotels';
const fetch_hotels_tutorial_url = 'hotels-tutorial';
const fetch_hotels_rev_url = 'hotels-rev';
const save_auction_bids_url = 'auctionbids';
const save_visualpattern_url = 'visualpattern';
const save_userinfo_url = 'userinfo';
const save_userlogtime_url = 'userlogtime';
const save_usegeneraldata_url = 'usergeneraldata';

async function request(url, params, method = 'GET') {

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    if (params) {
        if (method === 'GET') {
            url += '?' + objectToQueryString(params);
        } else {
            options.data = JSON.stringify(params);
        }
    }

    const response = await axios(url, options);

    if (response.status !== 200) {
        return generateErrorResponse('The server responded with an unexpected status.');
    }

    return response.data;
}

function objectToQueryString(obj) {
    return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
}

function generateErrorResponse(message) {
    return {
        status: 'error',
        message
    };
}

export function get(url, params) {
    return request(_apiHost + url, params);
}

export function create(url, params) {
    return request(_apiHost + url, params, 'POST');
}

//  function update(url, params) {
//   return request(url, params, 'PUT');
// }

// function remove(url, params) {
//   return request(url, params, 'DELETE');
// }

function save(url, data, callback) {
    create(url, data)
        .then((response) => {
            callback({ response });
        }, function (reason) {
            callback(false, reason);
        });
}

/**
 * 
 * @param {*} callback 
 */
export function fetchAuctionHotels(type, callback) {
    let url = ""
    switch (type) {
        case constant.SCENARIO_HOTEL_TUTORIAL:
            url = fetch_hotels_tutorial_url
            break;
        case constant.SCENARIO_HOTEL_NORMAL:
            url = fetch_hotels_url
            break;
        case constant.SCENARIO_HOTEL_REV:
            url = fetch_hotels_rev_url
            break;
        default:
            url = fetch_hotels_url
            break;
    }

    get(url, {})
        .then((response) => {
            let hotels = [];

            for (let value of Object.values(response)) {
                hotels.push(value);
            }
            callback({ hotels });
        }, (response) => {
            callback(false, response);
        });
}

export function fetchUserInitialData(typeTask, callback) {
    let url = fetch_inituserdata_url + '/' + typeTask

    get(url, {})
        .then((response) => {
            const indexFemale = 0
            const indexMale = 1
            const indexScenario1 = 2
            const indexScenario2 = 3

            let screens = [];
            for (let value of Object.values(response.screens)) {
                screens.push({
                    screen: value.screen_name,
                    type: value.screen_type
                });
            }

            let participants = Array(4);
            //TODO MEJORAR ESTO. SE DEBE BUSCAR EL VALOR EN EL ARRAY EN LUGAR DE TENER UN INDEX FIJO
            for (let value of Object.values(response.experimentCount)) {
                if (value.category === 'female') {
                    participants[indexFemale] = [value.group_1, value.group_2, value.group_3]
                } else if (value.category === 'male') {
                    participants[indexMale] = [value.group_1, value.group_2, value.group_3]
                } else if (value.category === 'scenario_1') {
                    participants[indexScenario1] = [value.group_1, value.group_2, value.group_3]
                } else if (value.category === 'scenario_2') {
                    participants[indexScenario2] = [value.group_1, value.group_2, value.group_3]
                }
            }

            callback({ screens, participants });
        }, (response) => {
            callback(false, response);
        });
}

// /**
//  * Load app versions from the spreadsheet
//  * @param {*} callback 
//  */
export function fetchVersions(callback) {
    let url = fetch_versions_url

    get(url, {})
        .then((response) => {
            let versions = [];

            for (let value of Object.values(response)) {
                versions.push({ version: value.name });
            }

            callback({ versions });
        }, (response) => {
            callback(false, response);
        });
}
/**
 * Load psychology questionaries input data from the spreadsheet
 * @param {*} callback 
 */
export function fetchPSFormData(sex, callback) {
    let url = fetch_psform_url + '/' + sex

    get(url, {})
        .then((response) => {
            let result = [];

            for (let value of Object.values(response)) {
                result.push({
                    title: value.main_title,
                    titleFontSize: value.main_title_font_size,
                    questionCode: value.question_code,
                    question: value.question,
                    questionFontSize: value.question_font_size,
                    type: value.question_type,
                    answer: [value.answer_1, value.answer_2, value.answer_3, value.answer_4, value.answer_5, value.answer_6]
                });
            }

            callback({ result });
        }, (response) => {
            callback(false, response);
        });
}

/**
 * Load all the necessary Text structure for the app from the spreadsheet
 * @param {*} callback 
 */
export function fetchAppText(sex, callback) {
    let url = fetch_apptext_url + '/' + sex

    get(url, {})
        .then((response) => {
            let appText = [];

            for (let value of Object.values(response)) {
                appText.push({
                    screen: value.name,
                    size: value.font_size,
                    text: value.text,
                });
            }

            callback({ appText });
        }, (response) => {
            callback(false, response);
        });
}

/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveGeneralData(data, ariadnaUserID, callback) {
    save(save_usegeneraldata_url, usergeneraldata(data, ariadnaUserID), callback)
}

/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveUserPSForm(data, callback) {
    save(fetch_psform_url, userpsform(data), callback)
}

/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveAuctionBids(data, callback) {
    save(save_auction_bids_url, userauctionbids(data), callback)
}

/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveUserInfo(data, callback) {
    save(save_userinfo_url, userinfo(data), callback)
}

/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveUserLogTime(data, callback) {
    save(save_userlogtime_url, userlogtime(data), callback)
}

/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveUserVisualPattern(data, callback) {
    save(save_visualpattern_url, uservisualpattern(data), callback)
}


/**
 * Helpers to format the data in the correct outputvalue
 * for a specific sheet
 */
const usergeneraldata = (data, ariadnaUserID) => {

    let result = []; //should have exactly 14 columns (Column A to N), thats why we fill empty indexes with ""
    for (let j = 0; j < data.length; j++) {
        let output = data[j];
        if (output.task === constant.USER_FORM_SCREEN) {
            result.push([
                output.userID,
                ariadnaUserID,
                output.task,
                output.data.sex,
                output.data.age,
                output.data.profession,
                output.data.yearsEduc,
                output.data.levelEduc,
                output.data.typeAuction,
                constant.TEXT_EMPTY,
                constant.TEXT_EMPTY,
                constant.TEXT_EMPTY,
                constant.TEXT_EMPTY
            ]);
        } else if (output.task === constant.USER_INFO_SCREEN) {
            result.push([
                output.userID,
                ariadnaUserID,
                output.task,
                output.data[0],
                output.data[1],
                output.data[2],
                output.data[3],
                output.data[4],
                output.data[5],
                output.data[6],
                output.data[7],
                output.data[8],
                output.data[9]
            ]);
        } else if (output.task === constant.AUCTION_TASK_SCREEN || output.task === constant.AUCTION_TASK_DEMO_SCREEN) {
            result.push([
                output.userID,
                ariadnaUserID,
                output.task,
                output.data.bidOrder,
                output.data.hotelId,
                output.data.hotelName,
                output.data.priceStart,
                output.data.bid,
                output.data.bidStartTimestamp,
                output.data.bidStopTimestamp,
                output.data.spaceBarPressed,
                constant.TEXT_EMPTY,
                constant.TEXT_EMPTY
            ]);
        } else if (output.task === constant.PSFORM_SCREEN) {
            result.push([
                output.userID,
                ariadnaUserID,
                output.task,
                output.data.questionCode,
                output.data.answer,
                constant.TEXT_EMPTY,
                constant.TEXT_EMPTY,
                constant.TEXT_EMPTY,
                constant.TEXT_EMPTY,
                constant.TEXT_EMPTY,
                constant.TEXT_EMPTY,
                constant.TEXT_EMPTY,
                constant.TEXT_EMPTY
            ]);
        } else if (output.task === constant.VISUAL_PATTERN_SCREEN || output.task === constant.VISUAL_PATTERN_DEMO_SCREEN) {
            let vp1 = output.data.map((item) => {
                return [
                    output.userID,
                    ariadnaUserID,
                    output.task,
                    (item.level + 1), //+1 to be more idiomatic: starts from level 1 insteado of level 0
                    item.dimention,
                    JSON.stringify(item.matrix),
                    JSON.stringify(item.matrixCheckResult),
                    item.matrixCheckResult.filter((element) => element === constant.TILE_SUCCESS).length, //we get the amount of success if any
                    item.matrixCheckResult.filter((element) => element === constant.TILE_ERROR).length, //we get the amount of errors if any
                    item.matrixCheckResult.filter((element) => element === constant.TILE_LEFT).length, //we get the amount of errors if any
                    item.retry,
                    item.timestamp,
                    constant.TEXT_EMPTY
                ]
            });
            result = result.concat(vp1);
        }
    }

    return result;
}

function userinfo(data) {

    const { userID, userInfo, outputFormData, typeTask, ariadnaUserID } = data;

    let result = { info: [], form: [] };

    result.info.push([
        userID,
        userInfo.os.name,
        userInfo.os.version,
        userInfo.browser.name,
        userInfo.browser.version,
        userInfo.browser.major,
        userInfo.browser.language,
        userInfo.engine.name,
        userInfo.engine.version,
        userInfo.screen.width,
        userInfo.screen.height
    ]);

    result.form.push([
        userID,
        ariadnaUserID,
        outputFormData.sex,
        outputFormData.age,
        outputFormData.profession,
        outputFormData.yearsEduc,
        outputFormData.levelEduc,
        outputFormData.typeAuction,
        typeTask
    ]);


    return result;
}

function userauctionbids(data) {
    let result = [];
    // let data = this.props.data;
    const { outputAuctionTask, userID } = data;

    for (let i = 0; i < outputAuctionTask.demo.length; i++) {
        result.push([
            userID,
            constant.AUCTION_TASK_DEMO_SCREEN,
            outputAuctionTask.demo[i].bidOrder,
            outputAuctionTask.demo[i].hotelId,
            outputAuctionTask.demo[i].hotelName,
            outputAuctionTask.demo[i].priceStart,
            outputAuctionTask.demo[i].bid,
            outputAuctionTask.demo[i].bidStartTimestamp,
            outputAuctionTask.demo[i].bidStopTimestamp,
            outputAuctionTask.demo[i].spaceBarPressed,
        ]);
    }

    for (let i = 0; i < outputAuctionTask.task.length; i++) {
        result.push([
            userID,
            constant.AUCTION_TASK_SCREEN,
            outputAuctionTask.task[i].bidOrder,
            outputAuctionTask.task[i].hotelId,
            outputAuctionTask.task[i].hotelName,
            outputAuctionTask.task[i].priceStart,
            outputAuctionTask.task[i].bid,
            outputAuctionTask.task[i].bidStartTimestamp,
            outputAuctionTask.task[i].bidStopTimestamp,
            outputAuctionTask.task[i].spaceBarPressed,
        ]);
    }

    return result;
}

function userlogtime(data) {
    // UserID	QuestionID	QuestionNumber	SelectedAnswer
    let result = [];

    const { logTimestamp, userID } = data;
    const { screen, timestamp } = logTimestamp;

    for (let i = 0; i < screen.length; i++) {
        result.push([
            userID,
            screen[i],
            timestamp[i],
            Math.floor((((i + 1) < screen.length) ? (timestamp[i + 1] - timestamp[i]) : 0) / 1000),
        ]);
    }

    return result;
}

function uservisualpattern(data) {
    const { userID, outputVisualPattern } = data;

    let resultDemo = outputVisualPattern.demo.map((output) => {
        return [
            userID,
            constant.VISUAL_PATTERN_DEMO_SCREEN,
            (output.level + 1),
            output.dimention,
            JSON.stringify(output.matrix),
            JSON.stringify(output.matrixCheckResult),
            output.matrixCheckResult.filter((item) => item === constant.TILE_SUCCESS).length,
            output.matrixCheckResult.filter((item) => item === constant.TILE_ERROR).length,
            output.matrixCheckResult.filter((item) => item === constant.TILE_LEFT).length,
            output.retry,
            output.timestamp,
        ];
    });


    let result = outputVisualPattern.task.map((output) => {
        return [
            userID,
            constant.VISUAL_PATTERN_SCREEN,
            (output.level + 1),
            output.dimention,
            JSON.stringify(output.matrix),
            JSON.stringify(output.matrixCheckResult),
            output.matrixCheckResult.filter((item) => item === constant.TILE_SUCCESS).length,
            output.matrixCheckResult.filter((item) => item === constant.TILE_ERROR).length,
            output.matrixCheckResult.filter((item) => item === constant.TILE_LEFT).length,
            output.retry,
            output.timestamp,
        ];
    });

    return resultDemo.concat(result);
}

function userpsform(data) {
    let result = [];
    const { outputPSForm, userID } = data;

    for (let i = 0; i < outputPSForm.length; i++) {
        result.push([
            userID,
            outputPSForm[i].questionCode,
            outputPSForm[i].answer,
        ]);
    }

    return result;
}


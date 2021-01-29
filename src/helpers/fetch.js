// Fetch.js
import * as constant from '../helpers/constants';

const _apiHost = 'https://api.swps-pjatk-experiment.pl/v2';//'http://localhost:5000'; //
const save_sheet_url = '/v4-post';
const fetch_hotels_url = '/hotels';
const fetch_hotels_tutorial_url = '/hotels-tutorial';
const fetch_hotels_rev_url = '/hotels-rev';

const _newApiHost = 'http://localhost:5000/'
const versions_url = 'versions'
const psform_url = 'psform'
const apptext_url = 'apptext'
const navscreens_url = 'navscreens'
const userexpcount_url = 'userexpcount'

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
            options.body = JSON.stringify(params);
        }
    }

    const response = await fetch(url, options);

    if (response.status !== 200) {
        return generateErrorResponse('The server responded with an unexpected status.');
    }

    const result = await response.json();

    return result;

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
    return request(url, params);
}

export function create(url, params) {
    return request(url, params, 'POST');
}

//  function update(url, params) {
//   return request(url, params, 'PUT');
// }

// function remove(url, params) {
//   return request(url, params, 'DELETE');
// }

function save(spreadSheetName, row, column, data, callback) {
    create(save_sheet_url, {
        spreadSheetName: spreadSheetName,
        column: row,
        row: column,
        submissionValues: data
    }).then((response) => {
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

    get(_apiHost + url, {})
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

/**
 * Load app versions from the spreadsheet
 * @param {*} callback 
 */
export function fetchVersions(callback) {
    let url = _newApiHost + versions_url

    get(url, {})
        .then((response) => {
            let versions = [];

            for (let value of Object.values(response)) {
                versions.push({ version: value.name });
            }

            console.log(versions)

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
    let url = _newApiHost + psform_url + '/' + sex

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
                    type: value.type,
                    answer: [value.answer_1, value.answer_2, value.answer_3, value.answer_4, value.answer_5, value.answer_6]
                });
            }

            console.log(result)

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
    let url = _newApiHost + apptext_url + '/' + sex

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

            console.log(appText)

            callback({ appText });
        }, (response) => {
            callback(false, response);
        });
}

/**
 * Load screen navigation structure from the spreadsheet
 * @param {*} spreadsheetName 
 * @param {*} callback 
 */
export function fetchNavScreens(spreadsheetName, callback) {
    let url = _newApiHost + navscreens_url + '/' + spreadsheetName

    get(url, {})
        .then((response) => {
            let screens = [];

            for (let value of Object.values(response)) {
                screens.push({
                    screen: value.name
                });
            }

            console.log(screens)

            callback({ screens });
        }, (response) => {
            callback(false, response);
        });
}

/**
 * Load the current amount of participants of the experiment from the spreadsheet
 * @param {*} callback 
 */
export function fetchParticipantsCounter(callback) {
    let url = _newApiHost + userexpcount_url

    get(url, {})
        .then((response) => {
            let participants = Array(4);
            const indexFemale = 0
            const indexMale = 1
            const indexScenario1 = 2
            const indexScenario2 = 3

            //TODO MEJORAR ESTO. SE DEBE BUSCAR EL VALOR EN EL ARRAY EN LUGAR DE TENER UN INDEX FIJO
            for (let value of Object.values(response)) {
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

            console.log(participants)

            callback({ participants });
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
    let userdata = usergeneraldata(data, ariadnaUserID);
    let spreadSheetName = constant.USER_GENERAL_DATA_SHEETNAME;
    let row = "A2";
    let column = "Z";

    save(spreadSheetName, row, column, userdata, callback)
}

/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveUserPSForm(data, callback) {
    let userPSForm = userpsform(data);
    let spreadSheetName = constant.USER_PSFORM_SHEETNAME;
    let row = "A2";
    let column = "D";

    save(spreadSheetName, row, column, userPSForm, callback)
}

/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveAuctionBids(data, callback) {
    let userData = userauctionbids(data);
    let spreadSheetName = constant.USER_AUCTION_BIDS_SHEETNAME;
    let row = "A2";
    let column = "I";

    save(spreadSheetName, row, column, userData, callback)
}

/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveUserInfo(data, callback) {
    let userInfo = userinfo(data);
    let spreadSheetName = constant.USER_INFO_SHEETNAME;
    let row = "A2";
    let column = "L";

    save(spreadSheetName, row, column, userInfo, callback)
}

/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveUserForm(data, callback) {
    let userForm = userform(data);
    let spreadSheetName = constant.USER_FORM_SHEETNAME;
    let row = "A2";
    let column = "K";

    save(spreadSheetName, row, column, userForm, callback)
}

/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveUserLogTime(data, callback) {
    let userLogtime = userlogtime(data);
    let spreadSheetName = constant.USER_LOGTIME_SHEETNAME;
    let row = "A2";
    let column = "F";

    save(spreadSheetName, row, column, userLogtime, callback)
}

/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveUserVisualPattern(data, callback) {
    let userVisualPattern = uservisualpattern(data);
    let spreadSheetName = constant.USER_VISUAL_PATTERN_SHEETNAME;
    let row = "A2";
    let column = "L";

    save(spreadSheetName, row, column, userVisualPattern, callback)
}


/**
 * Helpers to format the data in the correct outputvalue
 * for a specific sheet
 */
const usergeneraldata = (data, ariadnaUserID) => {

    let result = [];
    for (let j = 0; j < data.length; j++) {
        let output = data[j];
        if (output.task === constant.USER_FORM_SCREEN) {
            result.push([
                output.userID,
                ariadnaUserID,
                output.task,
                output.timestamp, //created
                output.data.sex,
                output.data.age,
                output.data.profession,
                output.data.yearsEduc,
                output.data.levelEduc,
                output.data.typeAuction
            ]);
        } else if (output.task === constant.USER_INFO_SCREEN) {
            result.push([
                output.userID,
                ariadnaUserID,
                output.task,
                output.timestamp,
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
                output.timestamp, //created
                output.data.hotelId,
                output.data.hotelName,
                output.data.priceStart,
                output.data.bid,
                output.data.bidStartTimestamp,
                output.data.bidStopTimestamp
            ]);
        } else if (output.task === constant.PSFORM_SCREEN) {
            result.push([
                output.userID,
                ariadnaUserID,
                output.task,
                output.timestamp, //created
                output.data.questionCode,
                output.data.answer
            ]);
        } else if (output.task === constant.VISUAL_PATTERN_SCREEN || output.task === constant.VISUAL_PATTERN_DEMO_SCREEN) {
            let vp1 = output.data.map((item) => {
                return [
                    output.userID,
                    ariadnaUserID,
                    output.task,
                    output.timestamp, //created
                    (item.level + 1), //+1 to be more idiomatic: starts from level 1 insteado of level 0
                    item.dimention,
                    JSON.stringify(item.matrix),
                    JSON.stringify(item.matrixCheckResult),
                    item.matrixCheckResult.filter((element) => element === constant.TILE_SUCCESS).length, //we get the amount of success if any
                    item.matrixCheckResult.filter((element) => element === constant.TILE_ERROR).length, //we get the amount of errors if any
                    item.matrixCheckResult.filter((element) => element === constant.TILE_LEFT).length, //we get the amount of errors if any
                    item.retry,
                    item.timestamp
                ]
            });
            result = result.concat(vp1);
        }
    }

    return result;
}

function userinfo(data) {
    let result = [];

    const { userInfo, userID } = data;
    const now = Date.now();

    result.push([
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
        userInfo.screen.height,
        now //created
    ]);


    return result;
}

function userform(data) {
    let result = [];
    // let data = this.props.data;
    const { userID, outputFormData, typeTask, ariadnaUserID } = data;
    const now = Date.now();

    result.push([
        userID,
        ariadnaUserID,
        outputFormData.sex,
        outputFormData.age,
        outputFormData.profession,
        outputFormData.yearsEduc,
        outputFormData.levelEduc,
        outputFormData.typeAuction,
        typeTask,
        true, //experimentCompleted,
        now //created
    ]);

    return result;
}

function userauctionbids(data) {
    let result = [];
    // let data = this.props.data;
    const { outputAuctionTask, outputAuctionDemoTask, userID } = data;
    const now = Date.now();

    for (let i = 0; i < outputAuctionDemoTask.length; i++) {
        result.push([
            userID,
            constant.AUCTION_TASK_DEMO_SCREEN,
            outputAuctionDemoTask[i].hotelId,
            outputAuctionDemoTask[i].hotelName,
            outputAuctionDemoTask[i].priceStart,
            outputAuctionDemoTask[i].bid,
            outputAuctionDemoTask[i].bidStartTimestamp,
            outputAuctionDemoTask[i].bidStopTimestamp,
            now //created
        ]);
    }

    for (let i = 0; i < outputAuctionTask.length; i++) {
        result.push([
            userID,
            constant.AUCTION_TASK_SCREEN,
            outputAuctionTask[i].hotelId,
            outputAuctionTask[i].hotelName,
            outputAuctionTask[i].priceStart,
            outputAuctionTask[i].bid,
            outputAuctionTask[i].bidStartTimestamp,
            outputAuctionTask[i].bidStopTimestamp,
            now //created
        ]);
    }

    return result;
}

function userlogtime(data) {
    // UserID	QuestionID	QuestionNumber	SelectedAnswer
    let result = [];

    const { logTimestamp, userID } = data;
    const { screen, timestamp } = logTimestamp;
    const now = Date.now();

    for (let i = 0; i < screen.length; i++) {
        result.push([
            userID,
            screen[i],
            timestamp[i],
            Math.floor((((i + 1) < screen.length) ? (timestamp[i + 1] - timestamp[i]) : 0) / 1000),
            now //created
        ]);
    }

    return result;
}

function uservisualpattern(data) {
    const { userID, outputVisualPattern, outputVisualPatternDemo } = data;
    const now = Date.now();

    let resultDemo = outputVisualPatternDemo.map((output) => {
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
            now //created
        ];
    });


    let result = outputVisualPattern.map((output) => {
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
            now //created
        ];
    });

    return resultDemo.concat(result);
}

function userpsform(data) {
    let result = [];
    const { outputPSForm, userID } = data;
    const now = Date.now();

    for (let i = 0; i < outputPSForm.length; i++) {
        result.push([
            userID,
            outputPSForm[i].questionCode,
            outputPSForm[i].answer,
            now //created
        ]);
    }

    return result;
}


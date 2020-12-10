// Fetch.js
import * as constant from '../helpers/constants';

const _apiHost = 'https://api.swps-pjatk-experiment.pl/v2';//'http://localhost:5000';
const fetch_sheet_url = '/v4-get';
const save_sheet_url = '/v4-post';
const fetch_hotels_url = '/hotels';
const fetch_hotels_tutorial_url = '/hotels-tutorial';
const fetch_hotels_rev_url = '/hotels-rev';

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

    const response = await fetch(_apiHost + url, options);

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
        callback(false, reason.result.error);
    });
}

/**
 * 
 * @param {*} callback 
 */
export function fetchAuctionHotels(callback) {

    get(fetch_hotels_url, {})
        .then((response) => {
            let hotels = [];

            for (let [key, value] of Object.entries(response)) {
                hotels.push(value);
            }
            callback({ hotels });
        }, (response) => {
            callback(false, response);
        });
}

/**
 * 
 * @param {*} callback 
 */
export function fetchAuctionHotelsTutorial(callback) {
    get(fetch_hotels_tutorial_url, {})
        .then((response) => {
            let hotels = [];

            for (let [key, value] of Object.entries(response)) {
                hotels.push(value);
            }
            callback({ hotels });
        }, (response) => {
            callback(false, response);
        });
}

/**
 * 
 * @param {*} callback 
 */
export function fetchAuctionHotelsRev(callback) {
    get(fetch_hotels_rev_url, {})
        .then((response) => {
            let hotels = [];

            for (let [key, value] of Object.entries(response)) {
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

    let spreadsheetName = constant.VERSIONS_SHEETNAME;
    let row = "A2";
    let column = "B";

    get(fetch_sheet_url, { spreadSheetName: spreadsheetName, column: row, row: column })
        .then((response) => {
            const data = response.rows;
            let versions = data.map((versions) => {
                return { version: versions[0], url: versions[1] };
            });

            callback({ versions });
        }, (response) => {
            callback(false, response);
        });
}

/**
 * Load psychology questionaries input data from the spreadsheet
 * @param {*} callback 
 */
export function fetchPSFormData(callback) {

    let spreadsheetName = constant.PSFORM_SHEETNAME;
    let row = "A2";
    let column = "J";

    get(fetch_sheet_url, { spreadSheetName: spreadsheetName, column: row, row: column })
        .then((response) => {
            const data = response.rows;
            let result = data.map((version, i) => {
                let answersValues = []

                const indexScreen = 0
                const indexQuestionCode = 1
                const indexType = 2
                const indexAnswerStart = 3
                
                for (let i = indexAnswerStart; i < version.length; i++)
                    answersValues.push(version[i])

                return {
                    screen: version[indexScreen],
                    questionCode: version[indexQuestionCode],
                    type: version[indexType],
                    answer: answersValues
                };
            });

            callback({ result });
        }, (response) => {
            callback(false, response.result.error);
        });
}


/**
 * Load the input for the firs task as well as the first task demo from the spreadsheet
 * @param {*} callback 
 */
export function fetchInputFirstTask(spreadsheetName, column, row, callback) {

    get(fetch_sheet_url, { spreadSheetName: spreadsheetName, column: row, row: column })
        .then((response) => {
            const data = response.rows;

            let tasks = data.map((version, i) => {
                return {
                    id: version[0],
                    atributeId: version[1],
                    p1: version[2],
                    p2: version[3],
                    p3: version[4],
                    property: version[5],
                    pralka1: version[6],
                    pralka2: version[7],
                    pralka3: version[8],
                    correctAnswer: version[9],
                    showFeedback: version[10]
                };
            });

            callback({ tasks });
        }, (response) => {
            callback(false, response.result.error);
        });
}

/**
 * Load all the necessary Text structure for the app from the spreadsheet
 * @param {*} callback 
 */
export function fetchAppTextFemale(callback) {
    let spreadsheetName = constant.APP_TEXT_FEMALE_SHEETNAME;
    let row = "A2";
    let column = "C";

    get(fetch_sheet_url, { spreadSheetName: spreadsheetName, column: row, row: column })
        .then((response) => {
            const data = response.rows;

            let appText = data.map((version, i) => {
                return { screen: version[0], size: version[1], text: version[2] };
            });

            callback({ appText });
        }, (response) => {
            callback(false, response.result.error);
        });
}

/**
 * Load all the necessary Text structure for the app from the spreadsheet
 * @param {*} callback 
 */
export function fetchAppTextMale(callback) {
    let spreadsheetName = constant.APP_TEXT_MALE_SHEETNAME;
    let row = "A2";
    let column = "C";

    get(fetch_sheet_url, { spreadSheetName: spreadsheetName, column: row, row: column })
        .then((response) => {
            const data = response.rows;

            let appText = data.map((version, i) => {
                return { screen: version[0], size: version[1], text: version[2] };
            });

            callback({ appText });
        }, (response) => {
            callback(false, response.result.error);
        });
}

/**
 * Load screen navigation structure from the spreadsheet
 * @param {*} spreadsheetName 
 * @param {*} callback 
 */
export function fetchNavScreens(spreadsheetName, callback) {

    let row = "A2";
    let column = "B";

    get(fetch_sheet_url, { spreadSheetName: spreadsheetName, column: row, row: column })
        .then((response) => {
            const data = response.rows;
            let screens = data.map((version, i) => {
                return { pageId: version[0], screen: version[1] };
            });

            callback({ screens });
        }, (response) => {
            callback(false, response.result.error);
        });
}

/**
 * Load the current amount of participants of the experiment from the spreadsheet
 * @param {*} callback 
 */
export function fetchParticipantsCounter(callback) {

    let spreadsheetName = constant.USER_PARTICIPANTS_COUNTER_SHEETNAME;
    let row = "B2";
    let column = "D";

    get(fetch_sheet_url, { spreadSheetName: spreadsheetName, column: row, row: column })
        .then((response) => {
            const data = response.rows;

            let participants = data.map((group, i) => {
                return { firstGroup: group[0], secondGroup: group[1], thirdGroup: group[2] }
            });

            callback({ participants });
        }, (response) => {
            callback(false, response.result.error);
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
export function saveUserBrands(data, callback) {
    let userdata = userbrands(data);
    let spreadSheetName = constant.USER_BRANDS_SHEETNAME;
    let row = "A2";
    let column = "D";

    save(spreadSheetName, row, column, userdata, callback)
}


/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveUserPralkaRating(data, callback) {
    let userData = userpralkarating(data);
    let spreadSheetName = constant.USER_PRALKA_RATING_SHEETNAME;
    let row = "A2";
    let column = "D";

    save(spreadSheetName, row, column, userData, callback)
}

/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveUserPralkaSelections(data, callback) {
    let userData = userpralkaselection(data);
    let spreadSheetName = constant.USER_PRALKA_SELECTIONS_SHEETNAME;
    let row = "A2";
    let column = "D";

    save(spreadSheetName, row, column, userData, callback)
}

/**
 * Write results to GSheets
 * @param {*} data 
 * @param {*} callback 
 */
export function saveUserMobileTelephone(data, callback) {
    let userData = usermobiletelephone(data);
    let spreadSheetName = constant.USER_MOBILE_TELEPHONE_SHEETNAME;
    let row = "A2";
    let column = "D";

    save(spreadSheetName, row, column, userData, callback)
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
    let column = "F";

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
export function saveUserProperties(data, callback) {
    let userProperties = userproperties(data);
    let spreadSheetName = constant.USER_PROPERTIES_SHEETNAME;
    let row = "A2";
    let column = "G";

    save(spreadSheetName, row, column, userProperties, callback)
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
    let column = "I";

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
                output.data.yearsEduc,
                output.data.levelEduc,
                output.data.profession
            ]);
        } else if (output.task === constant.FIRST_TASK_DEMO_SCREEN) {
            result.push([
                output.userID,
                ariadnaUserID,
                output.task,
                output.timestamp, //created
                output.data[0],
                output.data[1],
                output.data[2],
                output.data[3]
            ]);
        } else if (output.task === constant.FIRST_TASK_SCREEN) {
            result.push([
                output.userID,
                ariadnaUserID,
                output.task,
                output.timestamp, //created
                output.data[0],
                output.data[1],
                output.data[2],
                output.data[3]
            ]);
        } else if (output.task === constant.SECOND_TASK_SCREEN) {
            for (let i = 0; i < output.data.length; i++) {
                result.push([
                    output.userID,
                    ariadnaUserID,
                    output.task,
                    output.timestamp, //created
                    constant.ATTRIBUTE_CUSTOM.data.id[i],
                    output.data[i]
                ]);
            }
        } else if (output.task === constant.THIRD_TASK_SCREEN) {
            for (let i = 0; i < output.data.length; i++) {
                result.push([
                    output.userID,
                    ariadnaUserID,
                    output.task,
                    output.timestamp, //created
                    output.data[i]
                ])
            }
        } else if (output.task === constant.FOURTH_TASK_SCREEN) {
            for (let i = 0; i < output.data.length; i++) {
                result.push([
                    output.userID,
                    ariadnaUserID,
                    output.task,
                    output.timestamp, //created
                    constant.ATTRIBUTE_FOURTH_TASK.data.id[i],
                    output.data[i]
                ]);
            }
        } else if (output.task === constant.FIFTH_TASK_SCREEN) {
            result.push([
                output.userID,
                ariadnaUserID,
                output.task,
                output.timestamp, //created
                output.data
            ]);
        } else if (output.task === constant.FINAL_TASK_SCREEN) {
            result.push([
                output.userID,
                ariadnaUserID,
                output.task,
                output.timestamp, //created
                constant.ATTRIBUTE.data.id[output.data[0]],
                output.data[1]
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
        } else if (output.task === constant.AUCTION_TASK_SCREEN) {
            result.push([
                output.userID,
                ariadnaUserID,
                output.task,
                output.timestamp, //created
                output.data.hotelName,
                output.data.priceStart,
                output.data.bid
            ]);
        } else if (output.task === constant.AUCTION_TASK_DEMO_SCREEN) {
            result.push([
                output.userID,
                ariadnaUserID,
                output.task,
                output.timestamp, //created
                output.data.hotelName,
                output.data.priceStart,
                output.data.bid
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
        } else if (output.task === constant.VISUAL_PATTERN_DEMO_SCREEN) {
            let vp1 = output.data.map((item) => {
                return [
                    output.userID,
                    ariadnaUserID,
                    output.task,
                    output.timestamp, //created
                    (item.level + 1), //+1 to be more idiomatic: starts from level 1 insteado of level 0
                    `${constant.VISUAL_PATTERN_DEMO_DIMENTION[item.level][0]} x ${constant.VISUAL_PATTERN_DEMO_DIMENTION[item.level][1]}`,
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
        } else if (output.task === constant.VISUAL_PATTERN_SCREEN) {
            let vp2 = output.data.map((item) => {
                return [
                    output.userID,
                    ariadnaUserID,
                    output.task,
                    output.timestamp, //created
                    (item.level + 1), //+1 to be more idiomatic: starts from level 1 insteado of level 0
                    `${constant.VISUAL_PATTERN_DIMENTION[item.level][0]} x ${constant.VISUAL_PATTERN_DIMENTION[item.level][1]}`,
                    JSON.stringify(item.matrix),
                    JSON.stringify(item.matrixCheckResult),
                    item.matrixCheckResult.filter((element) => element === constant.TILE_SUCCESS).length, //we get the amount of success if any
                    item.matrixCheckResult.filter((element) => element === constant.TILE_ERROR).length, //we get the amount of errors if any
                    item.matrixCheckResult.filter((element) => element === constant.TILE_LEFT).length, //we get the amount of errors if any
                    item.retry,
                    item.timestamp
                ]
            });
            result = result.concat(vp2);
        }
    }

    return result;
}

function userbrands(data) {
    const { outputFormData, outputThirdTask, outputFifthTask } = data;
    const now = Date.now();
    const userID = outputFormData.numer;

    let result = outputThirdTask.map((output) => {
        return [
            userID,
            constant.THIRD_TASK_SCREEN,
            output,
            now //created
        ];
    });

    result.push([
        userID,
        constant.FIFTH_TASK_SCREEN,
        outputFifthTask,
        now //created
    ])

    return result;
}

function userinfo(data) {
    let result = [];

    const { userInfo, outputFormData } = data;
    const now = Date.now();
    const userID = outputFormData.numer;

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
    const { outputFormData, typeTask, ariadnaUserID } = data;
    const now = Date.now();

    result.push([
        outputFormData.numer,
        ariadnaUserID,
        outputFormData.sex,
        outputFormData.age,
        outputFormData.profession,
        outputFormData.yearsEduc,
        outputFormData.levelEduc,
        typeTask,
        true, //experimentCompleted,
        now //created
    ]);

    return result;
}

function userpralkarating(data) {
    let result = [];
    // let data = this.props.data;
    const { outputSecondTask, outputFormData } = data;
    const outputFormDataNumer = outputFormData.numer;
    const now = Date.now();

    for (let i = 0; i < constant.ATTRIBUTE_CUSTOM.data.id.length; i++) {
        result.push([
            outputFormDataNumer,
            constant.ATTRIBUTE_CUSTOM.data.id[i],
            outputSecondTask[i],
            now //created
        ]);
    }

    return result;
}

function usermobiletelephone(data) {
    let result = [];
    // let data = this.props.data;
    const { outputFourthTask, outputFormData } = data;
    const outputFormDataNumer = outputFormData.numer;
    const now = Date.now();

    for (let i = 0; i < constant.ATTRIBUTE_FOURTH_TASK.data.id.length; i++) {
        result.push([
            outputFormDataNumer,
            constant.ATTRIBUTE_FOURTH_TASK.data.id[i],
            outputFourthTask[i],
            now //created
        ]);
    }

    return result;
}

function userauctionbids(data) {
    let result = [];
    // let data = this.props.data;
    const { outputAuctionTask, outputAuctionDemoTask, outputFormData } = data;
    const outputFormDataNumer = outputFormData.numer;
    const now = Date.now();

    for (let i = 0; i < outputAuctionDemoTask.length; i++) {
        result.push([
            outputFormDataNumer,
            constant.AUCTION_TASK_DEMO_SCREEN,
            outputAuctionDemoTask[i].hotelName,
            outputAuctionDemoTask[i].priceStart,
            outputAuctionDemoTask[i].bid,
            now //created
        ]);
    }

    for (let i = 0; i < outputAuctionTask.length; i++) {
        result.push([
            outputFormDataNumer,
            constant.AUCTION_TASK_SCREEN,
            outputAuctionTask[i].hotelName,
            outputAuctionTask[i].priceStart,
            outputAuctionTask[i].bid,
            now //created
        ]);
    }

    return result;
}

function userpralkaselection(data) {
    let result = [];
    // let data = this.props.data;
    const { outputFinalTask, outputFormData } = data;
    const outputFormDataNumer = outputFormData.numer;
    const now = Date.now();

    for (let i = 0; i < constant.ATTRIBUTE.data.id.length; i++) {
        result.push([
            outputFormDataNumer,
            constant.ATTRIBUTE.data.id[i],
            outputFinalTask[i],
            now //created
        ]);
    }

    return result;
}

function userproperties(data) {
    // UserID	QuestionID	QuestionNumber	SelectedAnswer
    let result = [];
    // let data = this.props.data;
    const { outputFirstTask, outputFirstTaskDemo, outputFormData } = data;
    const outputFormDataNumer = outputFormData.numer;
    const now = Date.now();

    for (let i = 0; i < outputFirstTaskDemo.questionID.length; i++) {
        result.push([
            outputFormDataNumer,
            constant.FIRST_TASK_DEMO_SCREEN,
            outputFirstTaskDemo.questionID[i],
            outputFirstTaskDemo.questionNumber[i],
            outputFirstTaskDemo.selectedAnswer[i],
            outputFirstTaskDemo.isCorrectAnswer[i],
            now
        ]);
    }

    for (let i = 0; i < outputFirstTask.questionID.length; i++) {
        result.push([
            outputFormDataNumer,
            constant.FIRST_TASK_SCREEN,
            outputFirstTask.questionID[i],
            outputFirstTask.questionNumber[i],
            outputFirstTask.selectedAnswer[i],
            outputFirstTask.isCorrectAnswer[i],
            now
        ]);
    }

    return result;

}

function userlogtime(data) {
    // UserID	QuestionID	QuestionNumber	SelectedAnswer
    let result = [];

    const { logTimestamp, outputFormData } = data;
    const { screen, timestamp } = logTimestamp;
    const outputFormDataNumer = outputFormData.numer;
    const now = Date.now();

    for (let i = 0; i < screen.length; i++) {
        result.push([
            outputFormDataNumer,
            screen[i],
            timestamp[i],
            Math.floor((((i + 1) < screen.length) ? (timestamp[i + 1] - timestamp[i]) : 0) / 1000),
            now //created
        ]);
    }

    return result;
}

function uservisualpattern(data) {
    const { outputFormData, outputVisualPattern, outputVisualPatternDemo } = data;
    const now = Date.now();
    const userID = outputFormData.numer;

    let resultDemo = outputVisualPatternDemo.map((output) => {
        return [
            userID,
            constant.VISUAL_PATTERN_DEMO_SCREEN,
            (output.level + 1),
            `${constant.VISUAL_PATTERN_DEMO_DIMENTION[output.level][0]} x ${constant.VISUAL_PATTERN_DEMO_DIMENTION[output.level][1]}`,
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
            `${constant.VISUAL_PATTERN_DIMENTION[output.level][0]} x ${constant.VISUAL_PATTERN_DIMENTION[output.level][1]}`,
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
    const { outputPSForm, outputFormData } = data;
    const now = Date.now();
    const userID = outputFormData.numer;

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


import React, { Component } from "react";

// core components
import { Progress } from 'reactstrap';

//UUID
import { v4 as uuidv4 } from 'uuid'; // For version 4

//SessionTimer
import IdleTimer from 'react-idle-timer'

//Parse URL
import queryString from 'query-string'
// Loader
import { css } from "@emotion/core";
import FadeLoader from "react-spinners/FadeLoader";
import SyncLoader from "react-spinners/SyncLoader";

// Views
import FooterV1 from "../Footers/FooterV1.0";
import RewardInfo from "../Tasks/RewardInfo";
import RewardAuctionInfo from "../Tasks/RewardAuctionInfo";
import FirstTask from "../Tasks/FirstTask";
import SecondTask from "../Tasks/SecondTask";
import ThirdTask from "../Tasks/ThirdTask";
import FourthTask from "../Tasks/FourthTask";
import FifthTask from "../Tasks/FifthTask";
import FinalTask from "../Tasks/FinalTask";
import Instruction from "../Tasks/Instruction"
import UserForm from "../Tasks/UserForm/UserForm";
import AuctionTask from "../Tasks/AuctionTask";
import VisualPatternTask from "../Tasks/VisualPatternTask";
import VisualPatternDemoTask from "../Tasks/VisualPatternDemoTask";
import PSForm from "../Tasks/PSForm";

// helpers
import * as request from '../../helpers/fetch';
import * as constant from '../../helpers/constants';
import { USER_INFO } from '../../helpers/utils';

// CSS - Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const LIGHT_GRAY = "#e9ecef"; //lighter
const WHITE = "white";

const DEBUG = (process.env.REACT_APP_DEBUG_LOG === "true") ? true : false;
const ARIADNA_REDIRECT_REJECT = process.env.REACT_APP_ARIADNA_REDIRECT_REJECT;
const ARIADNA_REDIRECT_ACCEPTED = process.env.REACT_APP_ARIADNA_REDIRECT_ACCEPTED;

class Experiment extends Component {
    constructor(props) {
        super(props);

        const userID = uuidv4();
        const ariadnaUserID = queryString.parse(this.props.location.search).respondent_id;
        const userGeneralInfo = { //default value - user info loaded
            userID: userID,
            task: constant.USER_INFO_SCREEN,
            data: [
                this.props.match.params.version,
                USER_INFO.os.name,
                USER_INFO.os.version,
                USER_INFO.browser.name,
                USER_INFO.browser.version,
                USER_INFO.browser.major,
                USER_INFO.browser.language,
                USER_INFO.engine.name,
                USER_INFO.engine.version,
                USER_INFO.screen.width,
                USER_INFO.screen.height
            ],
            timestamp: Date.now(), //created
            sync: constant.STATE_NOT_SYNC
        }
        const generalOutputDefault = [userGeneralInfo]
        const typeTask = this.props.match.params.version
        const userFormDefault = {
            sex: constant.FEMALE_VALUE,//default selected sex
            age: constant.TEXT_EMPTY,
            yearsEduc: constant.TEXT_EMPTY,
            levelEduc: constant.FORM_LEVEL_EDUC_DEFAULT, //default selected 
            profession: constant.TEXT_EMPTY
        }

        this.state = {
            ariadnaUserID: ariadnaUserID,
            userID: userID,
            userInfo: USER_INFO,
            //Variables for input data
            inputNavigation: [],
            inputTextInstructions: [],
            inputAuctionTask: [],
            inputAuctionDemoTask: [],
            inputFirstTask: [],
            inputFirstTaskDemo: [],
            inputParticipants: [],
            inputPSForm: [],
            //Variables for output data (results)
            generalOutput: generalOutputDefault,
            generalOutputIndexes: [],
            outputFormData: userFormDefault,
            outputFirstTask: {
                questionID: [],
                questionNumber: [],
                selectedAnswer: [],
                isCorrectAnswer: []
            },
            outputFirstTaskDemo: {
                questionID: [],
                questionNumber: [],
                selectedAnswer: [],
                isCorrectAnswer: []
            },
            outputSecondTask: [],
            outputThirdTask: [],
            outputFourthTask: [],
            outputFifthTask: constant.TEXT_EMPTY,
            outputFinalTask: Array(constant.FIRST_TASK_PROPERTIES_TOTAL).fill(constant.TEXT_EMPTY), //initialize and set to empty. This array of size 6, corresponds to each property selected value (A1, A2, ...)
            outputPSForm: [],
            outputVisualPattern: [],
            outputVisualPatternDemo: [],
            //utils
            logTimestamp: {
                screen: [],
                timestamp: []
            },
            outputAuctionTask: [],
            outputAuctionDemoTask: [],
            typeTask: typeTask,
            showAlertWindowsClosing: true,
            currentScreenNumber: 0,
            loading: false,
            loadingSyncData: false,
            progressBarNow: 1,
            showPagination: false,
            page: constant.TEXT_EMPTY,
            error: {
                showError: false,
                textError: constant.TEXT_EMPTY
            },
            modalOpen: false
        };

        //page event handlers
        this.handleKeyDownEvent = this._handleKeyDownEvent.bind(this);
        this.handleWindowClose = this._handleWindowClose.bind(this)

        //session timer
        this.idleTimer = null
        this.onAction = this._onAction.bind(this)
        this.onActive = this._onActive.bind(this)
        this.onIdle = this._onIdle.bind(this)

        //Components handlers (manage and control data from respective components)
        this.formHandler = this._formHandler.bind(this)
        this.firstTaskHandler = this._firstTaskHandler.bind(this)
        this.firstTaskDemoHandler = this._firstTaskDemoHandler.bind(this)
        this.secondTaskHandler = this._secondTaskHandler.bind(this)
        this.thirdTaskHandler = this._thirdTaskHandler.bind(this)
        this.fourthTaskHandler = this._fourthTaskHandler.bind(this)
        this.fifthTaskHandler = this._fifthTaskHandler.bind(this)
        this.finalTaskHandler = this._finalTaskHandler.bind(this)
        this.psFormHandler = this._psFormHandler.bind(this)
        this.auctionTaskHandler = this._auctionTaskHandler.bind(this)
        this.auctionTaskDemoHandler = this._auctionTaskDemoHandler.bind(this)
        this.visualPatternTaskHandler = this._visualPatternTaskHandler.bind(this)
        this.visualPatternDemoTaskHandler = this._visualPatternDemoTaskHandler.bind(this)

        if (DEBUG) console.log(`ARIADNA_REDIRECT_REJECT:${ARIADNA_REDIRECT_REJECT}`);
        if (DEBUG) console.log(`ARIADNA_REDIRECT_ACCEPTED:${ARIADNA_REDIRECT_ACCEPTED}`);
        if (DEBUG) console.log(`Debug:${DEBUG}`);
    }

    _onAction(e) {
        // if(DEBUG) console.log('user did something', e)
    }

    _onActive(e) {
        // if(DEBUG) console.log('user is active', e)
        // if(DEBUG) console.log('time remaining', this.idleTimer.getRemainingTime())

        if (this.idleTimer.getRemainingTime() === 0) {
            alert("Z powodu upływu czasu sesja została zamknięta");
            document.location.reload(true);
        }
    }

    _onIdle(e) {
        // if(DEBUG) console.log('user is idle', e)
        // if(DEBUG) console.log('last active', this.idleTimer.getLastActiveTime())
    }

    /**
     * Check user authenification status and set app state accordingly
     *     
     ** Sequence calling:
    * fetchNavScreens
    * fetchParticipantsCounter
    * fetchFirstTaskDemo
    * fetchFirstTask
    * fetchPSForm
     */
    _fetchExperimentInputData() {
        // request.fetchAuctionHotels(this._onLoadAuctionHotelsCallBack.bind(this))
        request.fetchAuctionHotelsTutorial(this._onLoadAuctionHotelsDemoCallBack.bind(this))
        request.fetchAuctionHotelsRev(this._onLoadAuctionHotelsCallBack.bind(this))
        if (DEBUG) console.log("Fetch navigationScreens");
        request.fetchNavScreens(this.state.typeTask, this._onLoadNavScreenCallBack.bind(this))
    }

    /**
     * 
     * @param {*} data 
     * @param {*} error 
     */
    _onLoadAuctionHotelsCallBack(data, error) {
        if (data) {
            //Loggin the first screen of the navigation
            this.setState({
                // loading: false, //Hide loading
                inputAuctionTask: data.hotels
            })

            if (DEBUG) console.log(data)
        } else {
            this.setState({
                loading: false,
                error: {
                    showError: true,
                    textError: `${error}. Please refresh page.`
                }
            })
            if (DEBUG) console.log(error)
        }
    }

    /**
     * 
     * @param {*} data 
     * @param {*} error 
     */
    _onLoadAuctionHotelsDemoCallBack(data, error) {
        if (data) {
            //Loggin the first screen of the navigation
            this.setState({
                // loading: false, //Hide loading
                inputAuctionDemoTask: data.hotels
            })

            if (DEBUG) console.log(data)
        } else {
            this.setState({
                loading: false,
                error: {
                    showError: true,
                    textError: `${error}. Please refresh page.`
                }
            })
            if (DEBUG) console.log(error)
        }
    }


    /**
    * Save Data - Synchronously
    * 
    ** Sequence calling:
    * request.saveUserPralkaRating()
    * request.saveUserPralkaSelections()
    * request.saveUserInfo()
    * request.saveUserProperties()
    * request.saveUserForm()
    * request.saveUserLogTime()
    * request.userVisualPattern()
    * request.saveUserBrands()
     */
    _syncData() { //if the experiment is not completed, the data is still not sync
        if (DEBUG) console.log("Sync Data...");

        request.saveUserPralkaRating(this.state, this._onSaveUserPralkaRatingCallBack.bind(this))
    }

    /**
    * Save Data - Asynchronously
    * Used when the browser window is closing
    * 
     */
    _asyncData() { //if the experiment is not completed, the data is still not sync
        if (DEBUG) console.log("Async Data...");

        const { generalOutput } = this.state
        let itemsNotSyncedAmount = generalOutput.filter(item => item.sync === constant.STATE_NOT_SYNC).length

        if (itemsNotSyncedAmount > 0) { //if we have items not synced yet
            this._syncGeneralData()
        }
    }

    /**
     * 
     */
    _syncGeneralData() {
        const { generalOutput, generalOutputIndexes, ariadnaUserID } = this.state
        let itemsNotSynced = []
        let itemsNotSyncedIndexes = []

        for (let i = 0; i < generalOutput.length; i++) {
            if (generalOutput[i].sync === constant.STATE_NOT_SYNC) {
                itemsNotSynced.push(generalOutput[i])
                itemsNotSyncedIndexes.push(i)
            }
        }

        if (DEBUG) console.log("Syncing GeneralData now()")
        if (DEBUG) console.log(itemsNotSynced)

        for (let i = 0; i < generalOutput.length; i++) {
            if (generalOutput[i].sync === constant.STATE_NOT_SYNC) {
                generalOutput[i].sync = constant.STATE_SYNCING
            }
        }

        request.saveGeneralData(itemsNotSynced, ariadnaUserID, this._onSaveGeneralDataCallBack.bind(this))

        this.setState({
            generalOutput: generalOutput,
            generalOutputIndexes: generalOutputIndexes.concat(itemsNotSyncedIndexes),
            loadingSyncData: true
        })
    }


    /********************************************************** 
     *   Callbacks from async request - get data (see fetch.js)
     **********************************************************/

    /**
     * 
     * @param {*} data 
     * @param {*} error 
     */
    _onAsyncDataCallBack(data, error) {
        if (DEBUG) console.log(data)
        if (DEBUG) console.log(error)
    }

    /**
     * Once the navigation screen structure have been loaded from the spreadsheet
     * @param {*} data 
     * @param {*} error 
     */
    _onLoadNavScreenCallBack(data, error) {
        if (data) {
            //Loggin the first screen of the navigation
            let timestamp = [];
            let screenTmp = [];
            screenTmp.push(data.screens[0].screen); //we grap the first screen
            timestamp.push(Date.now()); //we log the first screen we are entering in

            this.setState({
                // loading: false, //Hide loading
                logTimestamp: {
                    screen: screenTmp,
                    timestamp: timestamp
                },
                inputNavigation: data.screens
            })
            if (DEBUG) console.log(data)

            if (DEBUG) console.log("Fetch participants counter");
            request.fetchParticipantsCounter(this._onLoadParticipantCountCallBack.bind(this))
        }
        else {
            this.setState({
                loading: false,
                error: {
                    showError: true,
                    textError: `${error}. Please refresh page.`
                }
            })
            if (DEBUG) console.log(error)

        }
    }

    /**
     * Once the participant amount have been loaded from the spreadsheet
     * @param {*} data 
     * @param {*} error 
     */
    _onLoadParticipantCountCallBack(data, error) {
        if (data) {
            //Loggin the first screen of the navigation
            this.setState({
                // loading: false, //Hide loading
                inputParticipants: data.participants
            })

            if (DEBUG) console.log(data)
            if (DEBUG) console.log("Fetch InputFirstTaskDemo");
            request.fetchInputFirstTask(constant.INPUT_ALL_WARMUP_SHEETNAME, "A2", "K", this._onLoadInputFirstTaskDemoCallBack.bind(this));
        }
        else {
            this.setState({
                loading: false,
                error: {
                    showError: true,
                    textError: `${error}. Please refresh page.`
                }
            })
            if (DEBUG) console.log(error)
        }
    }

    /**
     * Once the input for the fist task demo have been loaded from the spreadsheet
     * @param {*} data 
     * @param {*} error 
     */
    _onLoadInputFirstTaskDemoCallBack(data, error) {
        if (data) {
            const { inputNavigation, currentScreenNumber } = this.state;
            const totalTasks = data.tasks.length / constant.FIRST_TASK_PROPERTIES_TOTAL;

            this.setState({
                // loading: false, //Hide loading
                inputFirstTaskDemo: data.tasks,
                page: `${inputNavigation[currentScreenNumber].pageId}/${totalTasks}` /*we update the page text after we get the total number of tasks*/
            })
            if (DEBUG) console.log(data)
            if (DEBUG) console.log("Fetch InputFirstTask");
            request.fetchInputFirstTask(constant.INPUT_ALL_SHEETNAME, "A2", "K", this._onLoadInputFirstTaskCallBack.bind(this));

        } else {
            this.setState({
                loading: false,
                error: {
                    showError: true,
                    textError: `${error}. Please refresh page.`
                }
            })
            if (DEBUG) console.log(error)

        }
    }

    /**
     * Once the input for the fist task have been loaded from the spreadsheet
     * @param {*} data 
     * @param {*} error 
     */
    _onLoadInputFirstTaskCallBack(data, error) {
        if (data) {
            const { inputNavigation, currentScreenNumber } = this.state;
            const totalTasks = data.tasks.length / constant.FIRST_TASK_PROPERTIES_TOTAL;

            this.setState({
                loading: false, //Hide loading
                inputFirstTask: data.tasks,
                page: `${inputNavigation[currentScreenNumber].pageId}/${totalTasks}` /*we update the page text after we get the total number of tasks*/

            })
            if (DEBUG) console.log(data)
            if (DEBUG) console.log("Fetch PSFormData");
            request.fetchPSFormData(this._onLoadPSFormCallback.bind(this))
        } else {
            this.setState({
                loading: false,
                error: {
                    showError: true,
                    textError: `${error}. Please refresh page.`
                }
            })
            if (DEBUG) console.log(error)

        }
    }

    /**
     * Once all the necessary experiment text have been loaded from the spreadsheet 
     * @param {*} data 
     * @param {*} error 
     */
    _onLoadAppTextCallBack(data, error) {
        if (data) {
            this.setState({
                loading: false, //Hide loading
                inputTextInstructions: data.appText
            })
            if (DEBUG) console.log(data)

        }
        else {
            this.setState({
                loading: false, //Hide loading
                error: error
            })
            if (DEBUG) console.log(error)

        }
    }

    /**
* Once the psychology questionnaries input have been loaded from the spreadsheet
* @param {*} data 
* @param {*} error 
*/
    _onLoadPSFormCallback(data, error) {
        if (data) {
            this.setState({
                loading: false, //Hide loading
                inputPSForm: data.result
            }, () => {
                if (DEBUG) console.log(this.state)
            });

            if (DEBUG) console.log(data)
            if (DEBUG) console.log("Fetch COMPLETED!!");
        }
        else {
            this.setState({
                loading: false,
                error: {
                    showError: true,
                    textError: `${error}. Please refresh page.`
                }
            })
            if (DEBUG) console.log(error);
        }
    }

    /********************************************************** 
     *   Callbacks from async request - save data (see fetch.js)
     **********************************************************/

    /**
     * Results from saving user pralka rating
     * @param {*} data 
     * @param {*} error 
     */
    _onSaveUserPralkaRatingCallBack(data, error) {
        if (DEBUG) console.log(data);
        if (data) {
            if (DEBUG) console.log("SaveUserPralkaRating");
            request.saveUserPralkaSelections(this.state, this._onSaveUserPralkaSelectionsCallBack.bind(this))
        } else {
            if (DEBUG) console.log("Error saving UserPralkaRating")
            this.setState({ loading: false });
        }
    }

    /**
    * Results from saving user pralka selections
    * @param {*} data 
    * @param {*} error 
    */
    _onSaveUserPralkaSelectionsCallBack(data, error) {
        if (DEBUG) console.log(data);
        if (data) {
            if (DEBUG) console.log("SaveUserPralkaSelections");
            request.saveUserMobileTelephone(this.state, this._onSaveUserMobileTelephoneCallBack.bind(this))
        } else {
            if (DEBUG) console.log("Error saving UserPralkaSelections")
            this.setState({ loading: false });
        }
    }

    /**
    * Results from saving user MobileTelephone
    * @param {*} data 
    * @param {*} error 
    */
    _onSaveUserMobileTelephoneCallBack(data, error) {
        if (DEBUG) console.log(data);
        if (data) {
            if (DEBUG) console.log("SaveUserMobileTelephone");
            request.saveUserInfo(this.state, this._onSaveUserInfoCallBack.bind(this))
        } else {
            if (DEBUG) console.log("Error saving UserMobileTelephone")
            this.setState({ loading: false });
        }
    }

    /**
     * Results from saving user info data
     * @param {*} data 
     * @param {*} error 
     */
    _onSaveUserInfoCallBack(data, error) {
        if (DEBUG) console.log(data);
        if (data) {
            if (DEBUG) console.log("SaveUserInfo");
            request.saveUserProperties(this.state, this._onSaveUserPropertiesCallBack.bind(this))
        } else {
            if (DEBUG) console.log("Error saving user info")
            this.setState({ loading: false });
        }
    }

    /**
     * Results from saving user properties data
     * @param {*} data 
     * @param {*} error 
     */
    _onSaveUserPropertiesCallBack(data, error) {
        if (DEBUG) console.log(data);
        if (data) {
            if (DEBUG) console.log("SaveUserProperties");
            request.saveUserForm(this.state, this._onSaveUserFormCallBack.bind(this))
        } else {
            if (DEBUG) console.log("Error saving user properties")
            this.setState({ loading: false });
        }
    }

    /**
     * Results from saving user form data
     * @param {*} data 
     * @param {*} error 
     */
    _onSaveUserFormCallBack(data, error) {
        if (DEBUG) console.log(data);
        if (data) {
            if (DEBUG) console.log("SaveUserForm");
            request.saveUserLogTime(this.state, this._onSaveUserLogTimeCallBack.bind(this))
        } else {
            if (DEBUG) console.log("Error saving user form")
            this.setState({ loading: false });
        }
    }

    /**
     * Results from saving user logtime data
     * @param {*} data 
     * @param {*} error 
     */
    _onSaveUserLogTimeCallBack(data, error) {
        if (DEBUG) console.log(data);
        if (data) {
            if (DEBUG) console.log("SaveUserLogTime");
            request.saveAuctionBids(this.state, this._onSaveUserAuctionBidsCallBack.bind(this))
        } else {
            if (DEBUG) console.log("Error saving user logtime")
            this.setState({ loading: false });
        }
    }

    /**
     * Results from saving user logtime data
     * @param {*} data 
     * @param {*} error 
     */
    _onSaveUserAuctionBidsCallBack(data, error) {
        if (DEBUG) console.log(data);
        if (data) {
            if (DEBUG) console.log("Save Auction bids");
            request.saveUserVisualPattern(this.state, this._onSaveUserVisualPatternCallBack.bind(this))
        } else {
            if (DEBUG) console.log("Error saving user logtime")
            this.setState({ loading: false });
        }
    }

    /**
 * Results from saving user visual pattern data
 * @param {*} data 
 * @param {*} error 
 */
    _onSaveUserVisualPatternCallBack(data, error) {
        if (DEBUG) console.log(data);
        if (data) {
            if (DEBUG) console.log("SaveUserVisualPattern");
            request.saveUserBrands(this.state, this._onSaveUserBrandsCallBack.bind(this))
        } else {
            if (DEBUG) console.log("Error saving user visualPattern")
            this.setState({ loading: false });
        }
    }

    /**
     * Results from saving user brands data
     * @param {*} data 
     * @param {*} error 
     */
    _onSaveUserBrandsCallBack(data, error) {
        if (DEBUG) console.log(data);
        if (data) {
            if (DEBUG) console.log("SaveUserBrands");
            request.saveUserPSForm(this.state, this._onSaveUserPSFormCallBack.bind(this))
        } else {
            if (DEBUG) console.log("Error saving user brands")
            this.setState({ loading: false });
        }
    }

    /**
   * Results from saving user ps questionaries data
   * @param {*} data 
   * @param {*} error 
   */
    _onSaveUserPSFormCallBack(data, error) {
        if (DEBUG) console.log(data);
        if (data) {
            if (DEBUG) console.log("SaveUserPSForm");

            //redirect to ARIADNA
            window.location.replace(ARIADNA_REDIRECT_ACCEPTED);

        } else {
            if (DEBUG) console.log("Error saving user psform")
            this.setState({ loading: false });
        }
    }

    /**
     * Results from saving user general data
     * @param {*} data 
     * @param {*} error 
     */
    _onSaveGeneralDataCallBack(data, error) {
        if (data) {
            const { generalOutput, generalOutputIndexes } = this.state
            for (let i = 0; i < generalOutputIndexes.length; i++) {
                if (generalOutput[generalOutputIndexes[i]].sync === constant.STATE_SYNCING) {
                    generalOutput[generalOutputIndexes[i]].sync = constant.STATE_SYNC
                }
            }

            this.setState({
                loadingSyncData: false,
                generalOutput: generalOutput
            })
            if (DEBUG) console.log(data)
            if (DEBUG) console.log("Success General data!")
        }
        else {
            this.setState({
                loadingSyncData: false,
                error: {
                    showError: true,
                    textError: `${error}. Please refresh page.`
                }
            })
            if (DEBUG) console.log(error)
        }
    }


    /********************
     * COMPONENTS HANDLER
     ********************/

    /**
     * Manage results comming from User Form Data
     * UserForm component (UserForm.js)
     * @param {*} evt 
     */
    _formHandler(formData) {
        const { generalOutput, userID } = this.state
        const now = Date.now();

        console.log(formData)

        //we find the index of userform to update the same element instead of adding a new one in array
        let index = -1;
        for (let i = 0; i < generalOutput.length; i++) {
            if (generalOutput[i].task === constant.USER_FORM_SCREEN) {
                index = i;
                break;
            }
        }

        if (index === -1) { //does not exists yet
            generalOutput.push({
                userID: userID,
                task: constant.USER_FORM_SCREEN,
                data: formData,
                timestamp: now,
                sync: constant.STATE_NOT_SYNC
            })
        } else { //we update existing values
            generalOutput[index] = {
                userID: userID,
                task: constant.USER_FORM_SCREEN,
                data: formData,
                timestamp: now,
                sync: constant.STATE_NOT_SYNC
            }
        }

        //save results
        this.setState({
            outputFormData: formData,
            generalOutput: generalOutput
        })
    }

    /**
     * Manage results comming from First Task
     * FirstTask component (FirstTask.js)
     * @param {*} selectedNumber 
     */
    _firstTaskHandler(selectedNumber) {
        const { currentScreenNumber, inputNavigation, inputFirstTask, outputFirstTask,
            generalOutput, userID } = this.state;
        const { questionID, questionNumber, selectedAnswer, isCorrectAnswer } = outputFirstTask;

        const currentFirsTaskScreenNumber = parseInt(inputNavigation[currentScreenNumber].pageId);
        const currentFirstTask = inputFirstTask[(currentFirsTaskScreenNumber - 1) * constant.FIRST_TASK_PROPERTIES_TOTAL];
        const currentCorrectAnswer = currentFirstTask.correctAnswer;
        const currentQuestionID = currentFirstTask.id;
        const isCorrectSelectedAnswer = (selectedNumber === currentCorrectAnswer)
        const now = Date.now();

        if (DEBUG) console.log(`Correct answer:${currentCorrectAnswer}`);
        if (DEBUG) console.log(`Selected answer:${selectedNumber}`);
        if (DEBUG) console.log(isCorrectSelectedAnswer)

        questionID.push(currentQuestionID);
        questionNumber.push(currentFirsTaskScreenNumber);
        selectedAnswer.push(selectedNumber);
        isCorrectAnswer.push(isCorrectSelectedAnswer);

        generalOutput.push({
            userID: userID,
            task: constant.FIRST_TASK_SCREEN,
            data: [currentQuestionID, currentFirsTaskScreenNumber, selectedNumber, isCorrectSelectedAnswer],
            timestamp: now,
            sync: constant.STATE_NOT_SYNC
        })

        //save results
        this.setState({
            generalOutput: generalOutput,
            outputFirstTask: {
                questionID: questionID,
                questionNumber: questionNumber,
                selectedAnswer: selectedAnswer,
                isCorrectAnswer: isCorrectAnswer
            },
            modalOpen: true
        }, () => {
            if (DEBUG) console.log(this.state)
        });
    }

    /**
     * Manage results comming from First Task Demo
     * FirstTask component (FirstTask.js)
     * @param {*} selectedNumber 
     */
    _firstTaskDemoHandler(selectedNumber) {
        const { currentScreenNumber, inputNavigation, inputFirstTaskDemo, outputFirstTaskDemo,
            userID, generalOutput } = this.state;
        const { questionID, questionNumber, selectedAnswer, isCorrectAnswer } = outputFirstTaskDemo;

        const currentFirsTaskDemoScreenNumber = parseInt(inputNavigation[currentScreenNumber].pageId);
        const currentFirstTaskDemo = inputFirstTaskDemo[(currentFirsTaskDemoScreenNumber - 1) * constant.FIRST_TASK_PROPERTIES_TOTAL];
        const currentCorrectAnswer = currentFirstTaskDemo.correctAnswer;
        const currentQuestionID = currentFirstTaskDemo.id;
        const isCorrectSelectedAnswer = (selectedNumber === currentCorrectAnswer)
        const now = Date.now();

        if (DEBUG) console.log(`Correct answer:${currentCorrectAnswer}`);
        if (DEBUG) console.log(`Selected answer:${selectedNumber}`);
        if (DEBUG) console.log(isCorrectSelectedAnswer)


        questionID.push(currentQuestionID);
        questionNumber.push(currentFirsTaskDemoScreenNumber);
        selectedAnswer.push(selectedNumber);
        isCorrectAnswer.push(isCorrectSelectedAnswer);

        generalOutput.push({
            userID: userID,
            task: constant.FIRST_TASK_DEMO_SCREEN,
            data: [currentQuestionID, currentFirsTaskDemoScreenNumber, selectedNumber, isCorrectSelectedAnswer],
            timestamp: now,
            sync: constant.STATE_NOT_SYNC
        })

        //save results
        this.setState({
            generalOutput: generalOutput,
            outputFirstTaskDemo: {
                questionID: questionID,
                questionNumber: questionNumber,
                selectedAnswer: selectedAnswer,
                isCorrectAnswer: isCorrectAnswer
            },
            modalOpen: true
        }, () => {
            if (DEBUG) console.log(this.state)
        });
    }

    /**
     * Manage results comming from Second Task
     * SecondTask component (SecondTask.js)
     * @param {*} rating 
     * @param {*} id 
     */
    _secondTaskHandler(selectedRatings) {
        if (DEBUG) console.log(selectedRatings)

        const { generalOutput, userID } = this.state
        const now = Date.now();

        //we find the index of userform to update the same element instead of adding a new one in array
        let index = -1;
        for (let i = 0; i < generalOutput.length; i++) {
            if (generalOutput[i].task === constant.SECOND_TASK_SCREEN) {
                index = i;
                break;
            }
        }

        if (index === -1) {
            generalOutput.push({
                userID: userID,
                task: constant.SECOND_TASK_SCREEN,
                data: selectedRatings,
                timestamp: now,
                sync: constant.STATE_NOT_SYNC
            })
        } else {
            generalOutput[index] = {
                userID: userID,
                task: constant.SECOND_TASK_SCREEN,
                data: selectedRatings,
                timestamp: now,
                sync: constant.STATE_NOT_SYNC
            }
        }

        //save results
        this.setState({
            outputSecondTask: selectedRatings,
            generalOutput: generalOutput
        });
    }

    /**
     * Manage results comming from Third Task
     * ThirdTask component (ThirdTask.js)
     * @param {*} rating 
     * @param {*} id 
     */
    _thirdTaskHandler(brand) {
        if (DEBUG) console.log(`Brand:${brand}`)
        const { generalOutput, userID } = this.state
        const now = Date.now();

        //we find the index of userform to update the same element instead of adding a new one in array
        let index = -1;
        for (let i = 0; i < generalOutput.length; i++) {
            if (generalOutput[i].task === constant.THIRD_TASK_SCREEN) {
                index = i;
                break;
            }
        }

        if (index === -1) {
            generalOutput.push({
                userID: userID,
                task: constant.THIRD_TASK_SCREEN,
                data: brand,
                timestamp: now,
                sync: constant.STATE_NOT_SYNC
            })
        } else {
            generalOutput[index] = {
                userID: userID,
                task: constant.THIRD_TASK_SCREEN,
                data: brand,
                timestamp: now,
                sync: constant.STATE_NOT_SYNC
            }
        }

        //save results
        this.setState({
            outputThirdTask: brand,
            generalOutput: generalOutput
        });
    }

    /**
     * Manage results comming from Fourth Task
     * FourthTask component (FourthTask.js)
     * @param {*} rating 
     * @param {*} id 
     */
    _fourthTaskHandler(selectedRatings) {
        if (DEBUG) console.log(selectedRatings)
        const { generalOutput, userID } = this.state
        const now = Date.now();

        //we find the index of userform to update the same element instead of adding a new one in array
        let index = -1;
        for (let i = 0; i < generalOutput.length; i++) {
            if (generalOutput[i].task === constant.FOURTH_TASK_SCREEN) {
                index = i;
                break;
            }
        }

        if (index === -1) {
            generalOutput.push({
                userID: userID,
                task: constant.FOURTH_TASK_SCREEN,
                data: selectedRatings,
                timestamp: now,
                sync: constant.STATE_NOT_SYNC
            })
        } else {
            generalOutput[index] = {
                userID: userID,
                task: constant.FOURTH_TASK_SCREEN,
                data: selectedRatings,
                timestamp: now,
                sync: constant.STATE_NOT_SYNC
            }
        }

        //save results
        this.setState({
            outputFourthTask: selectedRatings,
            generalOutput: generalOutput
        });
    }

    _fifthTaskHandler(selectValue) {

        if (DEBUG) console.log(selectValue)
        const { generalOutput, userID } = this.state
        const now = Date.now();

        //we find the index of userform to update the same element instead of adding a new one in array
        let index = -1;
        for (let i = 0; i < generalOutput.length; i++) {
            if (generalOutput[i].task === constant.FIFTH_TASK_SCREEN) {
                index = i;
                break;
            }
        }

        if (index === -1) {
            generalOutput.push({
                userID: userID,
                task: constant.FIFTH_TASK_SCREEN,
                data: selectValue,
                timestamp: now,
                sync: constant.STATE_NOT_SYNC
            })
        } else {
            generalOutput[index] = {
                userID: userID,
                task: constant.FIFTH_TASK_SCREEN,
                data: selectValue,
                timestamp: now,
                sync: constant.STATE_NOT_SYNC
            }
        }

        //save results
        this.setState({
            outputFifthTask: selectValue,
            generalOutput: generalOutput
        });
    }

    /**
     * Manage results comming from Final Task
     * FinalTask component (FinalTask.js)
     * @param {*} selectedAnswer 
     */
    _finalTaskHandler(selectedAnswer) {
        const { inputNavigation, currentScreenNumber, outputFinalTask,
            generalOutput, userID } = this.state;
        const now = Date.now();

        if (DEBUG) console.log(selectedAnswer)

        let currentFinalTaskScreenNumber = parseInt(inputNavigation[currentScreenNumber].pageId) - 1; //pageID goes from 1 to n, so we need to discount 1 to get the value in the array
        let selectedValue = constant.ATTRIBUTE.data.value[currentFinalTaskScreenNumber][parseInt(selectedAnswer) - 1];

        outputFinalTask[currentFinalTaskScreenNumber] = selectedValue; //The current selected answer is adjusted to the keyboard, to start from 1. So, in order to get the correct value, we substract 1 to start from 0.


        //we find the index of userform to update the same element instead of adding a new one in array
        let index = -1;
        for (let i = 0; i < generalOutput.length; i++) {
            if ((generalOutput[i].task === constant.FINAL_TASK_SCREEN) &&
                (generalOutput[i].data[0] === currentFinalTaskScreenNumber)) {
                index = i;
                break;
            }
        }

        if (index === -1) {
            generalOutput.push({
                userID: userID,
                task: constant.FINAL_TASK_SCREEN,
                data: [currentFinalTaskScreenNumber, selectedValue],
                timestamp: now,
                sync: constant.STATE_NOT_SYNC
            })
        } else {
            generalOutput[index] = {
                userID: userID,
                task: constant.FINAL_TASK_SCREEN,
                data: [currentFinalTaskScreenNumber, selectedValue],
                timestamp: now,
                sync: constant.STATE_NOT_SYNC
            }
        }

        //save results
        this.setState({
            generalOutput: generalOutput,
            outputFinalTask: outputFinalTask
        });
    }

    /**
 * Manage results comming from Psychology questionaries
 * PSFORM component (PSForm.js)
 * @param {*} evt 
 */
    _psFormHandler(evt) {
        const { outputPSForm, generalOutput, userID } = this.state;
        const now = Date.now();

        const selectedQuestionCode = evt.target.id;
        const selectedQuestionValue = evt.target.value;

        const psFormValue = { questionCode: selectedQuestionCode, answer: selectedQuestionValue };

        let outputPSFormIndex = -1;
        //if something already exists, we loop through to find the element
        for (let i = 0; i < outputPSForm.length; i++) {
            if (outputPSForm[i].questionCode === selectedQuestionCode) {  //if it is something already selected, we find that code and updated it
                outputPSFormIndex = i;
                break;
            }
        }

        if (outputPSFormIndex === -1) {
            outputPSForm.push(psFormValue)
        } else {
            outputPSForm[outputPSFormIndex] = psFormValue
        }


        //we find the index of userform to update the same element instead of adding a new one in array
        let generalOutputIndex = -1;
        for (let i = 0; i < generalOutput.length; i++) {
            if ((generalOutput[i].task === constant.PSFORM_SCREEN) &&
                (generalOutput[i].data.questionCode === selectedQuestionCode)) {
                generalOutputIndex = i;
                break;
            }
        }


        if (generalOutputIndex === -1) {
            generalOutput.push({
                userID: userID,
                task: constant.PSFORM_SCREEN,
                data: psFormValue,
                timestamp: now,
                sync: constant.STATE_NOT_SYNC
            })
        } else {
            generalOutput[generalOutputIndex] = {
                userID: userID,
                task: constant.PSFORM_SCREEN,
                data: psFormValue,
                timestamp: now,
                sync: constant.STATE_NOT_SYNC
            }
        }

        //save results
        this.setState({
            outputPSForm: outputPSForm,
            generalOutput: generalOutput
        })
    }

    /**
     * 
     * @param {*} results 
     */
    _auctionTaskHandler(results) {
        if (DEBUG) console.log(results)
        const { generalOutput, userID, outputAuctionTask } = this.state;
        const now = Date.now();

        generalOutput.push({
            userID: userID,
            task: constant.AUCTION_TASK_SCREEN,
            data: results,
            timestamp: now,
            sync: constant.STATE_NOT_SYNC
        })

        outputAuctionTask.push(results)

        //save results
        this.setState({
            outputAuctionTask: outputAuctionTask,
            generalOutput: generalOutput
        }, () => {
            this._checkSyncGeneralData()

            //we simulate a space btn pressed because Auction task already finishes with a space btn pressed
            this._validatePressedSpaceKeyToNextPage()
        })
    }

    /**
     * Manage results comming from VisualPattern component (VisualPatternTask.js)
     * @param {*} results 
     */
    _visualPatternTaskHandler(results) {
        if (DEBUG) console.log(results)

        const { generalOutput, userID } = this.state;
        const now = Date.now();

        generalOutput.push({
            userID: userID,
            task: constant.VISUAL_PATTERN_SCREEN,
            data: results,
            timestamp: now,
            sync: constant.STATE_NOT_SYNC
        })

        //save results
        this.setState({
            outputVisualPattern: results,
            generalOutput: generalOutput
        }, () => {
            //we simulate a space btn pressed because VisualPattern already finishes with a space btn pressed
            this._validatePressedSpaceKeyToNextPage()
        })
    }

    /**
     * Manage results comming from VisualPatternDemo component (VisualPatternDemoTask.js)
     * @param {*} results 
     */
    _visualPatternDemoTaskHandler(results) {
        if (DEBUG) console.log(results)
        const { generalOutput, userID } = this.state;
        const now = Date.now();

        generalOutput.push({
            userID: userID,
            task: constant.VISUAL_PATTERN_DEMO_SCREEN,
            data: results,
            timestamp: now,
            sync: constant.STATE_NOT_SYNC
        })

        //save results
        this.setState({
            outputVisualPatternDemo: results,
            generalOutput: generalOutput
        }, () => {
            //we simulate a space btn pressed because VisualPattern already finishes with a space btn pressed
            this._validatePressedSpaceKeyToNextPage()
        })
    }

    /**
     * 
     * @param {*} results 
     */
    _auctionTaskDemoHandler(results) {
        if (DEBUG) console.log(results)
        const { generalOutput, userID, outputAuctionDemoTask } = this.state;
        const now = Date.now();

        generalOutput.push({
            userID: userID,
            task: constant.AUCTION_TASK_DEMO_SCREEN,
            data: results,
            timestamp: now,
            sync: constant.STATE_NOT_SYNC
        })

        outputAuctionDemoTask.push(results)


        //save results
        this.setState({
            outputAuctionDemoTask: outputAuctionDemoTask,
            generalOutput: generalOutput
        }, () => {
            this._checkSyncGeneralData()

            //we simulate a space btn pressed because Auction task already finishes with a space btn pressed
            this._validatePressedSpaceKeyToNextPage()
        })
    }

    /*********************************************************
     * VALIDATE DATA OF EACH COMPONENT BEFORE GOING TO NEXT PAGE
     **********************************************************/

    /**
    * Validate user form results
    */
    validateForm() {
        
        const { outputFormData, inputParticipants } = this.state
        const { sex, age, yearsEduc, levelEduc, profession } = outputFormData;
        console.log("validateForm")
        console.log(outputFormData)
        let data = {
            isValid: false,
            textError: constant.TEXT_EMPTY,
            showError: false,
            redirect: false
        }

        let amountParticipant = 0;
        let ageIncorrectIntervalFlag = false;
        let femaleParticipants = inputParticipants[0];
        let maleParticipants = inputParticipants[1];

        // CONTROL OF EMPTY_TEXT
        if (age === constant.TEXT_EMPTY) {
            data.textError = constant.ERROR_5;
            data.showError = true;
        } else if (profession === constant.TEXT_EMPTY) {
            data.textError = constant.ERROR_7;
            data.showError = true; 
        } else if (levelEduc === constant.FORM_LEVEL_EDUC_DEFAULT) {
            data.textError = constant.ERROR_11;
            data.showError = true;
        } else if (yearsEduc === constant.TEXT_EMPTY) {
            data.textError = constant.ERROR_6;
            data.showError = true;
        }

        if (data.showError) return data;

        // CONTROL OF AMOUNT OF PARTICIPANTS
        if (age >= 19 && age <= 30) { //firstGroup
            amountParticipant = sex === constant.FEMALE_VALUE ? femaleParticipants.firstGroup : maleParticipants.firstGroup;
        } else if (age >= 42 && age <= 53) { //secondGroup
            amountParticipant = sex === constant.FEMALE_VALUE ? femaleParticipants.secondGroup : maleParticipants.secondGroup;
        } else if (age >= 65 && age <= 76) { //thirdGroup
            amountParticipant = sex === constant.FEMALE_VALUE ? femaleParticipants.thirdGroup : maleParticipants.thirdGroup;
        } else {
            ageIncorrectIntervalFlag = true;
        }

        if (ageIncorrectIntervalFlag || amountParticipant >= 30 ||
            levelEduc === constant.FORM_LEVEL_EDUC_INITIAL || yearsEduc < 11) {

            data.redirect = true;
            data.textError = constant.ERROR_12;
        }

        if (!data.showError && !data.redirect) data.isValid = true;


        return data;
    }

    /**
     * Validate First Task Demo results
     */
    validateFirstTaskDemo() {
        const { currentScreenNumber, inputNavigation, outputFirstTaskDemo } = this.state;

        let data = {
            isValid: false,
            textError: constant.ERROR_1,
            showError: true
        }
        let currentFirsTaskDemoScreenNumber = parseInt(inputNavigation[currentScreenNumber].pageId);

        if (currentFirsTaskDemoScreenNumber === outputFirstTaskDemo.selectedAnswer.length) { //We have selected an answer
            data.isValid = true
            data.textError = constant.TEXT_EMPTY
            data.showError = false
        }

        return data;

    }

    /**
     * Validate First Task results
     */
    validateFirstTask() {
        const { currentScreenNumber, inputNavigation, outputFirstTask } = this.state;

        let data = {
            isValid: false,
            textError: constant.ERROR_1,
            showError: true
        }
        let currentFirsTaskDemoScreenNumber = parseInt(inputNavigation[currentScreenNumber].pageId);

        if (currentFirsTaskDemoScreenNumber === outputFirstTask.selectedAnswer.length) { //We have selected an answer
            data.isValid = true
            data.textError = constant.TEXT_EMPTY
            data.showError = false
        }

        return data;
    }

    /**
     * Validate Second Task results
     */
    validateSecondTask() {
        let data = {
            isValid: true,
            textError: constant.TEXT_EMPTY,
            showError: false
        }

        const { outputSecondTask } = this.state

        if (outputSecondTask.length === 0) { //not results loaded yet
            data.isValid = false;
            data.showError = true;
            data.textError = constant.ERROR_8;
        }

        return data;
    }

    /**
     * Validate Third Task results
     */
    validateThirdTask() {
        let data = {
            isValid: true,
            textError: constant.TEXT_EMPTY,
            showError: false
        }

        const { outputThirdTask } = this.state;

        if (outputThirdTask.length === 0) {
            data.isValid = false;
            data.showError = true;
            data.textError = constant.ERROR_13;
        }

        return data;
    }

    /**
     * Validate Fourth Task results
     */
    validateFourthTask() {
        let data = {
            isValid: true,
            textError: constant.TEXT_EMPTY,
            showError: false
        }

        const { outputFourthTask } = this.state

        if (outputFourthTask.length === 0) { //not results loaded yet
            data.isValid = false;
            data.showError = true;
            data.textError = constant.ERROR_8;
        }

        return data;
    }

    /**
     * Validate Fifth Task results
     */
    validateFifthTask() {
        let data = {
            isValid: true,
            textError: constant.TEXT_EMPTY,
            showError: false
        }

        const { outputFifthTask } = this.state

        if (outputFifthTask === constant.TEXT_EMPTY) { //not results loaded yet
            data.isValid = false;
            data.showError = true;
            data.textError = constant.ERROR_9;
        }

        return data;
    }

    /**
     * Validate Final Task results
     */
    validateFinalTask() {
        const { currentScreenNumber, inputNavigation, outputFinalTask } = this.state;

        let data = {
            isValid: false,
            textError: constant.ERROR_1,
            showError: true
        }

        let currentFinalTaskScreenNumber = parseInt(inputNavigation[currentScreenNumber].pageId) - 1; //pageID goes from 1 to n, so we need to discount 1 to get the value in the array

        if (outputFinalTask[currentFinalTaskScreenNumber] !== constant.TEXT_EMPTY) {
            data.isValid = true
            data.textError = constant.TEXT_EMPTY
            data.showError = false
        }

        return data;
    }

    /**
     * Validate Auction task results
     */

    validateAuctionTask() {
        console.log("validateAuctionTask")
        const { outputAuctionTask, inputAuctionTask } = this.state;

        let data = {
            isValid: false,
            textError: constant.TEXT_EMPTY,
            showError: false
        }

        if (outputAuctionTask.length > 0 && outputAuctionTask.length === inputAuctionTask.length) {
            data.isValid = true;
        } else {
            data.textError = "Finish the task first!";
            data.showError = true;
        }

        return data;
    }

    /**
     * Validate PS Form questionaries results
     */
    validatePSForm() {
        const { currentScreenNumber, inputNavigation, inputPSForm, outputPSForm } = this.state

        let data = {
            isValid: true,
            textError: constant.TEXT_EMPTY,
            showError: false
        }
        let currentPSFormNumber = parseInt(inputNavigation[currentScreenNumber].pageId) - 1;
        let currentInputPSForm = inputPSForm[currentPSFormNumber];

        if (outputPSForm.length === 0) {
            data.isValid = false;
            data.textError = constant.ERROR_9;
            data.showError = true;
        } else {
            let found = false;
            let questionCodeNotFound = constant.TEXT_EMPTY;
            for (let i = 0; i < outputPSForm.length; i++) {
                if (currentInputPSForm.questionCode === outputPSForm[i].questionCode) {
                    found = true;
                    questionCodeNotFound = currentInputPSForm.questionCode;
                    break;
                }
            }

            if (!found) {
                data.isValid = false;
                data.textError = constant.ERROR_10;
                data.showError = true;
            }
        }
        return data;
    }

    /**
   * Validate Auction task results
   */
    validateAuctionDemoTask() {
        console.log("validateAuctionDemoTask")

        const { outputAuctionDemoTask, inputAuctionDemoTask } = this.state;

        let data = {
            isValid: false,
            textError: constant.TEXT_EMPTY,
            showError: false
        }

        console.log(outputAuctionDemoTask)
        if (outputAuctionDemoTask.length > 0 && outputAuctionDemoTask.length === inputAuctionDemoTask.length) {
            data.isValid = true;
        } else {
            data.textError = "Finish the task first!";
            data.showError = true;
        }

        console.log(data)

        return data;
    }

    /**
  * Validate Visual Pattern task results
  */
    validateVisualPattern() {
        const { outputVisualPattern } = this.state;

        let data = {
            isValid: false,
            textError: constant.TEXT_EMPTY,
            showError: false
        }

        if (outputVisualPattern.length > 0) {
            data.isValid = true;
        } else {
            data.textError = "Finish the task first!";
            data.showError = true;
        }

        return data;
    }

    /**
     * Validate Visual Pattern demo task results
     */
    validateVisualPatternDemo() {
        const { outputVisualPatternDemo } = this.state;

        let data = {
            isValid: false,
            textError: constant.TEXT_EMPTY,
            showError: false
        }

        if (outputVisualPatternDemo.length > 0) {
            data.isValid = true;
        } else {
            data.textError = "Finish the task first!";
            data.showError = true;
        }

        return data;
    }

    /**
     * Validate components before navigating between pages. Space key pressed
     */
    _validatePressedSpaceKeyToNextPage() {
        const { currentScreenNumber, inputNavigation, outputFormData } = this.state;
        const currentScreen = inputNavigation[currentScreenNumber].screen;

        let totalLength = inputNavigation.length;

        if (currentScreenNumber < totalLength) { //To prevent keep transition between pages
            if (currentScreen === constant.FIRST_TASK_DEMO_SCREEN) {
                let data = this.validateFirstTaskDemo();
                if (data.isValid) this._goToNextTaskInInputNavigation();
                else {
                    //Show errors!
                    this.setState({
                        error: {
                            showError: data.showError,
                            textError: data.textError
                        }
                    });
                }
            } else if (currentScreen === constant.FIRST_TASK_SCREEN) {
                let data = this.validateFirstTask();
                if (data.isValid) this._goToNextTaskInInputNavigation();
                else {
                    //Show errors!
                    this.setState({
                        error: {
                            showError: data.showError,
                            textError: data.textError
                        }
                    });
                }
            } else if (currentScreen === constant.REWARD_INFO_SCREEN) {
                this._goToNextTaskInInputNavigation();
            } else if (currentScreen === constant.REWARD_AUCTION_INFO_SCREEN) {
                this._goToNextTaskInInputNavigation();
            } else if (currentScreen.includes(constant.INSTRUCTION_SCREEN)) {
                this._goToNextTaskInInputNavigation();
            } else if (currentScreen === constant.SECOND_TASK_SCREEN) {
                let data = this.validateSecondTask();
                if (data.isValid) this._goToNextTaskInInputNavigation();
                else {
                    //Show errors!
                    this.setState({
                        error: {
                            showError: data.showError,
                            textError: data.textError
                        }
                    });
                }
            } else if (currentScreen === constant.THIRD_TASK_SCREEN) {
                let data = this.validateThirdTask();
                if (data.isValid) this._goToNextTaskInInputNavigation();
                else {
                    //Show errors!
                    this.setState({
                        error: {
                            showError: data.showError,
                            textError: data.textError
                        }
                    });
                }
            } else if (currentScreen === constant.FOURTH_TASK_SCREEN) {
                let data = this.validateFourthTask();
                if (data.isValid) this._goToNextTaskInInputNavigation();
                else {
                    //Show errors!
                    this.setState({
                        error: {
                            showError: data.showError,
                            textError: data.textError
                        }
                    });
                }
            } else if (currentScreen === constant.FIFTH_TASK_SCREEN) {
                let data = this.validateFifthTask();
                if (data.isValid) this._goToNextTaskInInputNavigation();
                else {
                    //Show errors!
                    this.setState({
                        error: {
                            showError: data.showError,
                            textError: data.textError
                        }
                    });
                }
            } else if (currentScreen === constant.FINAL_TASK_SCREEN) {
                let data = this.validateFinalTask();
                if (data.isValid) this._goToNextTaskInInputNavigation();
                else {
                    //Show errors!
                    this.setState({
                        error: {
                            showError: data.showError,
                            textError: data.textError
                        }
                    });
                }
            } else if (currentScreen === constant.PSFORM_SCREEN) {
                let data = this.validatePSForm();
                if (data.isValid) this._goToNextTaskInInputNavigation();
                else {
                    //Show errors!
                    this.setState({
                        error: {
                            showError: data.showError,
                            textError: data.textError
                        }
                    });
                }
            } else if (currentScreen === constant.AUCTION_TASK_DEMO_SCREEN) {
                let data = this.validateAuctionDemoTask();
                if (data.isValid) this._goToNextTaskInInputNavigation();
                else {
                    //Show errors!
                    this.setState({
                        error: {
                            showError: data.showError,
                            textError: data.textError
                        }
                    });
                }
            } else if (currentScreen === constant.AUCTION_TASK_SCREEN) {
                let data = this.validateAuctionTask();
                if (data.isValid) this._goToNextTaskInInputNavigation();
                else {
                    //Show errors!
                    this.setState({
                        error: {
                            showError: data.showError,
                            textError: data.textError
                        }
                    });
                }
            } else if (currentScreen === constant.VISUAL_PATTERN_SCREEN) {
                let data = this.validateVisualPattern();
                if (data.isValid) this._goToNextTaskInInputNavigation();
                else {
                    //Show errors!
                    this.setState({
                        error: {
                            showError: data.showError,
                            textError: data.textError
                        }
                    });
                }
            } else if (currentScreen === constant.VISUAL_PATTERN_DEMO_SCREEN) {
                let data = this.validateVisualPatternDemo();
                if (data.isValid) this._goToNextTaskInInputNavigation();
                else {
                    //Show errors!
                    this.setState({
                        error: {
                            showError: data.showError,
                            textError: data.textError
                        }
                    });
                }
            }
        }
    }

    /**
     * Validate components before navigating between pages. Enter key pressed
     */
    _validatePressedEnterButtonToNextPage() {
        const { currentScreenNumber, inputNavigation, outputFormData } = this.state;
        const currentScreen = inputNavigation[currentScreenNumber].screen;

        let totalLength = inputNavigation.length;

        if (currentScreenNumber < totalLength) { //To prevent keep transition between pages
            if (currentScreen === constant.USER_FORM_SCREEN) {
                const { sex } = outputFormData;

                let data = this.validateForm();

                if (data.isValid) {
                    //We are leaving user form screen, so we called texts whatever next page is (not only instructions)          
                    if (sex === constant.FEMALE_VALUE)
                        request.fetchAppTextFemale(this._onLoadAppTextCallBack.bind(this));
                    else
                        request.fetchAppTextMale(this._onLoadAppTextCallBack.bind(this));


                    this._goToNextTaskInInputNavigation();
                } else {
                    if (data.showError) {
                        //Show errors!
                        this.setState({
                            error: {
                                showError: data.showError,
                                textError: data.textError
                            }
                        });
                    } else if (data.redirect) {
                        //we redirect to Ariadna
                        alert(data.textError);
                        this.setState({ showAlertWindowsClosing: false }, () => {
                            window.location.replace(ARIADNA_REDIRECT_REJECT);
                        })
                    }
                }

            }
        }
    }

    /**
     * We move to next page, according to inputNavigation input data
     */
    _goToNextTaskInInputNavigation() {
        const { currentScreenNumber, inputNavigation, logTimestamp, inputFirstTask,
            inputFirstTaskDemo, showAlertWindowsClosing } = this.state;

        let currentScreen = inputNavigation[currentScreenNumber].screen;
        let loading = (currentScreen === constant.USER_FORM_SCREEN); //show loading if we are leaving user form, because text is being call
        let now = Date.now();
        let screens = logTimestamp.screen;
        let timestamps = logTimestamp.timestamp;
        let showPagination = false; //default
        let totalLength = inputNavigation.length;
        let firsTaskTotalLength = inputFirstTask.length / constant.FIRST_TASK_PROPERTIES_TOTAL;
        let firsTaskDemoTotalLength = inputFirstTaskDemo.length / constant.FIRST_TASK_PROPERTIES_TOTAL;
        let page = constant.TEXT_EMPTY;
        let nextScreenNumber = currentScreenNumber + 1;
        let showAlertWindowsClosingTmp = showAlertWindowsClosing;

        if (nextScreenNumber < totalLength) {
            let nextScreen = inputNavigation[nextScreenNumber].screen;
            let pageID = inputNavigation[nextScreenNumber].pageId;
            let progressBarNow = ((currentScreenNumber / totalLength) * 100) + 1; //progressBarNow init value is 1, so now we add +1 in order to continue that sequence

            screens.push(nextScreen);//set timestamp
            timestamps.push(now);

            if (nextScreen === constant.FIRST_TASK_SCREEN) {
                showPagination = true;
                page = `${pageID}/${firsTaskTotalLength}`;
            } else if (nextScreen === constant.FIRST_TASK_DEMO_SCREEN) {
                showPagination = true;
                page = `${pageID}/${firsTaskDemoTotalLength}`;
            } else if (nextScreenNumber === (totalLength - 1)) { //Last screen!
                // SYNC DATA
                showAlertWindowsClosingTmp = false
                loading = true //Show Loading
            }


            this.setState({
                showAlertWindowsClosing: showAlertWindowsClosingTmp,
                currentScreenNumber: nextScreenNumber,
                logTimestamp: {
                    screen: screens,
                    timestamp: timestamps
                },
                error: {
                    showError: false,
                    textError: constant.TEXT_EMPTY
                },
                showPagination: showPagination,
                page: page,
                loading: loading,
                modalOpen: false,
                progressBarNow: progressBarNow
            }, () => {
                if (DEBUG) console.log(this.state)

                if (nextScreenNumber === (totalLength - 1)) { //Last screen!
                    // SYNC DATA
                    this._syncData() //call syncdata after the experiment is completed and updated its value to true
                } else {
                    this._checkSyncGeneralData()
                }
            });
        }
    }

    _checkSyncGeneralData() {
        const { generalOutput } = this.state
        let itemsNotSyncedAmount = generalOutput.filter(item => item.sync === constant.STATE_NOT_SYNC).length

        if (itemsNotSyncedAmount >= constant.SYNC_AMOUN_ITEMS) {
            this._syncGeneralData()
        }
    }

    /**
     * Manage keyboard user interactions
     * @param {*} event 
     */
    _handleKeyDownEvent(event) {
        if (event.keyCode === constant.SPACE_KEY_CODE) { //Transition between screens
            this._validatePressedSpaceKeyToNextPage()
        } else if (event.keyCode === constant.ENTER_KEY_CODE) {
            this._validatePressedEnterButtonToNextPage()
        }
    }

    /**
     * Manage the state when the browser window is closing
     * @param {*} event 
     */
    _handleWindowClose(event) {
        if (this.state.showAlertWindowsClosing) { //we redirect without showing closing window alert
            let message = "Alerted Browser Close";
            event.preventDefault()
            event.returnValue = message
        }
        if (DEBUG) console.log(event)

        //we syncdata before the windows closes
        this._asyncData();
    }

    componentDidMount() {
        // Scroll back at the top of the page
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        this.refs.main.scrollTop = 0;

        //listener for keyboard detection
        document.addEventListener(constant.EVENT_KEY_DOWN, this.handleKeyDownEvent, false);

        // HTML prevent space bar from scrolling page
        window.addEventListener(constant.EVENT_KEY_DOWN, function (e) {
            if (e.keyCode === constant.SPACE_KEY_CODE && e.target === document.body) {
                e.preventDefault();
            }
        });
        // listener for windows closes detection
        window.addEventListener(constant.EVENT_BEFORE_UNLOAD, this.handleWindowClose);

        this.setState({ loading: true }); //Show Loading

        //we start fetching all the necesary data for the experiment
        this._fetchExperimentInputData();
    }

    componentWillUnmount() {
        document.removeEventListener(constant.EVENT_KEY_DOWN, this.handleKeyDownEvent, false);
        this._asyncData();

        window.removeEventListener(constant.EVENT_BEFORE_UNLOAD, this.handleWindowClose);
    }

    render() {
        const { progressBarNow, loading, loadingSyncData, showPagination, page } = this.state;
        const timeout = 1000 * 60 * (60 * 3); //3horas
        return (
            <main ref="main">
                <div>
                    <Progress value={progressBarNow} />
                </div>
                <section className="section-sm" style={{ marginTop: "20px", marginBottom: "20px", minHeight: "500px" }}>
                    {changePages(this.state, this.formHandler, this.firstTaskHandler, this.firstTaskDemoHandler,
                        this.secondTaskHandler, this.thirdTaskHandler, this.fourthTaskHandler, this.fifthTaskHandler,
                        this.finalTaskHandler, this.psFormHandler, this.auctionTaskHandler, this.auctionTaskDemoHandler,
                        this.visualPatternTaskHandler, this.visualPatternDemoTaskHandler)}
                </section>
                <div>
                    <IdleTimer
                        ref={ref => { this.idleTimer = ref }}
                        element={document}
                        onActive={this.onActive}
                        onIdle={this.onIdle}
                        onAction={this.onAction}
                        debounce={250}
                        timeout={timeout} />
                </div>
                <div style={{ position: "fixed", top: "35%", left: "48%" }}>
                    <FadeLoader
                        css={override}
                        size={50}
                        color={"#123abc"}
                        loading={loading}
                    />
                </div>
                <div style={{ position: "fixed", top: "5%", right: "5%" }}>
                    <SyncLoader
                        css={override}
                        size={7}
                        margin={3}
                        color={"#123abc"}
                        loading={loadingSyncData}
                    />
                </div>
                {showPagination ? <div style={{ textAlign: "end", marginRight: "5em" }}>{page}</div> : <></>}
                { isFooterShownInCurrentScreen(this.state)}
            </main>
        )
    }
}

function isFooterShownInCurrentScreen(state) {
    const { currentScreenNumber, inputNavigation } = state;
    if (inputNavigation.length === 0) return; //data was not loaded yet


    const currentScreen = inputNavigation[currentScreenNumber].screen
    let isFooterShown = false
    let footerText = constant.TEXT_FOOTER

    if (currentScreen.includes(constant.INSTRUCTION_SCREEN)) {
        if (currentScreen !== constant.VISUAL_PATTERN_INSTRUCTION_SCREEN &&
            currentScreen !== constant.VISUAL_PATTERN_DEMO_INSTRUCTION_FINISH_SCREEN &&
            currentScreen !== constant.VISUAL_PATTERN_INSTRUCTION_FINISH_SCREEN) {
            isFooterShown = true;
        }
    } else if (currentScreen === constant.REWARD_INFO_SCREEN ||
        currentScreen === constant.SECOND_TASK_SCREEN ||
        currentScreen === constant.THIRD_TASK_SCREEN ||
        currentScreen === constant.FOURTH_TASK_SCREEN ||
        currentScreen === constant.FIFTH_TASK_SCREEN ||
        currentScreen === constant.FINAL_TASK_SCREEN ||
        currentScreen === constant.REWARD_AUCTION_INFO_SCREEN ||
        currentScreen === constant.USER_FORM_SCREEN) {
        isFooterShown = true;
    }

    if (currentScreen === constant.USER_FORM_SCREEN) {
        footerText = constant.TEXT_FOOTER_ENTER
    }

    return ((isFooterShown) ? <FooterV1 text={footerText} /> : <></>)
}

/**
 * Call to a specific component. Prepare the input data for the component
 * @param {*} state 
 * @param {*} formHandler 
 * @param {*} firstTaskHandler 
 * @param {*} firstTaskDemoHandler 
 * @param {*} secondTaskHandler 
 * @param {*} finalTaskHandler 
 */
function changePages(state, formHandler, firstTaskHandler, firstTaskDemoHandler,
    secondTaskHandler, thirdTaskHandler, fourthTaskHandler, fifthTaskHandler, finalTaskHandler, psFormHandler,
    auctionTaskHandler, auctionTaskDemoHandler, visualPatternTaskHandler, visualPatternDemoTaskHandler) {

    const { currentScreenNumber,
        inputNavigation,
        inputTextInstructions,
        outputFormData,
        error,
        inputFirstTask,
        inputFirstTaskDemo,
        inputAuctionTask,
        inputAuctionDemoTask,
        outputAuctionTask,
        outputFirstTask,
        outputFirstTaskDemo,
        inputPSForm,
        outputPSForm,
        modalOpen } = state;
    const totalLength = inputNavigation.length;

    if (totalLength > 0) { //If input navigation has been called
        document.body.style.backgroundColor = LIGHT_GRAY;

        const currentScreen = inputNavigation[currentScreenNumber].screen
        const pageID = parseInt(inputNavigation[currentScreenNumber].pageId)
        const text = getTextForCurrentScreen(inputTextInstructions, currentScreen);

        if (currentScreenNumber < totalLength) { //To prevent keep transition between pages
            if (currentScreen === constant.USER_FORM_SCREEN) {
                return <UserForm
                    action={formHandler}
                    error={error}
                />;
            } else if (currentScreen.includes(constant.INSTRUCTION_SCREEN)) {
                document.body.style.backgroundColor = WHITE;
                return <Instruction
                    text={text}
                    name={currentScreen}
                />;
            } else if (currentScreen === constant.FIRST_TASK_SCREEN) {
                return <FirstTask
                    action={firstTaskHandler}
                    text={text}
                    data={inputFirstTask}
                    result={outputFirstTask}
                    counter={pageID}
                    error={error}
                    modalOpen={modalOpen}
                />;
            } else if (currentScreen === constant.FIRST_TASK_DEMO_SCREEN) {
                return <FirstTask
                    action={firstTaskDemoHandler}
                    text={text}
                    data={inputFirstTaskDemo}
                    result={outputFirstTaskDemo}
                    counter={pageID}
                    error={error}
                    modalOpen={modalOpen}
                />;
            } else if (currentScreen === constant.REWARD_INFO_SCREEN) {
                return <RewardInfo
                    data={outputFirstTask}
                />;
            } else if (currentScreen === constant.SECOND_TASK_SCREEN) {
                return <SecondTask
                    action={secondTaskHandler}
                    text={text}
                    error={error}
                />;
            } else if (currentScreen === constant.THIRD_TASK_SCREEN) {
                return <ThirdTask
                    action={thirdTaskHandler}
                    text={text}
                    error={error} />;
            } else if (currentScreen === constant.FOURTH_TASK_SCREEN) {
                return <FourthTask
                    action={fourthTaskHandler}
                    text={text}
                    error={error}
                />;
            } else if (currentScreen === constant.FIFTH_TASK_SCREEN) {
                return <FifthTask
                    action={fifthTaskHandler}
                    text={text}
                    error={error}
                />;
            } else if (currentScreen === constant.FINAL_TASK_SCREEN) {
                return <FinalTask
                    action={finalTaskHandler}
                    text={text}
                    counter={pageID}
                    error={error}
                />;//pageID goes from 1 to n, so we need to discount 1 to get the value in the array
            } else if (currentScreen === constant.AUCTION_TASK_SCREEN) {
                return <AuctionTask
                    imageIndex={0}
                    data={inputAuctionTask}
                    action={auctionTaskHandler}
                />;
            } else if (currentScreen === constant.AUCTION_TASK_DEMO_SCREEN) {
                return <AuctionTask
                    imageIndex={inputAuctionTask.length} //demo image index starts in 30, after the real auctions
                    data={inputAuctionDemoTask}
                    action={auctionTaskDemoHandler}
                />;
            } else if (currentScreen === constant.REWARD_AUCTION_INFO_SCREEN) {
                return <RewardAuctionInfo
                    sex={outputFormData.sex}
                    data={outputAuctionTask}
                />;
            } else if (currentScreen === constant.VISUAL_PATTERN_SCREEN) {
                return <VisualPatternTask action={visualPatternTaskHandler} />;
            } else if (currentScreen === constant.VISUAL_PATTERN_DEMO_SCREEN) {
                return <VisualPatternDemoTask action={visualPatternDemoTaskHandler} />;
            } else if (currentScreen === constant.PSFORM_SCREEN) {
                const currentPSForm = inputPSForm[pageID - 1];
                if (inputPSForm.length > 0) { //if we have received already the input data for psform
                    const textPSForm = getTextForCurrentScreen(inputTextInstructions, currentPSForm.screen);
                    return <PSForm
                        action={psFormHandler}
                        text={textPSForm}
                        data={currentPSForm}
                        questionsText={inputTextInstructions}
                        output={outputPSForm}
                        error={error}
                    />;
                }
            }
        }
    }
}

/**
 * Map the current screen with the correspondent text instruction to display
 * @param {*} inputTextInstructions 
 * @param {*} screen 
 */
function getTextForCurrentScreen(inputTextInstructions, screen) { //TODO when FirstTask, we should cache the text so we dont iterate every time
    let children = inputTextInstructions
        .filter((instruction) => instruction.screen === screen)
        .map((instruction) => {
            return instruction.text.split('\\n').map(function (item, key) { //replace \n with <br>
                return (
                    getFontSize(item, instruction.size, key + "_" + screen)
                )
            })
        });

    return children;
}

/**
 * Map the correspondent font size for the text instruction
 * @param {*} item 
 * @param {*} fontSize 
 * @param {*} key 
 */
function getFontSize(item, fontSize, key) {
    let children = [];

    if (item !== constant.TEXT_EMPTY) {
        switch (fontSize) {
            case constant.FONT_SIZE_HEADING1:
                children.push(<div key={key} style={{ textAlign: "justify" }}><h1>{item}</h1><br /></div>)
                break;
            case constant.FONT_SIZE_HEADING2:
                children.push(<div key={key} style={{ textAlign: "justify" }}><h2>{item}</h2><br /></div>)
                break;
            case constant.FONT_SIZE_HEADING3:
                children.push(<div key={key} style={{ textAlign: "justify" }}><h3>{item}</h3><br /></div>)
                break;
            case constant.FONT_SIZE_HEADING4:
                children.push(<div key={key} style={{ textAlign: "justify" }}><h4>{item}</h4><br /></div>)
                break;
            case constant.FONT_SIZE_HEADING5:
                children.push(<div key={key} style={{ textAlign: "justify" }}><h5>{item}</h5><br /></div>)
                break;
            case constant.FONT_SIZE_HEADING6:
                children.push(<div key={key} style={{ textAlign: "justify" }}><h6>{item}</h6><br /></div>)
                break;
            default:
        }
    }

    return children;
}

export default Experiment;
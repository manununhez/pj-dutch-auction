export const LIGHT_GRAY = "#e9ecef"; //lighter
export const WHITE = "white";
export const BLUE = "#123abc";
export const GREEN = "green";
export const RED = "red";

export const TEXT_EMPTY = "";

//Visual Pattern
export const TILE_SUCCESS = 1;
export const TILE_EMPTY = 0;
export const TILE_ERROR = 2;
export const TILE_LEFT = 3;
export const VISUAL_PATTERN_DIMENTION = [
    [3, 3, 5], //row, column, amount of blue squares
    [3, 4, 6],
    [4, 4, 8],
    [4, 5, 10],
    [5, 5, 12]
];
export const VISUAL_PATTERN_DEMO_DIMENTION = [
    [2, 2, 3], //row, column, amount of blue squares
    [2, 3, 4]
];
export const VISUAL_PATTERN_TIMESCREEN_SECS = 2;
export const VISUAL_PATTERN_RETRY_ATTEMPTS = 2;
export const VISUAL_PATTERN_DEMO_RETRY_ATTEMPTS = 1;

//AuctionTask
export const PRICE_STEP = 10;
export const FREQ_CHANGE_MS = 500;
export const BID_STATE_NOT_STARTED = 0;
export const BID_STATE_RUNNING = 1;
export const BID_STATE_FINISHED = 2;

//SYNC
export const STATE_SYNCING = 2;
export const STATE_SYNC = 1;
export const STATE_NOT_SYNC = 0;
export const SYNC_AMOUN_ITEMS = 5;
export const ONE_SECOND_MS = 1000;

// Form IDs
export const FORM_SEX = "radioSex";
export const FORM_AGE = "age";
export const FORM_PROFESSION = "profession";
export const FORM_YEARS_EDUC = "yearsEduc";
export const FORM_LEVEL_EDUC = "levelEducationSelect";
export const FORM_LEVEL_EDUC_DEFAULT = "Wybierz...";
export const FORM_LEVEL_EDUC_INITIAL = "Podstawowe";
export const FORM_LEVEL_EDUC_MIDDLE = "Średnie";
export const FORM_LEVEL_EDUC_SUPERIOR = "Wyższe";
export const FEMALE_VALUE = "F";
export const MALE_VALUE = "M";

//Footer
export const TEXT_FOOTER = "Naciśnij spację, aby przejść dalej";
export const TEXT_FOOTER_ENTER = "Naciśnij enter, aby przejść dalej";

//RATING bar
export const INACTIVE_STAR = '#d1d1cf';
export const ACTIVE_STAR = '#bf162e'; //Yellow: #ffd700
export const HIDDEN_STAR = '#ffffff';

//FONT SIZES
export const FONT_SIZE_HEADING1 = "HEADING 1";
export const FONT_SIZE_HEADING2 = "HEADING 2";
export const FONT_SIZE_HEADING3 = "HEADING 3";
export const FONT_SIZE_HEADING4 = "HEADING 4";
export const FONT_SIZE_HEADING5 = "HEADING 5";
export const FONT_SIZE_HEADING6 = "HEADING 6";

//FirstTask button Values and feedback
export const FIRST_RADIO_VALUE = "1";
export const SECOND_RADIO_VALUE = "2";
export const THIRD_RADIO_VALUE = "3";
export const SHOW_FEEDBACK_TRUE = "YES";
export const SHOW_FEEDBACK_NO = "NO";
export const FIRST_TASK_PROPERTIES_TOTAL = 6;
//First and Final Task related
export const ATTRIBUTE = {
    data:
    {
        id: ["A1", "A2", "A3", "A4", "A5", "A6"],
        text: ["max prędkość wirowania (obr/min)", "pojemność bębna (kg)",
            "klasa energetyczna", "poziom hałasu (db)", "zużycie wody (l)",
            "program szybki"],
        value: [
            ["800", "1000", "1200", "1400", "1600"],
            ["4", "5", "6", "7", "8", "9", "10"],
            ["A", "A+", "A++", "A+++"],
            ["70", "65", "60", "55", "50", "45", "40"],
            ["70", "60", "50", "40", "30"],
            ["brak", "jest"]
        ],
        prefix: ["Min ", "Min ", "Min ", "Max ", "Max ", ""],
        sufix: [" obr/min", " kg", "", "db", "l", ""]
    }
}
//SecondTask
export const ATTRIBUTE_CUSTOM = {
    data:
    {
        id: ["A7", "A3", "A5", "A4", "A6", "A2", "A1"],
        position: [7, 3, 5, 4, 6, 2, 1],
        text: [
            "cena",
            "klasa energetyczna",
            "zużycie wody (l)",
            "poziom hałasu (db)",
            "program szybki",
            "pojemność bębna (kg)",
            "max prędkość wirowania (obr/min)"
        ]
    }
}
//ThirdTask
export const BRANDS = [
    "Electrolux", "Whirlpool", "Candy Hoover", "Bosch", "Siemens", "LG Electronics", "Samsung", "Miele", "Vestel",
    "Amica", "Beko", "MPM", "Indesit", "SMEG"
];
//FourthTask
export const ATTRIBUTE_FOURTH_TASK = {
    data:
    {
        id: ["AFT1", "AFT2", "AFT3", "AFT4", "AFT5", "AFT6", "AFT7", "AFT8", "AFT9"],
        text: [
            "cena",
            "marka",
            "rozdzielczość aparatu (Mpix)",
            "pojemność baterii (mAh)",
            "pamięć RAM (GB)",
            "przekątna wyświetlacza",
            "rozdzielczość ekranu",
            "liczba rdzeni procesora",
            "ocena klientów"
        ]
    }
}

//Scenarios
export const SCENARIO_HOTEL_REV = "hotels-rev"
export const SCENARIO_HOTEL_NORMAL = "hotels"

//PSFORM
export const INPUT_TYPE = "input";
export const MULTIPLE_CHOICES_TYPE = "multiple_choice";

//keyboard related
export const SPACE_KEY_CODE = 32;
export const ENTER_KEY_CODE = 13;
export const EVENT_KEY_DOWN = "keydown";
export const EVENT_BEFORE_UNLOAD = "beforeunload";
export const EVENT_UNLOAD = "unload";

//screen names
export const USER_INFO_SCREEN = "UserInfo";
export const USER_FORM_SCREEN = "UserForm";
export const REWARD_INFO_SCREEN = "RewardScreen";
export const REWARD_AUCTION_INFO_SCREEN = "RewardAuctionScreen";
export const FIRST_TASK_SCREEN = "FirstTask";
export const FIRST_TASK_DEMO_SCREEN = "FirstTask Demo";
export const SECOND_TASK_SCREEN = "SecondTask";
export const THIRD_TASK_SCREEN = "ThirdTask";
export const FOURTH_TASK_SCREEN = "FourthTask";
export const FIFTH_TASK_SCREEN = "FifthTask";
export const FINAL_TASK_SCREEN = "FinalTask";
export const INSTRUCTION_SCREEN = "Instruction";
export const SECOND_INSTRUCTION_SCREEN = "SecondInstruction";
export const AUCTION_INSTRUCTION_DEMO_SCREEN = "AuctionInstructionDemo";
export const AUCTION_INSTRUCTION_SCREEN = "AuctionInstruction";
export const AUCTION_TASK_SCREEN = "AuctionTask";
export const AUCTION_TASK_FINISH_SCREEN = "AuctionTaskFinish";
export const AUCTION_TASK_DEMO_SCREEN = "AuctionDemoTask";
export const PSFORM_SCREEN = "PsychologyForm";
export const VISUAL_PATTERN_SCREEN = "VisualPatternTask";
export const VISUAL_PATTERN_DEMO_SCREEN = "VisualPatternTask Demo";
export const VISUAL_PATTERN_INSTRUCTION_SCREEN = "VisualPatternInstruction";
export const VISUAL_PATTERN_DEMO_INSTRUCTION_FINISH_SCREEN = "VisualPatternDemoInstructionFinish";
export const VISUAL_PATTERN_INSTRUCTION_FINISH_SCREEN = "VisualPatternInstructionFinish";

//Sheetnames
export const USER_PARTICIPANTS_COUNTER_SHEETNAME = "input-userexperimentcount";
export const USER_BRANDS_SHEETNAME = "userbrands";
export const USER_INFO_SHEETNAME = "userinfo";
export const USER_PROPERTIES_SHEETNAME = "userproperties";
export const USER_PROPERTIES_LOGEVENT_SHEETNAME = "userproperties_logevent";
export const USER_LOGTIME_SHEETNAME = "userlogtime";
export const USER_FORM_SHEETNAME = "userform";
export const USER_PRALKA_RATING_SHEETNAME = "userpralkarating";
export const USER_PRALKA_SELECTIONS_SHEETNAME = "userpralkaselections";
export const USER_MOBILE_TELEPHONE_SHEETNAME = "usermobiletelephone";
export const USER_GENERAL_DATA_SHEETNAME = "usergeneraldata";
export const VERSIONS_SHEETNAME = "input-versions";
export const INPUT_ALL_SHEETNAME = "input-all";
export const INPUT_ALL_WARMUP_SHEETNAME = "input-all-warmup";
export const INPUT_APP_MESSAGES = "input-app-messages";
export const APP_TEXT_FEMALE_SHEETNAME = "input-text-female";
export const APP_TEXT_MALE_SHEETNAME = "input-text-male";
export const USER_AUCTION_BIDS_SHEETNAME = "auction-bids"
export const USER_VISUAL_PATTERN_SHEETNAME = "uservisualpattern";
export const USER_PSFORM_SHEETNAME = "userpsform";
export const PSFORM_SHEETNAME = "input-psychologyform";
export const INPUT_REWARD_SHEETNAME = "input-reward";


//General App messages KEYS
export const REWARD_RESULT_MESSAGE = "REWARD_RESULT_MESSAGE";
export const REWARD_BONUS_MESSAGE = "REWARD_BONUS_MESSAGE";
export const AUCTION_GAIN_TEXT = "AUCTION_GAIN_TEXT"
export const AUCTION_LOSE_TEXT = "AUCTION_LOSE_TEXT"
export const AUCTION_FOOTER_TEXT = "AUCTION_FOOTER_TEXT"
export const AUCTION_EXHAUSTED_QUOTA_MESSAGE = "AUCTION_EXHAUSTED_QUOTA_MESSAGE";
export const AUCTION_REWARD_BONUS_MESSAGE = "AUCTION_REWARD_BONUS_MESSAGE";
export const AUCTION_REWARD_RESULT_MESSAGE_MALE_PART1 = "AUCTION_REWARD_RESULT_MESSAGE_MALE_PART1"
export const AUCTION_REWARD_RESULT_MESSAGE_MALE_PART2 = "AUCTION_REWARD_RESULT_MESSAGE_MALE_PART2"
export const AUCTION_REWARD_RESULT_MESSAGE_FEMALE_PART1 = "AUCTION_REWARD_RESULT_MESSAGE_FEMALE_PART1"
export const AUCTION_REWARD_RESULT_MESSAGE_FEMALE_PART2 = "AUCTION_REWARD_RESULT_MESSAGE_FEMALE_PART2"
export const AUCTION_REWARD_RESULT_MESSAGE_MALE = "AUCTION_REWARD_RESULT_MESSAGE_MALE"
export const AUCTION_REWARD_RESULT_MESSAGE_FEMALE = "AUCTION_REWARD_RESULT_MESSAGE_FEMALE"
export const ERROR_1 = "ERROR_1";//"You have to select a choice first!"
export const ERROR_5 = "ERROR_5";//Age field cannot be empty
export const ERROR_6 = "ERROR_6";//Years Education field cannot be empty!
export const ERROR_7 = "ERROR_7";//Profession field cannot be empty!
export const ERROR_8 = "ERROR_8";//Please rate all the options first!
export const ERROR_9 = "ERROR_9";//You need to complete the questions first!
export const ERROR_10 = "ERROR_10";//Please verify all the questions were checked
export const ERROR_11 = "ERROR_11";//You need to select an education level
export const ERROR_12 = "ERROR_12"; //We are sorry, but unfortunately you do not meet all the conditions for participating in the study or the number of eligible participants is already exceeded
export const ERROR_13 = "ERROR_13";//Please rate all the options first!
export const ERROR_14 = "ERROR_14";//Age field cannot be empty
export const SESSION_TIMEOUT_MESSAGE = "SESSION_TIMEOUT_MESSAGE";
export const VISUAL_PATTERN_RESULTS_PRESS_SPACE = "VISUAL_PATTERN_RESULTS_PRESS_SPACE";
export const VISUAL_PATTERN_RESULTS_FAILED = "VISUAL_PATTERN_RESULTS_FAILED";
export const VISUAL_PATTERN_RESULTS_CORRECT = "VISUAL_PATTERN_RESULTS_CORRECT";
export const VISUAL_PATTERN_TEXT_START_PRESS_SPACE = "VISUAL_PATTERN_TEXT_START_PRESS_SPACE";
export const VISUAL_PATTERN_TEXT2 = "VISUAL_PATTERN_TEXT2";


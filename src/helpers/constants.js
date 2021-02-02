export const LIGHT_GRAY = "#e9ecef"; //lighter
export const WHITE = "white";
export const BLUE = "#123abc";
export const GREEN = "green";
export const RED = "red";

export const TEXT_EMPTY = "";

//General config parameters
export const PARTICIPANTS_PER_SEX_PER_GROUP_LIMIT = 30;
export const YEARS_EDUCATION_LIMIT = 11;
export const PARTICIPANTS_PER_SCENARIO_PER_GROUP_LIMIT = 30;
export const SCENARIOS = ["hotels", "hotels-rev"]
export const PARTICIPANTS_GROUPS = [
    { minAge: 19, maxAge: 30 },
    { minAge: 42, maxAge: 53 },
    { minAge: 65, maxAge: 76 }
]
//Scenarios
export const SCENARIO_HOTEL_REV = "hotels-rev"
export const SCENARIO_HOTEL_NORMAL = "hotels"
export const SCENARIO_HOTEL_TUTORIAL = "hotels-tutorial"

//Visual Pattern
export const VISUAL_PATTERN = "VisualPattern"
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
export const BID_THRESHOLD = 2500
export const BID_BONUS = 50

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
export const REWARD_AUCTION_INFO_SCREEN = "RewardAuctionScreen";
export const INSTRUCTION_SCREEN = "Instruction";
export const AUCTION_INSTRUCTION_DEMO_SCREEN = "AuctionInstructionDemo";
export const AUCTION_INSTRUCTION_SCREEN = "AuctionInstruction";
export const AUCTION_TASK_SCREEN = "AuctionTask";
export const AUCTION_TASK_FINISH_SCREEN = "AuctionTaskFinish";
export const AUCTION_TASK_DEMO_SCREEN = "AuctionDemoTask";
export const PSFORM_SCREEN = "PsychologyForm";
export const VISUAL_PATTERN_SCREEN = "VisualPatternTask";
export const VISUAL_PATTERN_DEMO_SCREEN = "VisualPatternTaskDemo";

//General App messages KEYS
export const AUCTION_GAIN_TEXT = "Brawo, udało Ci się zarezerwować ten pokój.<br><br>Zaoszczędziłeś $(value) zł.<br><br> Naciśnij ENTER, aby przejść do następnej aukcji."
export const AUCTION_LOSE_TEXT = "Ktoś inny zarezerwował ten pokój. Musisz zapłacić pełną cenę: $(value) zł.<br><br> Naciśnij ENTER, aby przejść do następnej aukcji."
export const AUCTION_FOOTER_TEXT = "Naciśnij SPACJĘ, aby rozpocząć aukcję."
export const AUCTION_EXHAUSTED_QUOTA_MESSAGE = "No more space for participants in this scenario!";
export const AUCTION_BID_REWARD_MESSAGE_MALE = "Bardzo dziękujemy za udział w badaniu.<br><br>Poczekaj aż zakończy się proces zapisywania wyników. Zostaniesz automatycznie przekierowany na stronę Ariadny."
export const AUCTION_BID_REWARD_MESSAGE_WITH_BONUS_MALE = "Bardzo dziękujemy za udział w badaniu.<br><br>W związku z tym, że udało Ci się zaoszczędzić $(result) zł otrzymasz dodatkowo $(bonus) punktów na platformie Ariadna.<br><br>Poczekaj aż zakończy się proces zapisywania wyników. Zostaniesz automatycznie przekierowany na stronę Ariadny."
export const AUCTION_BID_REWARD_MESSAGE_FEMALE = "Bardzo dziękujemy za udział w badaniu.<br><br>Poczekaj aż zakończy się proces zapisywania wyników. Zostaniesz automatycznie przekierowany na stronę Ariadny."
export const AUCTION_BID_REWARD_MESSAGE_WITH_BONUS_FEMALE = "Bardzo dziękujemy za udział w badaniu.<br><br>W związku z tym, że udało Ci się zaoszczędzić $(result) zł otrzymasz dodatkowo $(bonus) punktów na platformie Ariadna.<br><br>Poczekaj aż zakończy się proces zapisywania wyników. Zostaniesz automatycznie przekierowany na stronę Ariadny."
export const AUCTION_BID_RESULT_MESSAGE_MALE = "Dziękujemy, to już koniec tej części zadania. W sumie zaoszczędziłeś $(result) zł.<br><br>Naciśnij SPACJĘ, żeby przejść do kolejnej części zadania."
export const AUCTION_BID_RESULT_MESSAGE_FEMALE = "Dziękujemy, to już koniec tego zadania. W sumie zaoszczędziłaś $(result) zł.<br><br> Naciśnij SPACJĘ, żeby przejść do dalszej części badania."
export const ERROR_1 = "Prosimy o dokonanie wyboru.";//"You have to select a choice first!"
export const ERROR_5 = "Pole Wiek nie może pozostać puste.";//Age field cannot be empty
export const ERROR_6 = "Pole Lata formalnej edukacji nie może pozostać puste.";//Years Education field cannot be empty!
export const ERROR_7 = "Pole Zawód nie może pozostać puste.";//Profession field cannot be empty!
export const ERROR_8 = "Proszę najpierw ocenić wszystkie opcje.";//Please rate all the options first!
export const ERROR_9 = "Najpierw należy odpowiedzieć na wszystkie pytania.";//You need to complete the questions first!
export const ERROR_10 = "Proszę upewnić się, że odpowiedź na pytanie została zaznaczona.";//Please verify all the questions were checked
export const ERROR_11 = "Proszę wybrać poziom wykształcenia.";//You need to select an education level
export const ERROR_12 = "Przepraszamy, ale niestety nie spełniasz wszystkich warunków uczestnictwa w badaniu lub przekroczona jest liczbę osób, która może wziąć w nim udział."; //We are sorry, but unfortunately you do not meet all the conditions for participating in the study or the number of eligible participants is already exceeded
export const ERROR_13 = "Proszę najpierw wybrać conajmniej jedną opcję.";//Please rate all the options first!
export const ERROR_14 = "Pole Płeć nie może pozostać puste.";//Age field cannot be empty
export const SESSION_TIMEOUT_MESSAGE = "Z powodu upływu czasu sesja została zamknięta";
export const VISUAL_PATTERN_RESULTS_PRESS_SPACE = "Naciśnij spację, aby przejść do kolejnej planszy.";
export const VISUAL_PATTERN_RESULTS_FAILED = "Niestety nie udało Ci się poprawnie zaznaczyć wszystkich pól.";
export const VISUAL_PATTERN_RESULTS_CORRECT = "Brawo! Udało Ci się poprawnie zaznaczyć wszystkie pola.";
export const VISUAL_PATTERN_TEXT_START_PRESS_SPACE = "Naciśnij spację, aby przesłać swoje rozwiązanie.";
export const VISUAL_PATTERN_INSTRUCTION = "Spróbuj odtworzyć wzór wyświetlony na poprzednim ekranie. Zaznaczasz i odznaczasz pola klikając na nie lewym przyciskiem myszy.";


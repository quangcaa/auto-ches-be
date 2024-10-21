"use strict";
var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["IN_PROGRESS"] = 0] = "IN_PROGRESS";
    GameStatus[GameStatus["COMPLETED"] = 1] = "COMPLETED";
    GameStatus[GameStatus["ABANDONED"] = 2] = "ABANDONED";
    GameStatus[GameStatus["TIME_UP"] = 3] = "TIME_UP";
    GameStatus[GameStatus["PLAYER_EXIT"] = 4] = "PLAYER_EXIT";
})(GameStatus || (GameStatus = {}));

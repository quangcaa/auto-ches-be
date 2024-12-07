// create, join game feature
const CREATE_GAME = 'create_game'
const JOIN_GAME = 'join_game'
const START_NOW = 'start_now'

// game action
const MOVE = 'move'
const LEAVE_GAME = 'leave_game'
const DRAW_OFFER = 'draw_offer'
const DRAW_RESPONSE = 'draw_response'
const RESIGN = 'resign'

// quick pairing feature
const JOIN_QUICK_PAIRING = 'join_quick_pairing'
const CANCEL_QUICK_PAIRING = 'cancel_quick_pairing'
const PAIRED = 'paired'
const CANCEL_PAIRED = 'cancel_paired'

// chat room feature
const SEND_MESSAGE = 'send_message'
const RECEIVE_MESSAGE = 'receive_message'

// game status
const IN_PROGRESS = 'in_progress'
const COMPLETED = 'completed'
const ABANDONED = 'abandoned'
const TIME_OUT = 'time out'
const PLAYER_EXIT = 'player_exit'
const GAME_OVER = 'game_over'
const CHECKMATE = 'Checkmate'

// game result
const WHITE_WINS = 'White is victorious'
const BLACK_WINS = 'Black is victorious'
const DRAW = 'Draw'

// inbox feature
const SEND_INBOX_MESSAGE = 'send_inbox_message'
const RECEIVE_INBOX_MESSAGE = 'receive_inbox_message'

// notification
const SEND_NOTIFICATION = 'send_notification'

const INVITE_PLAYER = 'invite_player'
const INVITE_RESPONSE = 'invite_response'

module.exports = {
    CREATE_GAME,
    JOIN_GAME,
    START_NOW,

    JOIN_QUICK_PAIRING,
    CANCEL_QUICK_PAIRING,
    PAIRED,
    CANCEL_PAIRED,

    MOVE,
    LEAVE_GAME,
    GAME_OVER,
    RESIGN,
    DRAW_OFFER,
    DRAW_RESPONSE,
    SEND_MESSAGE,
    RECEIVE_MESSAGE,

    INVITE_PLAYER,
    INVITE_RESPONSE,
    IN_PROGRESS,
    COMPLETED,
    CHECKMATE,
    ABANDONED,
    TIME_OUT,
    PLAYER_EXIT,
    WHITE_WINS,
    BLACK_WINS,
    DRAW,
    SEND_INBOX_MESSAGE,
    RECEIVE_INBOX_MESSAGE,

    SEND_NOTIFICATION
}
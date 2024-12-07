const GAME_CREATED = 'game_created'

// game action
const CREATE_GAME = 'create_game'
const JOIN_GAME = 'join_game'
const LEAVE_GAME = 'leave_game'
const START_GAME = 'start_game'
const MOVE = 'move'
const GAME_OVER = 'game_over'
const RESIGN = 'resign'
const DRAW_OFFER = 'draw_offer'
const DRAW_RESPONSE = 'draw_response'

const JOIN_QUICK_PAIRING = 'join_quick_pairing'

const SEND_MESSAGE = 'send_message'
const RECEIVE_MESSAGE = 'receive_message'
const NOTIFICATION_IN_GAME = 'notification_in_game'

// inbox action
const SEND_INBOX_MESSAGE = 'send_inbox_message'
const RECEIVE_INBOX_MESSAGE = 'receive_inbox_message'

const UPDATE_PLAYER_STATUS = 'update_player_status'
const GET_ONLINE_PLAYERS = 'get_online_players'

const INVITE_PLAYER = 'invite_player'
const INVITE_RESPONSE = 'invite_response'

// send notification
const SEND_NOTIFICATION = 'send_notification'


// game status
const IN_PROGRESS = 'in_progress'
const COMPLETED = 'completed'
const ABANDONED = 'abandoned'
const TIME_OUT = 'time out'
const PLAYER_EXIT = 'player_exit'
const CHECKMATE = 'Checkmate'

// game result
const WHITE_WINS = 'White is victorious'
const BLACK_WINS = 'Black is victorious'
const DRAW = 'Draw'

module.exports = {
    CREATE_GAME,
    JOIN_GAME,
    LEAVE_GAME,
    GAME_CREATED,
    START_GAME,
    MOVE,
    GAME_OVER,
    RESIGN,
    DRAW_OFFER,
    DRAW_RESPONSE,
    SEND_MESSAGE,
    RECEIVE_MESSAGE,
    NOTIFICATION_IN_GAME,
    UPDATE_PLAYER_STATUS,
    GET_ONLINE_PLAYERS,
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
    JOIN_QUICK_PAIRING,
    SEND_NOTIFICATION
}
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var readline = require('readline');
var board_state_position_s = '.';
var board_state_position_x = 'x';
var board_state_position_o = 'o';
function board_to_encoded_state(board) {
    return '\n' + board[0] + board[1] + board[2] + '\n'
        + board[3] + board[4] + board[5] + '\n'
        + board[6] + board[7] + board[8] + '\n';
}
function valid_moves(board) {
    var moves = [];
    for (var i = 0; i < board.length; ++i) {
        if (board[i] === board_state_position_s) {
            moves.push(i);
        }
    }
    return moves;
}
function array_pick(array) {
    var indexes = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        indexes[_i - 1] = arguments[_i];
    }
    var new_array = [];
    for (var _a = 0, indexes_1 = indexes; _a < indexes_1.length; _a++) {
        var index = indexes_1[_a];
        new_array.push(array[index]);
    }
    return new_array;
}
function is_win(board, player) {
    return array_pick(board, 0, 1, 2).every(function (x) { return x === player; }) ||
        array_pick(board, 3, 4, 5).every(function (x) { return x === player; }) ||
        array_pick(board, 6, 7, 8).every(function (x) { return x === player; }) ||
        array_pick(board, 0, 3, 6).every(function (x) { return x === player; }) ||
        array_pick(board, 1, 4, 7).every(function (x) { return x === player; }) ||
        array_pick(board, 2, 5, 8).every(function (x) { return x === player; }) ||
        array_pick(board, 0, 4, 8).every(function (x) { return x === player; }) ||
        array_pick(board, 2, 4, 6).every(function (x) { return x === player; });
}
function apply_move(board, move, player) {
    var new_board = __spreadArrays(board);
    new_board[move] = player;
    return new_board;
}
function other_player(player) {
    if (player === board_state_position_x) {
        return board_state_position_o;
    }
    return board_state_position_x;
}
var pick_memos = {};
var eval_memos = {};
function eval_moves(board, current_player, moving_player) {
    var _a;
    var board_key = board_to_encoded_state(board) + ':' + current_player + ':' + moving_player;
    // console.log(board_key)
    if (eval_memos[board_key]) {
        return eval_memos[board_key];
    }
    var ratings = {};
    var valid_moves_arr = valid_moves(board);
    var next_moving_player = other_player(moving_player);
    // early out any wins
    for (var _i = 0, valid_moves_arr_1 = valid_moves_arr; _i < valid_moves_arr_1.length; _i++) {
        var my_move = valid_moves_arr_1[_i];
        var candidate_board = apply_move(board, my_move, moving_player);
        var move_key = my_move.toString();
        var moving_player_wins = is_win(candidate_board, moving_player);
        if (moving_player_wins) {
            var value = moving_player === current_player ? 1 : 0;
            eval_memos[move_key] = (_a = {}, _a[move_key] = value, _a);
            return eval_memos[move_key];
        }
    }
    for (var _b = 0, valid_moves_arr_2 = valid_moves_arr; _b < valid_moves_arr_2.length; _b++) {
        var my_move = valid_moves_arr_2[_b];
        var candidate_board = apply_move(board, my_move, moving_player);
        var move_key = my_move.toString();
        ratings[move_key] = 0.5;
        var descendant_moves = eval_moves(candidate_board, current_player, next_moving_player);
        var mm = void 0;
        if (current_player === moving_player) {
            // descendant is other player, assume they minimize our value
            mm = min_move(descendant_moves);
        }
        else {
            // descendant is current player, assume we maximize our value
            mm = max_move(descendant_moves);
        }
        if (mm) {
            ratings[move_key] *= mm[1];
        }
    }
    eval_memos[board_key] = ratings;
    return ratings;
}
function min_move(moves) {
    var entries = Object.entries(moves);
    if (entries.length === 0) {
        return;
    }
    var n = entries[0];
    for (var i = 1; i < entries.length; ++i) {
        if (entries[i][1] < n[1]) {
            n = entries[i];
        }
    }
    return n;
}
function max_move(moves) {
    var entries = Object.entries(moves);
    if (entries.length === 0) {
        return;
    }
    var n = entries[0];
    for (var i = 1; i < entries.length; ++i) {
        if (entries[i][1] > n[1]) {
            n = entries[i];
        }
    }
    return n;
}
function pick_move(board, current_player) {
    var board_state = board_to_encoded_state(board);
    var board_key = board_state + ':' + current_player;
    if (pick_memos[board_key]) {
        return pick_memos[board_key];
    }
    // todo: isomorph search in pick_memos
    var descendant_moves = eval_moves(board, current_player, current_player);
    var mm = max_move(descendant_moves);
    // console.log(descendant_moves, mm);
    var picked_move = mm ? +mm[0] : undefined;
    pick_memos[board_key] = picked_move;
    return picked_move;
}
function play() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var board, reader, first_player, second_player, reader_1, reader_1_1, line, pos, pos2, e_1_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    board = [
                        board_state_position_s, board_state_position_s, board_state_position_s,
                        board_state_position_s, board_state_position_s, board_state_position_s,
                        board_state_position_s, board_state_position_s, board_state_position_s,
                    ];
                    reader = readline.createInterface({ input: process.stdin, output: process.stdout });
                    first_player = board_state_position_x;
                    second_player = board_state_position_o;
                    // TODO: prevent cheating and limit input to only valid moves.
                    console.log(board_to_encoded_state(board));
                    console.log('enter position [0-8]: ');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    reader_1 = __asyncValues(reader);
                    _b.label = 2;
                case 2: return [4 /*yield*/, reader_1.next()];
                case 3:
                    if (!(reader_1_1 = _b.sent(), !reader_1_1.done)) return [3 /*break*/, 5];
                    line = reader_1_1.value;
                    pos = +line;
                    board[pos] = first_player;
                    if (is_win(board, first_player)) {
                        console.log('you win');
                        process.exit();
                    }
                    if (valid_moves(board).length === 0) {
                        console.log('tie');
                        process.exit();
                    }
                    pos2 = pick_move(board, second_player) || 0;
                    board[pos2] = second_player;
                    if (is_win(board, second_player)) {
                        console.log('you lose');
                        process.exit();
                    }
                    if (valid_moves(board).length === 0) {
                        console.log('tie');
                        process.exit();
                    }
                    console.log(board_to_encoded_state(board));
                    console.log('enter position [0-8]: ');
                    _b.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(reader_1_1 && !reader_1_1.done && (_a = reader_1.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(reader_1)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
play();

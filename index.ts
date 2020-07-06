const readline = require('readline');

const board_state_position_s = '.';
const board_state_position_x = 'x';
const board_state_position_o = 'o';

// positions
//  0, 1, 2,
//  3, 4, 5,
//  6, 7, 8

type board_t = string[];

function board_to_encoded_state(board: board_t): string {
  return '\n' + board[0] + board[1] + board[2] + '\n'
    + board[3] + board[4] + board[5] + '\n'
    + board[6] + board[7] + board[8] + '\n';
}

function valid_moves(board: board_t): number[] {
  const moves = [];
  for (let i = 0; i < board.length; ++i) {
    if (board[i] === board_state_position_s) {
      moves.push(i);
    }
  }
  return moves;
}

function array_pick<T>(array: T[], ...indexes: number[]): T[] {
  const new_array: T[] = [];
  for (const index of indexes) {
    new_array.push(array[index]);
  }
  return new_array;
}

function is_win(board: board_t, player: string): boolean {
  return array_pick(board, 0, 1, 2).every(x => x === player) ||
    array_pick(board, 3, 4, 5).every(x => x === player) ||
    array_pick(board, 6, 7, 8).every(x => x === player) ||
    array_pick(board, 0, 3, 6).every(x => x === player) ||
    array_pick(board, 1, 4, 7).every(x => x === player) ||
    array_pick(board, 2, 5, 8).every(x => x === player) ||
    array_pick(board, 0, 4, 8).every(x => x === player) ||
    array_pick(board, 2, 4, 6).every(x => x === player);
}

function apply_move(board: board_t, move: number, player: string): board_t {
  const new_board = [...board];
  new_board[move] = player;
  return new_board;
}

function other_player(player: string): string {
  if (player === board_state_position_x) {
    return board_state_position_o;
  }
  return board_state_position_x;
}

let pick_memos: { [board_key: string]: number | undefined } = {};
let eval_memos: { [board_key: string]: { [move_key: string]: number } } = {};

function eval_moves(board: board_t, current_player: string, moving_player: string): { [move_key: string]: number } {
  const board_key = board_to_encoded_state(board) + ':' + current_player + ':' + moving_player;
  // console.log(board_key)
  if (eval_memos[board_key]) {
    return eval_memos[board_key];
  }

  const ratings: { [move_key: string]: number } = {};

  const valid_moves_arr = valid_moves(board);

  const next_moving_player = other_player(moving_player);

  // early out any wins
  for (let my_move of valid_moves_arr) {
    const candidate_board = apply_move(board, my_move, moving_player);
    const move_key = my_move.toString();
    const moving_player_wins = is_win(candidate_board, moving_player);
    if (moving_player_wins) {
      const value = moving_player === current_player ? 1 : 0;
      eval_memos[move_key] = {[move_key]: value};
      return eval_memos[move_key];
    }
  }

  for (let my_move of valid_moves_arr) {
    const candidate_board = apply_move(board, my_move, moving_player);
    const move_key = my_move.toString();

    ratings[move_key] = 0.5;

    const descendant_moves = eval_moves(candidate_board, current_player, next_moving_player);

    let mm: [string, number] | undefined;
    if (current_player === moving_player) {
      // descendant is other player, assume they minimize our value
      mm = min_move(descendant_moves);
    } else {
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

function min_move(moves: { [move_key: string]: number }): [string, number] | undefined {
  const entries = Object.entries(moves);
  if (entries.length === 0) {
    return;
  }
  let n = entries[0];
  for (let i = 1; i < entries.length; ++i) {
    if (entries[i][1] < n[1]) {
      n = entries[i];
    }
  }
  return n;
}


function max_move(moves: { [move_key: string]: number }): [string, number] | undefined {
  const entries = Object.entries(moves);
  if (entries.length === 0) {
    return;
  }
  let n = entries[0];
  for (let i = 1; i < entries.length; ++i) {
    if (entries[i][1] > n[1]) {
      n = entries[i];
    }
  }
  return n;
}

function pick_move(board: board_t, current_player: string): number | undefined {
  const board_state = board_to_encoded_state(board);
  const board_key = board_state + ':' + current_player;

  if (pick_memos[board_key]) {
    return pick_memos[board_key];
  }

  // todo: isomorph search in pick_memos

  const descendant_moves = eval_moves(board, current_player, current_player);
  const mm = max_move(descendant_moves);
  // console.log(descendant_moves, mm);

  let picked_move = mm ? +mm[0] : undefined;

  pick_memos[board_key] = picked_move;
  return picked_move;
}

async function play() {
  let board = [
    board_state_position_s, board_state_position_s, board_state_position_s,
    board_state_position_s, board_state_position_s, board_state_position_s,
    board_state_position_s, board_state_position_s, board_state_position_s,
  ];

  const reader = readline.createInterface({input: process.stdin, output: process.stdout});

  const first_player = board_state_position_x;
  const second_player = board_state_position_o;

  // TODO: prevent cheating and limit input to only valid moves.
  console.log(board_to_encoded_state(board));
  console.log('enter position [0-8]: ');

  for await (const line of reader) {
    const pos = +line;
    board[pos] = first_player;
    if (is_win(board, first_player)) {
      console.log('you win');
      process.exit();
    }
    if (valid_moves(board).length === 0) {
      console.log('tie');
      process.exit();
    }

    const pos2 = pick_move(board, second_player) || 0;
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
  }
}

play();

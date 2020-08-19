var screen = document.getElementById('game-screen');
var context = screen.getContext("2d");

var placar = 0;

const state = {
  players: {
    'player_1': { pos_x: 0, pos_y: 0 },
    // 'player_2': { pos_x: 1, pos_y: 1 },
  },

  fruits: {
    'fruit_1': { pos_x: 5, pos_y: 6 },
    // 'fruit_2': { pos_x: 8, pos_y: 7 }
  }
}

render_screen();

function render_screen() {
  // clean screen
  context.fillStyle = 'white';
  context.clearRect(0, 0, 10, 10);

  for (const player_id in state.players) {
    const player = state.players[player_id];
    const color_player = 'black';

    context.fillStyle = color_player;
    context.fillRect(player.pos_x, player.pos_y, 1, 1)
  }

  for (const fruit_id in state.fruits) {
    const fruit = state.fruits[fruit_id];
    const color_fruit = 'green';

    context.fillStyle = color_fruit;
    context.fillRect(fruit.pos_x, fruit.pos_y, 1, 1);
  }

  // otimiza a chamada recursiva de renderizar a tela do jogo
  requestAnimationFrame(render_screen);
}

function create_game() {
  function move_player(command) {
    const player = state.players[command.player_id];

    if (command.key_pressed == 'ArrowUp' && player.pos_y > 0) {
      player.pos_y -= 1;
    }
    if (command.key_pressed == 'ArrowDown' && player.pos_y < 9) {
      player.pos_y += 1;
    }
    if (command.key_pressed == 'ArrowRight' && player.pos_x < 9) {
      player.pos_x += 1;
    }
    if (command.key_pressed == 'ArrowLeft' && player.pos_x > 0) {
      player.pos_x -= 1;
    }

  }

  return {
    move_player,
    state
  }
}

const keyboard_listener = create_keyboard_listener();
const game = create_game();

keyboard_listener.subscribe(game.move_player);

function create_keyboard_listener() {
  const state = {
    observers: []
  }

  function subscribe(observe_function) {
    state.observers.push(observe_function);
  }

  function notify_all(command) {
    console.log(`Notifying ${state.observers.length} observer`);

    for (const observe_function of state.observers) {
      observe_function(command);
    }
  }

  document.onkeydown = function handle_keydown(event) {
    const key_pressed = event.key;
    const command = {
      player_id: 'player_1',
      key_pressed
    }

    game.move_player(command);
    cacth_fruit();

    notify_all(command);
  }

  return {
    subscribe
  }
}

function cacth_fruit() {
  if (state.players['player_1'].pos_x == state.fruits['fruit_1'].pos_x &&
    state.players['player_1'].pos_y == state.fruits['fruit_1'].pos_y) {
    update_score();
    return create_fruit();
  }
}

function create_fruit() {
  state.fruits['fruit_1'].pos_x = Math.floor(Math.random() * 10);
  state.fruits['fruit_1'].pos_y = Math.floor(Math.random() * 10);

  return render_screen();
}

function update_score() {
  placar += 10;
}

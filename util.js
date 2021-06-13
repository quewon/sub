var config = {
  num_of_students: [4, 6, 8, 8],
  round_length: [30, 30, 30, 30],
  num_of_rounds: [3, 5, 3, 5],
  speed: 1000,
  fastSpeed: 500,
  seatingPenalty: [-1],

  popupLifespan: 5,
  popupsDie: false,

  minPerStudent: 5,

  paused: false,
  endlessMode: false,

  music_playing: false,
};

var ui = {
  loading: document.getElementById("loading"),
  loading_text: document.querySelector("#loading .text"),
  loading_icon: document.querySelector("#loading img"),
  game: document.getElementById("game"),
  pause: document.getElementById("pause"),
  end: document.getElementById("end"),
  speed_button: document.getElementById("speed"),
  pause_clock: document.querySelector("#pause .clock"),
  clock: document.getElementById("clock"),
  files: document.querySelector("#file_binder .text"),
  files_left_arrow: document.querySelector("#file_binder .left.arrow"),
  files_right_arrow: document.querySelector("#file_binder .right.arrow"),
  attendance: document.querySelector("#attendance .text"),
  seating_wrapper: document.getElementById("seating"),
  seating_tooltip: document.querySelector("#seating .tooltip"),
  seating: document.querySelector("#seating .tables"),
  seating_buttons: document.querySelector("#seating .buttons"),

  level_text: document.getElementById("level_text"),
  balance: document.getElementById("balance"),

  zIndex: 0,
};

var game;
var level, timer, second, minute;
var students = {
  info: {},
  files: [],
  current_page: 0,
  attendance: [],
  selected: [],
};
var student_files = [];

var player = {
  balance: 0,
  paycheck: 0,
  day: 0,
}

var sounds, music;

function page(num) {
  topage(students.current_page += num);
}

function topage(p) {
  if (p > students.files.length - 1) {
    p = students.files.length - 1
  } else if (p < 0) {
    p = 0
  }

  students.current_page = p;
  unhide(ui.files_right_arrow);
  unhide(ui.files_left_arrow);
  if (p <= 0) {
    hide(ui.files_left_arrow);
  } else if (p >= students.files.length - 1) {
    hide(ui.files_right_arrow);
  }

  ui.files.innerHTML = students.files[p];
}

function hide(el) {
  el.classList.add("hidden");
}
function unhide(el) {
  el.classList.remove("hidden");
}

function swapNodes(n1, n2) {
    var p1 = n1.parentNode;
    var p2 = n2.parentNode;
    var i1, i2;

    if ( !p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1) ) return;

    for (var i = 0; i < p1.children.length; i++) {
        if (p1.children[i].isEqualNode(n1)) {
            i1 = i;
        }
    }
    for (var i = 0; i < p2.children.length; i++) {
        if (p2.children[i].isEqualNode(n2)) {
            i2 = i;
        }
    }

    if ( p1.isEqualNode(p2) && i1 < i2 ) {
        i2++;
    }
    p1.insertBefore(n2, p1.children[i1]);
    p2.insertBefore(n1, p2.children[i2]);
}

function tooltip(name) {
  if (name != "") {
    ui.seating_tooltip.classList.remove("hidden");
    ui.seating_tooltip.textContent = name;
  } else {
    ui.seating_tooltip.classList.add("hidden")
  }
}

function toggleSpeed() {
  clearInterval(game);

  if (ui.speed_button.textContent == "speed up") {
    game = setInterval(update, config.fastSpeed);
    ui.speed_button.textContent = "normal speed";
    ui.speed_button.classList.add("down");
  } else {
    game = setInterval(update, config.speed);
    ui.speed_button.textContent = "speed up";
    ui.speed_button.classList.remove("down")
  }

  sounds.click.play();
}

function toggleMusic() {
  config.music_playing = !config.music_playing;

  if (config.music_playing) {
    music[level].play();
  } else {
    music[level].pause();
  }
}

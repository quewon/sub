function win() {
  document.getElementById('start').classList.add('hidden');
  let gameover = document.getElementById("gameover");
  gameover.querySelector(".win").classList.remove("hidden");
  gameover.classList.remove("hidden");
}

function lose() {
  document.getElementById('start').classList.add('hidden');
  let gameover = document.getElementById("gameover");
  gameover.querySelector(".lose").classList.remove("hidden");
  gameover.classList.remove("hidden");
}

function mainmenu() {
  document.getElementById('game').classList.add('hidden');
  document.getElementById('start').classList.remove('hidden');
  document.getElementById('gameover').classList.add('hidden');
}

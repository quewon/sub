function pause() {
  sounds.menu.play();

  config.paused = true;

  ui.pause.classList.remove("hidden");
  ui.game.classList.add("untouchable");
  ui.pause.classList.remove("appear");
  void ui.pause.offsetWidth;
  ui.pause.classList.add("appear");

  ui.pause_clock.textContent = ui.clock.textContent;

  ui.balance.textContent = "$"+player.balance;

  console.log(ui.balance);
}

function unpause() {
  sounds.menu.stop();

  config.paused = false;

  ui.pause.classList.add("hidden");
  ui.game.classList.remove("untouchable");
}

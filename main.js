function init() {
  document.getElementById("start").classList.add("hidden");

  students = {
    info: {},
    files: [],
    current_page: 0,
    attendance: [],
    selected: [],
  };
  student_files = [];

  player = {
    balance: 0,
    paycheck: 0,
    day: 0,
  }

  //make objects draggable

  let objects = document.getElementsByClassName("object");
  for (let i in objects) {
    makeDraggable(objects[i]);
  }

  document.addEventListener('contextmenu', event => event.preventDefault());

  level = 0;

  ui.seating_wrapper.addEventListener("mousemove", function(e) {
    let x = e.clientX - event.currentTarget.getBoundingClientRect().left;
    let y = e.clientY - event.currentTarget.getBoundingClientRect().top;

    ui.seating_tooltip.style.top = y + "px";
    ui.seating_tooltip.style.left = x + "px";
  });

  player.debt = 0;
  for (let i in config.num_of_students) {
    player.debt += config.minPerStudent * config.num_of_students[i]
  }

  setup();
}

function setup() {
  config.music_playing = false;
  ui.game.classList.add("hidden");

  if (level > config.num_of_students.length - 1) {
    if (player.balance >= player.debt) {
      win();
    } else {
      lose();
    }
    return
  }

  dialogue.timeToNextPopup = 0;
  dialogue.backlog = [];

  let popups = document.getElementsByClassName("popup");
  while (popups.length > 0) {
    popups[0].remove();
  }

  ui.level_text.innerHTML = bank.levels[level].replace("$debt", "$"+player.debt).replace("$level", player.day+1);

  if (config.endlessMode) {
    ui.level_text.innerHTML = bank.levels_endless[level].replace("$debt", "$"+player.debt).replace("$level", player.day+1);
  }

  timer = config.num_of_rounds[level] * config.round_length[level];
  minute = Math.floor(timer / 60);
  second = timer % 60;
  if (second < 10) second = "0" + second;

  ui.clock.textContent = minute + ":" + second;

  ui.attendance.innerHTML = "";
  ui.seating.innerHTML = "";

  //arrange objects
  let objects = document.getElementsByClassName("object");

  for (let i = 0; i<objects.length; i++) {
    let rand = Math.floor(Math.random() * 50) + 25;
    objects[i].style.left = rand + "%";

    rand = Math.floor(Math.random() * 50) + 25;
    objects[i].style.top = rand + "%";
  }

  //create students
  students.attendance = [];
  students.info = {};
  for (let i=0; i<config.num_of_students[level]; i++) {
    let pre = bank.prefixes[bank.prefixes.length * Math.random() | 0];
    let suf = bank.suffixes[bank.suffixes.length * Math.random() | 0];
    let icon = bank.icons[i];

    let name = pre + suf;

    let ii = 0;
    while (name in students.info) {
      name = pre + " " + suf.charAt(ii) + ".";
      ii++;
    }

    students.info[name] = {};
    students.info[name].icon = icon;
    students.info[name].strategy = bank.strategies[bank.strategies.length * Math.random() | 0];
    students.info[name].personality = bank.personalities[bank.personalities.length * Math.random() | 0];
    students.info[name].grades = bank.grades[students.info[name].strategy];
    students.info[name].history = [];
    students.info[name].sound_index = Math.floor(Math.random() * sounds.popup.length);
    students.info[name].workQuality = 0;

    students.attendance.push(name);
  }

  let noslacker = true;
  for (let i in students.attendance) {
    if (students.info[students.attendance[i]].strategy == "slacker") {
      noslacker = false;
      break;
    }
  }

  let spawnkev = Math.floor(Math.random() * 100);
  if (spawnkev == 68) {
    delete students.info[students.attendance[students.attendance.length - 1]];
    students.attendance.pop();

    let kev = {};
    kev.icon = bank.kev;
    kev.strategy = "absent";
    kev.personality = "kev";
    kev.grades = ["F"];
    kev.history = [];
    kev.workQuality = 0;

    students.info.kev = kev;
    students.attendance.push("kev");
  }

  students.info[students.attendance[Math.random() * students.attendance.length | 0]].personality = "teacher's pet";

  if (noslacker) {
    students.info[students.attendance[0]].strategy = "slacker";
  }

  //sort attendance in alphabetical order
  students.attendance.sort((a, b) => a.localeCompare(b));

  for (let i in students.attendance) {
    let name = students.attendance[i];
    let p = parseInt(i) + 1;

    ui.attendance.innerHTML += "<a onclick='topage("+p+")'>" + name + "</a><br>";
  }

  //file pages
  students.files = [];
  students.files.push('<span class="centered" style="margin-left:1em;margin-top:-3em">STUDENT FILES</span>');
  for (let i in students.attendance) {
    let name = students.attendance[i];
    student = students.info[name];
    let content =
        "<h2>GRADES</h2> " + student.grades + "<br><br>" +
        "<h2>NOTES</h2> " + bank.teachers_notes[student.personality];
    students.files.push('<div class="page"><img class="icon" src="icons/'+student.icon+'"><br><h1>' + name + "</h1><hr>" + content + '</div>');
  }
  // students.files.push('');
  page(0);

  //tables and seats
  let tables = Math.ceil(config.num_of_students[level] / 2);
  for (let i=0; i<tables; i++) {
    let size = (Math.round(Math.random()) > 0) ? "big" : "small";
    let el = document.createElement("div");
    el.className = "table " + size;
    ui.seating.appendChild(el);

    let radius = "2.5em";
    if (size == "big") {
      radius = "3.5em";
    }

    deg = Math.round(Math.random() * 180);

    let seat = document.createElement("div");
    seat.className = "seat";
    seat.style.transform = "rotate("+deg+"deg) translate(calc("+radius+" - 50%))";
    el.appendChild(seat);

    deg += 180;

    seat = document.createElement("div");
    seat.className = "seat";
    seat.style.transform = "rotate("+deg+"deg) translate(calc("+radius+" - 50%))";
    el.appendChild(seat);
  }

  //partner em up
  for (let i=0; i<students.attendance.length; i += 2) {
    students.info[students.attendance[i]].partner = students.attendance[i+1];
    students.info[students.attendance[i+1]].partner = students.attendance[i];
  }

  // seat em
  tables = ui.seating.getElementsByClassName("table");
  let unseated_kids = [...students.attendance];

  let i=0;
  while (unseated_kids.length > 0) {
    let t = tables[i];
    let s = t.getElementsByClassName("seat");

    let kid1 = unseated_kids[0];
    let kid2 = students.info[kid1].partner;

    students.info[kid1].icon_div = document.createElement("img");
    students.info[kid1].icon_div.className = "icon small";
    students.info[kid1].icon_div.src = "icons/"+students.info[kid1].icon;
    students.info[kid1].icon_div.onclick = function() {
      select(kid1);
    };
    students.info[kid1].icon_div.onmouseenter = function(){tooltip(kid1)};
    students.info[kid1].icon_div.onmouseleave = function(){tooltip("")};

    students.info[kid2].icon_div = document.createElement("img");
    students.info[kid2].icon_div.className = "icon small";
    students.info[kid2].icon_div.src = "icons/"+students.info[kid2].icon;
    students.info[kid2].icon_div.onclick = function() {
      select(kid2)
    };
    students.info[kid2].icon_div.onmouseenter = function(){tooltip(kid2)};
    students.info[kid2].icon_div.onmouseleave = function(){tooltip("")};

    s[0].appendChild(students.info[kid1].icon_div);
    s[1].appendChild(students.info[kid2].icon_div);

    students.info[kid1].icon_parent = students.info[kid1].icon_div.parentElement;
    students.info[kid2].icon_parent = students.info[kid2].icon_div.parentElement;

    unseated_kids.splice(unseated_kids.indexOf(kid1), 1);
    unseated_kids.splice(unseated_kids.indexOf(kid2), 1);

    i++;
  }

  clearInterval(game);
  game = setInterval(update, config.speed);

  ui.speed_button.textContent = "speed up";
  ui.speed_button.classList.remove("down")

  pause();
}

function select(kid) {
  if (students.selected.includes(kid)) {
    students.selected.splice(students.selected.indexOf(kid), 1);
    students.info[kid].icon_div.classList.remove("selected");
  } else {
    students.selected.push(kid);
    students.info[kid].icon_div.classList.add("selected");
  }

  if (students.selected.length >= 2) {
    let k1 = students.selected[0];
    let k2 = students.selected[1];
    let div1 = students.info[k1].icon_div;
    let div2 = students.info[k2].icon_div;
    div1.classList.remove("selected");
    div2.classList.remove("selected");
    swapNodes(div1, div2);

    let k1p = students.info[k1].partner;
    let k2p = students.info[k2].partner;

    if ('temp_partner' in students.info[k1]) k1p = students.info[k1].temp_partner;
    if ('temp_partner' in students.info[k2]) k2p = students.info[k2].temp_partner;

    if (k2p != k1) {
      students.info[k1].temp_partner = k2p;
      students.info[k2p].temp_partner = k1;
    }
    if (k1p != k2) {
      students.info[k2].temp_partner = k1p;
      students.info[k1p].temp_partner = k2;
    }

    students.selected = [];

    ui.seating_buttons.classList.remove("hidden");
  }
}

function announceNewSeating() {
  let popup = document.createElement("div");
  popup.className = "popup seating";
  popup.innerHTML = bank.change_seating_text + "<hr>";

  let confirmbutton = document.createElement("button");
  confirmbutton.innerHTML = bank.change_seating_ok;
  confirmbutton.onclick = function() {
    sounds.click.play();
    for (let i in students.attendance) {
      let info = students.info[students.attendance[i]];
      if ('temp_partner' in info) {
        info.partner = info.temp_partner;
        delete info.temp_partner;
        info.workQuality += config.seatingPenalty[level];
      }
      info.icon_parent = info.icon_div.parentNode;
    }

    ui.seating_buttons.classList.add("hidden");

    popup.remove();
  }
  let cancelbutton = document.createElement("button");
  cancelbutton.innerHTML = bank.change_seating_cancel;
  cancelbutton.onclick = function() {
    sounds.click.play();
    popup.remove();
  }
  popup.appendChild(confirmbutton);
  popup.appendChild(cancelbutton);

  makeDraggable(popup);

  popup.style.zIndex = 1 + ui.zIndex;
  ui.zIndex++;

  ui.game.appendChild(popup);
}

function revertSeating() {
  //remove icons
  for (let i in students.attendance) {
    let info = students.info[students.attendance[i]];
    if ('temp_partner' in info) {
      delete info.temp_partner;
    }

    info.icon_div.remove();
    info.icon_parent.appendChild(info.icon_div);
  }

  ui.seating_buttons.classList.add("hidden");
}

function update() {
  if (config.paused) return

  timer--;

  if (second <= 0) {
    minute--;
    second = 59;
  } else {
    second--;
  }

  if (second < 10) second = "0" + second;
  ui.clock.textContent = minute + ":" + second;

  if (dialogue.timeToNextPopup > 0) {
    dialogue.popupTimer++;

    if (dialogue.popupTimer >= dialogue.timeToNextPopup) {
      dialogue.popupTimer = 0;

      if (dialogue.backlog.length > 0) {
        say(dialogue.backlog.shift());
      }
    }
  }

  if (timer <= 0) {
    round();
    end();
  } else if (timer % config.round_length[level] == 0) {
    round();
  }
}

function end() {
  config.music_playing = false;
  music[level].stop();
  sounds.level_complete.play();

  ui.clock.textContent = "0:00";

  clearInterval(game);
  gradeStudents();

  // show end screen
  ui.end.classList.remove("hidden");
  ui.end.classList.remove("appear");
  void ui.end.offsetWidth;
  ui.end.classList.add("appear");

  let names = "";
  let grades = "";
  for (let i in students.attendance) {
    names += students.attendance[i] + "<br>";
    grades += students.info[students.attendance[i]].grade + "<br>";
  }
  ui.end.querySelector(".names").innerHTML = names;
  ui.end.querySelector(".grades").innerHTML = grades;

  ui.end.querySelector(".revenue").textContent = player.paycheck;
  player.balance += player.paycheck - 5;
  ui.end.querySelector(".balance").textContent = player.balance;

  level++;
  player.day++;

  if (config.endlessMode) {
    level = Math.floor(Math.random() * config.num_of_students.length);
  }
}

function gradeStudents() {
  console.log("--- grades ---");

  let paycheck = 0;

  for (let i in students.attendance) {
    let student = students.info[students.attendance[i]];
    let work = student.workQuality;
    let grade;

    let r = config.num_of_rounds[level];
    let cutoffs = {
      "A": r * 2.75,
      "B": r,
      "C": r * -1,
      "D": (r * -2) + 1,
    }

    if (work >= cutoffs.A) {
      grade = "A";
      paycheck += 5;
    } else if (
      work < cutoffs.A &&
      work >= cutoffs.B
    ) {
      grade = "B";
      paycheck += 2.5;
    } else if (
      work < cutoffs.B &&
      work >= cutoffs.C
    ) {
      grade = "C";
      paycheck += 2;
    } else if (
      work < cutoffs.C &&
      work >= cutoffs.D
    ) {
      grade = "D";
      paycheck += 1;
    } else {
      grade = "F";
    }

    if (student.strategy == "absent") {
      grade = "N/A";
    }

    student.grade = grade;
  }

  player.paycheck = paycheck;

  console.log("paycheck: $" + paycheck);
}

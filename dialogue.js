var dialogue = {
  backlog: [],
  timeToNextPopup: 0,
  popupTimer: 0,
};

function say(o) {
  let name = o.name;
  let line = o.line;

  let label = document.createElement("div");
  label.className = "label";
  label.innerHTML = '<img class="icon" src="icons/'+students.info[name].icon+'"><b>' + name + "</b>";

  let linebox = document.createElement("span");
  linebox.className = "linebox";
  linebox.innerHTML = line;

  let popup = document.createElement("div");
  popup.className = "popup";
  popup.appendChild(label);

  let x = document.createElement("a");
  x.className = "x";
  x.textContent = "x";
  x.onclick = function() {
    // popup.classList.add("gone");
    // setInterval(function() {
    //   popup.remove();
    // }, 1000)
    popup.remove();
  }
  popup.appendChild(x);
  popup.appendChild(linebox);

  // choice menu

  if ('menu' in o) {
    linebox.innerHTML += "<hr>";

    let menu = o.menu;
    for (choice in menu) {
      let button = document.createElement("button");
      button.innerHTML = choice;
      let newline = menu[choice];
      button.onclick = function() {
        sounds.click.play();
        linebox.innerHTML = newline;
      }
      linebox.appendChild(button)
    }
  }

  if (config.popupsDie) {
    setInterval(function() {
      popup.classList.add("gone");
      setInterval(function() {
        popup.remove();
      }, 1000)
    }, config.popupLifespan * config.speed);
  }

  // place popup somewhere random

  let rand = Math.floor(Math.random() * 50) + 25;
  popup.style.left = rand + "%";
  rand = Math.floor(Math.random() * 50) + 25;
  popup.style.top = rand + "%";

  ui.game.appendChild(popup);
  popup.style.zIndex = 1 + ui.zIndex;
  ui.zIndex++;

  makeDraggable(popup);

  sounds.popup[students.info[name].sound_index].play();
}

function generateDialogue(name, type) {
  let d = {};
  let personality = students.info[name].personality;

  if (personality == "shy") return
  if (personality == "liar") {
    if (type == "chat") {
      type = "complaint"
    } else {
      type = "chat"
    }

    let potential_personalities = [...bank.personalities];
    potential_personalities.splice(potential_personalities.indexOf("liar"), 1);
    potential_personalities.splice(potential_personalities.indexOf("shy"), 1);
    personality = potential_personalities[Math.random() * potential_personalities.length | 0];
  }

  d.name = name;

  switch (type) {
    case "chat":
      let inthemood = false;

      if (personality == "chatterbox") {
        inthemood = true
      } else {
        inthemood = (Math.round(Math.random()) > 0) ? true : false
      }

      if (inthemood) {
        let b = bank.dialogue[personality].chat;

        if (b==undefined) {
          console.log(personality)
        }

        d.line = parse(b.line, name);
        if ('menu' in b) {
          d.menu = b.menu;

          for (choice in d.menu) {
            d.menu[choice] = parse(d.menu[choice], name);
          }
        }

        dialogue.backlog.push(d);
      }
      break;
    case "complaint":
      let b = bank.dialogue[personality].complaint;
      if ('menu' in b) {
        d.menu = b.menu;

        for (choice in d.menu) {
          d.menu[choice] = parse(d.menu[choice], name);
        }
      }

      d.line = parse(b.line, name);

      dialogue.backlog.push(d);
      break;
  }
}

function parse(line, name) {
  let info = students.info[name];

  let output = line;

  output = output.replace(/\$partner/g, info.partner);

  let available_names = [...students.attendance];
  available_names.splice(available_names.indexOf(name), 1);

  while (output.includes("$random")) {
    let randint = Math.floor(available_names.length * Math.random());
    output = output.replace("$random", available_names[randint]);
    available_names.splice(randint, 1);
  }

  return output
}

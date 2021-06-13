function round() {
  console.log("--- round begin ---");

  for (let i in students.attendance) {
    let student = students.info[students.attendance[i]];
    let partner = students.info[student.partner];

    let firstRound = false;
    if (student.history.length == 0) {
      firstRound = true
    }

    let action;
    switch (student.strategy) {
      case "random":
        action = Math.round(Math.random());
        break;
      case "absent":
      case "slacker":
        action = 0;
        break;
      case "worker":
        action = 1;
        break;
      case "slack4slack": //copycat
        if (firstRound) {
          action = 1;
        } else {
          action = partner.history[partner.history.length-1];
        }
        break;
      case "work4slack":
        if (firstRound) {
          action = 0;
        } else {
          if (partner.history[partner.history.length-1] == 0) {
            action = 1;
          } else {
            action = 0;
          }
        }
        break;
      case "work4work":
        if (firstRound) {
          action = 1
        } else {
          if (partner.history[partner.history.length-1] == 0) {
            action = 0
          } else {
            action = 1
          }
        }
        break;
      case "slack4work":
        if (firstRound) {
          action = 1
        } else {
          if (partner.history[partner.history.length-1] == 0) {
            action = 1
          } else {
            action = 0
          }
        }
        break;
    }

    student.roundAction = action;

    // console.log(students.attendance[i], student.strategy, student.partner, action)
  }

  for (let i in students.attendance) {
    let student = students.info[students.attendance[i]];
    student.history.push(student.roundAction);
  }

  for (let i in students.attendance) {
    let student = students.info[students.attendance[i]];
    let partner = students.info[student.partner];

    // quality of work is affected based on partner's performance
    if (partner.roundAction == 1 && student.roundAction == 1) {
      student.workQuality += 3
    } else if (partner.roundAction == 1 || student.roundAction == 1) {
      student.workQuality += 1
    } else {
      student.workQuality -= 2
    }

    if (student.roundAction == 1 && partner.roundAction == 0) {
      generateDialogue(students.attendance[i], "complaint");
    } else {
      generateDialogue(students.attendance[i], "chat");
    }

    // console.log(students.attendance[i], student.workQuality);
  }

  dialogue.timeToNextPopup = Math.floor(config.round_length[level] / (dialogue.backlog.length + 1));
  dialogue.popupTimer = 0;
}

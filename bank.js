var bank = {
  prefixes: ["bone", "cake", "jack", "wolf", "river", "fox", "stick", "gun", "page", "star", "mail", "pie", "sky", "bear", "fish", "moss", "leaf", "moth", "knife"],
  suffixes: ["bot", "stop", "man", "bone", "pond", "face", "river", "crow", "stick", "gun", "lake", "star", "moon", "guy", "girl", "kid", "dad", "mom", "fish", "leaf"],
  icons: ["cat.png", "cute.png", "spunky.png", "sweaty.png", "sweetheart.png", "ears.png", "tired.png", "eyes.png"],

  strategies: ["worker", "slacker", "slack4slack", "work4slack", "work4work", "slack4work", "random"],
  grades: {
    "random": ["C"],
    "worker": ["A"],
    "slacker": ["D"],
    "slack4slack": ["C"],
    "work4slack": ["B"],
    "work4work": ["B"],
    "slack4work": ["B"],
  },

  change_seating_text: "just a note: this action will set back your students' progress by a bit.",
  change_seating_ok: "ok",
  change_seating_cancel: "cancel",

  personalities: ["snitch", "chatterbox", "social butterfly", "liar", "gossipy", "shy"],
  teachers_notes: {
    "teacher's pet": "i'm not one to pick favorites but this student is just so great haha",
    "snitch": "frequently snitches on other kids",
    "chatterbox": "a chatterbox that loves to joke around",
    "social butterfly": "everybody knows their name",
    "liar": "a very... confusing student",
    "gossipy": "if they ask 'wanna know something?', do not answer",
    "shy": "forcing them to present in front of class every week has not shown to be effective yet, but perhaps the next week will be the week they break out of their shell...",
    "kev": "<3",
  },

  dialogue: {
    "teacher's pet": {
      complaint: {line:"as much as i love $partner i do worry about my grade... /noshade"},
      chat: {line:"i brought cupcakes for everybody!"}
    },
    "snitch": {
      complaint: {
        line: "hello, $partner isn't doing any of the work. can you do something about that?"
      },
      chat: {
        line: "i sure hope my partner isn't chewing gum right now"
      },
    },
    "chatterbox": {
      complaint: {
        line: "im so bored!! hey, teacher, tell us a story!"
      },
      chat: {
        line: "knock knock!",
        menu: {
          "who's there?": `he
          <br><br>
          he hoo ha ha`,
        }
      }
    },
    "social butterfly": {
      complaint: {line:"as much as i love $partner i do worry about my grade... /noshade"},
      chat: {line:"i brought cupcakes for everybody!"}
    },
    "gossipy": {
      complaint: {
        line: "omg, $partner is <i>not</i> being the best partner rn..."
      },
      chat:{
        line: "wanna know something??",
        menu: {
          "what is it?": "$random told me last night that they <i>kissed</i> $random. yea. i know",
          "go back to your seat": "you'll regret not hearing this!!"
        }
      }
    },
    "kev": {
      complaint: {line:"whatever"},
      chat:{line:"ima outie"}
    },
  },

  kev: "kev.png",


  levels: [
    "<h1>day $level</h1><hr>your first day as a substitute teacher.<br>debt payment ($debt) due in 3 days.",
    "<h1>day $level</h1><hr>you're moving up a grade! how exciting!<br>debt payment ($debt) due in 2 days.",
    "<h1>day $level</h1><hr>this time, in a bigger classroom.<br>debt payment ($debt) due in 1 day.",
    "<h1>day $level</h1><hr>will it be enough to pay off your loans?<br>debt payment ($debt) due <b>today!!!</b>"
  ],
  levels_endless: [
    "<h1>day $level</h1><hr>another day, another class",
    "<h1>day $level</h1><hr>another day, another class",
    "<h1>day $level</h1><hr>another day, another class",
    "<h1>day $level</h1><hr>another day, another class"
  ],
};

const number = JSON.parse(localStorage.getItem("number"));
console.log(number);

const level = JSON.parse(localStorage.getItem("level"));
console.log(level);

const player = JSON.parse(localStorage.getItem("player"));
console.log(player);

const team = JSON.parse(localStorage.getItem("team"));
console.log(team);

const nameTeam = document.querySelector("#nameTeam");

const keys = document.querySelectorAll(".key");

const pendu = document.querySelector("#pendu");

const scoreList = document.querySelector("#scoreList");

const scorePlayers = document.querySelectorAll(".scorePlayer");
const scoreTeam = document.querySelectorAll(".scoreTeam");

let currentPlayer = 0;

let maskedWord;
let secretWord;
let counter;
let errors;
let usedLetters = [];
let playerScore = [];
let teamScore = [];

player.forEach((player, index) => {
  playerScore.push(0);
});

team.forEach((team, index) => {
  teamScore.push(0);
});

function displayCurrentPlayer() {
  document.querySelector("#namePlayer").textContent =
    `⚔️ Le destin est entre tes mains : ${player[currentPlayer]}`;

  if (number === "4") {
    const currentTeam =
      currentPlayer === 0 || currentPlayer === 1 ? team[0] : team[1];
    document.querySelector("#nameTeam").textContent =
      `🏯 Tu combats pour : ${currentTeam}`;
  }
}
displayCurrentPlayer();
displayScore();

function displayScore() {
  if (number === "4") {
    scorePlayers.forEach((scorePlayer) => {
      scorePlayer.style.display = "none";
    });

    scoreTeam.forEach((scoreTeam, index) => {
      scoreTeam.style.display = "list-item";
      scoreTeam.textContent = `${team[index]} : ${teamScore[index]}`;
    });
  } else {
    scorePlayers.forEach((scorePlayer, index) => {
      if (index < number) {
        scorePlayer.style.display = "list-item";
        scorePlayer.textContent = `${player[index]} : ${playerScore[index]}`;
      } else {
        scorePlayer.style.display = "none";
      }
    });

    scoreTeam.forEach((scoreTeam) => {
      scoreTeam.style.display = "none";
    });
  }
}

function playLetter(letter) {
  console.log(letter);
  console.log(secretWord.includes(letter));
  let newMaskedWord;

  if (counter === 0) {
    return;
  }

  const key = document.querySelector(`.key[data-letter="${letter}"]`);

  if (usedLetters.includes(letter)) {
    return;
  }
  usedLetters.push(letter);

  if (!secretWord.includes(letter)) {
    key.classList.add("wrong");
  } else {
    key.classList.add("correct");
    if (number === "4") {
      let teamIndex;

      if (currentPlayer === 0 || currentPlayer === 1) {
        teamIndex = 0;
      } else {
        teamIndex = 1;
      }
      teamScore[teamIndex]++;
    } else {
      playerScore[currentPlayer]++;
    }

    displayScore();
  }

  newMaskedWord = secretWord
    .split("")
    .map((secretLetter, index) =>
      secretLetter === letter ? letter : maskedWord[index],
    );

  maskedWord = newMaskedWord;
  document.querySelector("#word").textContent = newMaskedWord.join(" ");

  if (maskedWord.join("") === secretWord) {
    pendu.src = "assets/image/penduWin.PNG";
    return;
  }

  if (!secretWord.includes(letter)) {
    counter--;
    errors = level - counter;
    document.querySelector("#attempts").textContent =
      `🩸 Le destin se referme : ${counter} tentatives`;
    if (level === "6") {
      pendu.src = `assets/image/pendu${errors + 5}.PNG`;
    } else {
      pendu.src = `assets/image/pendu${errors}.PNG`;
    }
  }

  if (counter === 0) {
    pendu.src = "assets/image/pendu11.PNG";
    return;
  }

  if (number === "4") {
    if (currentPlayer === 0) {
      currentPlayer = 2;
    } else if (currentPlayer === 2) {
      currentPlayer = 1;
    } else if (currentPlayer === 1) {
      currentPlayer = 3;
    } else {
      currentPlayer = 0;
    }
  } else {
    if (currentPlayer === number - 1) {
      currentPlayer = 0;
    } else {
      currentPlayer = currentPlayer + 1;
    }
  }
  console.log("Nouveau joueur :", currentPlayer);

  displayCurrentPlayer();
}

const words = async () => {
  const response = await fetch("data/words.json");
  const wordsList = await response.json();

  return wordsList;
};

const startGame = async () => {
  const wordList = await words();
  secretWord = wordList[Math.floor(Math.random() * wordList.length)];
  maskedWord = secretWord.split("").map((letter) => "-");
  console.log(secretWord);
  console.log(maskedWord.join(" "));
  document.querySelector("#word").textContent = `${maskedWord.join(" ")}`;

  if (level === "11") {
    pendu.src = "assets/image/pendu.PNG";
  } else if (level === "6") {
    pendu.src = "assets/image/pendu5.PNG";
  }

  counter = level;
  document.querySelector("#attempts").textContent =
    `🩸 Le destin se referme : ${counter} tentatives`;
};
startGame();

document.addEventListener("keydown", (event) => {
  if (/^[A-Z]$/.test(event.key.toUpperCase())) {
    playLetter(event.key.toUpperCase());
  }
});

keys.forEach((key) => {
  key.addEventListener("click", () => {
    playLetter(key.dataset.letter);
  });
});

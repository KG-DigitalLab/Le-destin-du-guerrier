const number = JSON.parse(localStorage.getItem("number"));
console.log(number);

const level = JSON.parse(localStorage.getItem("level"));
console.log(level);

const player = JSON.parse(localStorage.getItem("player"));
console.log(player);

const team = JSON.parse(localStorage.getItem("team"));
console.log(team);

const nextPenalty = JSON.parse(localStorage.getItem("nextPenalty"));

let gameStats = JSON.parse(localStorage.getItem("gameStats"));

const nameTeam = document.querySelector("#nameTeam");

const keys = document.querySelectorAll(".key");

const pendu = document.querySelector("#pendu");

const scoreList = document.querySelector("#scoreList");

const scorePlayers = document.querySelectorAll(".scorePlayer");
const scoreTeam = document.querySelectorAll(".scoreTeam");

const proposalInput = document.querySelector("#proposition");
const proposalButton = document.querySelector("#validateProposal");

const looser = document.querySelector("#looser");

const quitGame = document.querySelector("#quitGame");
const confirmQuit = document.querySelector("#confirmQuit");
const cancelQuit = document.querySelector("#cancelQuit");

const proposalList = document.querySelector("#proposalList");

const gameScoreTitle = document.querySelector("#gameScoreTitle");
const gameScore = document.querySelector("#gameScore");

let currentPlayer = 0;
let teamIndex;

let maskedWord;
let secretWord;
let counter;
let errors;

let usedLetters = [];
let playerScore = [];
let teamScore = [];
let wordProposal = [];

if (!gameStats) {
  gameStats = {
    playerWins: Array(Number(number)).fill(0),
    teamWins: [0, 0],
    wordsFound: 0,
  };
}

player.forEach((player, index) => {
  playerScore.push(
    nextPenalty &&
      nextPenalty.type === "player" &&
      nextPenalty.indices.includes(index)
      ? -1
      : 0,
  );
});

team.forEach((team, index) => {
  teamScore.push(
    nextPenalty &&
      nextPenalty.type === "team" &&
      nextPenalty.indices.includes(index)
      ? -1
      : 0,
  );
});

function displayCurrentPlayer() {
  document.querySelector("#namePlayer").textContent =
    `⚔️ Le destin est entre tes mains : ${player[currentPlayer]}`;

  if (number === "4") {
    const currentTeam =
      currentPlayer === 0 || currentPlayer === 1 ? team[0] : team[1];

    nameTeam.textContent = `🏯 Tu combats pour : ${currentTeam}`;
  }
}

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

  const hasWonRound =
    (number === "1" && gameStats.wordsFound > 0) ||
    ((number === "2" || number === "3") &&
      gameStats.playerWins.some((wins) => wins > 0)) ||
    (number === "4" && gameStats.teamWins.some((wins) => wins > 0));

  if (hasWonRound) {
    gameScoreTitle.style.display = "block";
    gameScore.style.display = "block";

    gameScore.innerHTML = "";

    if (number === "1") {
      const score = document.createElement("li");
      score.textContent = `${player[0]} : ${gameStats.wordsFound}`;
      gameScore.append(score);
    } else if (number === "2" || number === "3") {
      gameStats.playerWins.forEach((playerWins, index) => {
        const score = document.createElement("li");
        score.textContent = `${player[index]} : ${playerWins}`;
        gameScore.append(score);
      });
    } else {
      gameStats.teamWins.forEach((teamWins, index) => {
        const score = document.createElement("li");
        score.textContent = `${team[index]} : ${teamWins}`;
        gameScore.append(score);
      });
    }
  }
}

function endGame(result) {
  localStorage.setItem("gameResult", JSON.stringify(result));
  localStorage.setItem("secretWord", JSON.stringify(secretWord));
  localStorage.setItem("gameResultProcessed", JSON.stringify(false));

  location.href = "endgame.html";
}

function changePlayer() {
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
      currentPlayer++;
    }
  }

  console.log("Nouveau joueur :", currentPlayer);
  displayCurrentPlayer();
}

function playLetter(letter) {
  if (!secretWord || !maskedWord || counter === undefined) {
    return;
  }

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

  const newMaskedWord = secretWord
    .split("")
    .map((secretLetter, index) =>
      secretLetter === letter ? letter : maskedWord[index],
    );

  maskedWord = newMaskedWord;

  document.querySelector("#word").textContent = newMaskedWord.join(" ");

  if (maskedWord.join("") === secretWord) {
    pendu.src = "assets/image/penduWin.PNG";
    endGame({
      result: "win",
      winner: number === "4" ? team[teamIndex] : player[currentPlayer],
    });
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

    if (number === "1") {
      endGame({
        result: "lose",
        penalized: [],
      });
      return;
    }

    const scores = number === "4" ? teamScore : playerScore;
    const lowestScore = Math.min(...scores);
    const penalized = [];

    scores.forEach((score, index) => {
      if (score === lowestScore) {
        penalized.push(index);
      }
    });

    if (scores.every((score) => score === lowestScore)) {
      endGame({
        result: "draw",
        penalized: [],
      });
    } else {
      endGame({
        result: "lose",
        penalized: penalized,
      });
    }

    return;
  }

  changePlayer();
}

const words = async () => {
  const response = await fetch("data/words.json");
  const wordsList = await response.json();

  return wordsList;
};

const startGame = async () => {
  const wordList = await words();

  secretWord = wordList[Math.floor(Math.random() * wordList.length)];

  maskedWord = secretWord.split("").map(() => "-");

  console.log(secretWord);
  console.log(maskedWord.join(" "));

  document.querySelector("#word").textContent = maskedWord.join(" ");

  if (level === "11") {
    pendu.src = "assets/image/pendu.PNG";
  } else if (level === "6") {
    pendu.src = "assets/image/pendu5.PNG";
  }

  counter = Number(level);

  document.querySelector("#attempts").textContent =
    `🩸 Le destin se referme : ${counter} tentatives`;
};

startGame();

displayCurrentPlayer();
displayScore();

document.addEventListener("keydown", (event) => {
  if (event.target === proposalInput) {
    return;
  }

  if (/^[A-Z]$/.test(event.key.toUpperCase())) {
    playLetter(event.key.toUpperCase());
  }
});

proposalButton.addEventListener("click", () => {
  const proposal = proposalInput.value.trim().toUpperCase();

  if (!secretWord || counter === undefined) {
    return;
  }

  if (proposal === "") {
    return;
  }

  if (wordProposal.includes(proposal)) {
    return;
  }

  if (proposal === secretWord) {
    if (number === "4") {
      if (currentPlayer === 0 || currentPlayer === 1) {
        teamIndex = 0;
      } else {
        teamIndex = 1;
      }

      teamScore[teamIndex] += 2;
    } else {
      playerScore[currentPlayer] += 2;
    }

    displayScore();

    pendu.src = "assets/image/penduWin.PNG";
    endGame({
      result: "win",
      winner: number === "4" ? team[teamIndex] : player[currentPlayer],
    });
    return;
  }

  wordProposal.push(proposal);

  const newProposal = document.createElement("li");
  newProposal.textContent = proposal;
  proposalList.append(newProposal);

  proposalInput.value = "";

  if (number === "4") {
    if (currentPlayer === 0 || currentPlayer === 1) {
      teamIndex = 0;
    } else {
      teamIndex = 1;
    }

    teamScore[teamIndex] -= 1;
  } else {
    playerScore[currentPlayer] -= 1;
  }

  displayScore();

  counter--;
  errors = level - counter;

  document.querySelector("#attempts").textContent =
    `🩸 Le destin se referme : ${counter} tentatives`;

  if (level === "6") {
    pendu.src = `assets/image/pendu${errors + 5}.PNG`;
  } else {
    pendu.src = `assets/image/pendu${errors}.PNG`;
  }

  if (counter === 0) {
    pendu.src = "assets/image/pendu11.PNG";

    if (number === "1") {
      endGame({
        result: "lose",
        penalized: [],
      });
      return;
    }

    const scores = number === "4" ? teamScore : playerScore;
    const lowestScore = Math.min(...scores);
    const penalized = [];

    scores.forEach((score, index) => {
      if (score === lowestScore) {
        penalized.push(index);
      }
    });

    if (scores.every((score) => score === lowestScore)) {
      endGame({
        result: "draw",
        penalized: [],
      });
    } else {
      endGame({
        result: "lose",
        penalized: penalized,
      });
    }

    return;
  }

  changePlayer();
});

keys.forEach((key) => {
  key.addEventListener("click", () => {
    playLetter(key.dataset.letter);
  });
});

looser.addEventListener("click", () => {
  quitGame.showModal();
});

cancelQuit.addEventListener("click", () => {
  quitGame.close();
});

confirmQuit.addEventListener("click", () => {
  location.href = "home.html";
});

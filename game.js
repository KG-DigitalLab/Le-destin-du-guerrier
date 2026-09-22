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

const proposalInput = document.querySelector("#proposition");
const proposalButton = document.querySelector("#validateProposal");

const looser = document.querySelector("#looser");

const quitGame = document.querySelector("#quitGame");
const confirmQuit = document.querySelector("#confirmQuit");
const cancelQuit = document.querySelector("#cancelQuit");

const proposalList = document.querySelector("#proposalList");

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

player.forEach((player) => {
  playerScore.push(0);
});

team.forEach((team) => {
  teamScore.push(0);
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
}

function endGame(result) {
  localStorage.setItem("gameResult", JSON.stringify(result));
  localStorage.setItem("secretWord", JSON.stringify(secretWord));

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
  // Empêche toute action avant le chargement du mot
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
    endGame("win");
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
    endGame("lose");
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
    endGame("win");
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
    endGame("lose");
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

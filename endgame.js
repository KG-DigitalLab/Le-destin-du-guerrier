const end = document.querySelector("#end");
const result = document.querySelector("#result");
const final = document.querySelector("#final");
const secret = document.querySelector("#secret");
const replay = document.querySelector("#replay");
const changeDifficulty = document.querySelector("#changeDifficulty");
const quit = document.querySelector("#quit");
const penalty = document.querySelector("#penalty");
const difficultyChoice = document.querySelector("#difficultyChoice");
const launchGame = document.querySelector("#launchGame");

const gameResult = JSON.parse(localStorage.getItem("gameResult"));
const secretWord = JSON.parse(localStorage.getItem("secretWord"));
const number = JSON.parse(localStorage.getItem("number"));
const player = JSON.parse(localStorage.getItem("player"));
const team = JSON.parse(localStorage.getItem("team"));

let gameStats = JSON.parse(localStorage.getItem("gameStats"));
let gameResultProcessed =
  JSON.parse(localStorage.getItem("gameResultProcessed")) || false;

if (!gameStats) {
  gameStats = {
    playerWins: Array(Number(number)).fill(0),
    teamWins: [0, 0],
    wordsFound: 0,
  };
}

if (gameResult.result === "win") {
  result.textContent = `🏆 Le destin avait écrit ton chemin.
Tu viens d'en écrire la fin.`;

  secret.textContent = `Le mot était : ${secretWord}`;

  penalty.textContent = `⚔️ Vainqueur : ${gameResult.winner}`;

  final.src = "assets/image/penduWin.PNG";

  if (!gameResultProcessed) {
    if (number === "1") {
      gameStats.wordsFound++;
    } else if (number === "2" || number === "3") {
      gameStats.playerWins[player.indexOf(gameResult.winner)]++;
    } else {
      gameStats.teamWins[team.indexOf(gameResult.winner)]++;
    }

    localStorage.setItem("gameStats", JSON.stringify(gameStats));
    localStorage.setItem("gameResultProcessed", JSON.stringify(true));
  }
  localStorage.removeItem("nextPenalty");
} else if (gameResult.result === "lose") {
  result.textContent = `☠️ Même le plus grand guerrier connaît la défaite. La véritable force est de se relever.`;

  secret.textContent = `Le mot était : ${secretWord}`;

  final.src = "assets/image/pendu11.PNG";

  let penalizedNames = [];

  if (number === "4") {
    penalizedNames = gameResult.penalized.map((index) => team[index]);
  } else {
    penalizedNames = gameResult.penalized.map((index) => player[index]);
  }

  if (penalizedNames.length === 1) {
    penalty.textContent = `⚔️ ${penalizedNames[0]}, le destin réclame son dû. La prochaine bataille commencera avec un poids de -1 point.`;
  } else {
    penalty.textContent = `⚔️ ${penalizedNames.join(" et ")}, le destin réclame son dû. La prochaine bataille commencera avec un poids de -1 point.`;
  }

  if (!gameResultProcessed) {
    let nextPenalty;

    if (number === "4") {
      nextPenalty = {
        type: "team",
        indices: gameResult.penalized,
      };
    } else {
      nextPenalty = {
        type: "player",
        indices: gameResult.penalized,
      };
    }

    if (penalizedNames.length > 0) {
      localStorage.setItem("nextPenalty", JSON.stringify(nextPenalty));
    }

    localStorage.setItem("gameResultProcessed", JSON.stringify(true));
  }
} else {
  result.textContent = `⚖️ Deux guerriers, une seule voie… mais aucun n’aura vaincu l’autre aujourd’hui.`;

  secret.textContent = `Le mot était : ${secretWord}`;

  localStorage.removeItem("nextPenalty");

  final.src = "assets/image/pendu11.PNG";
}

replay.addEventListener("click", () => {
  location.href = "game.html";
});

difficultyChoice.style.display = "none";

changeDifficulty.addEventListener("click", () => {
  difficultyChoice.style.display = "block";
});

launchGame.addEventListener("click", () => {
  const selectedPath = document.querySelector('[name="path"]:checked').value;

  localStorage.setItem("level", JSON.stringify(selectedPath));

  location.href = "game.html";
});

quit.addEventListener("click", () => {
  location.href = "home.html";
});

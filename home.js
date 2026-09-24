const gamePlan = document.querySelector("#gamePlan");
const submitButton = document.querySelector("#submitButton");
const players = document.querySelectorAll("[name = player]");
const playersNames = document.querySelectorAll("[id^=player]");
const teamsNames = document.querySelectorAll("[id^=team]");
const difficulty = document.querySelectorAll("[name = path]");
let numberOfPlayers;
let level;
const playerList = [];
const teamList = [];

gamePlan.addEventListener("submit", (event) => {
  event.preventDefault();

  let valid = true;

  const selectedPlayer = document.querySelector(
    '[name="player"]:checked',
  ).value;

  numberOfPlayers = selectedPlayer;

  const selectedLevel = document.querySelector('[name="path"]:checked').value;

  level = selectedLevel;

  playerList.length = 0;
  teamList.length = 0;

  playersNames.forEach((playerName, index) => {
    if (index < numberOfPlayers) {
      const name = playerName.value.trim();

      if (name === "") {
        valid = false;
        playerName.focus();
        return;
      }

      playerList.push(name);
    }
  });

  if (numberOfPlayers === "4") {
    teamsNames.forEach((teamName) => {
      const name = teamName.value.trim();

      if (name === "") {
        valid = false;
        teamName.focus();
        return;
      }

      teamList.push(name);
    });
  }

  if (!valid) {
    return;
  }

  localStorage.removeItem("gameStats");
  localStorage.removeItem("nextPenalty");

  localStorage.setItem("number", JSON.stringify(numberOfPlayers));
  localStorage.setItem("level", JSON.stringify(level));
  localStorage.setItem("player", JSON.stringify(playerList));
  localStorage.setItem("team", JSON.stringify(teamList));

  console.log(JSON.parse(localStorage.getItem("number")));
  console.log(JSON.parse(localStorage.getItem("level")));
  console.log(JSON.parse(localStorage.getItem("player")));
  console.log(JSON.parse(localStorage.getItem("team")));

  location.href = "game.html";
});

players.forEach((player) => {
  player.addEventListener("change", (event) => {
    numberOfPlayers = event.target.value;

    playersNames.forEach((playerName, index) => {
      if (index < numberOfPlayers) {
        playerName.required = true;
      } else {
        playerName.required = false;
      }
    });

    teamsNames.forEach((teamName) => {
      if (numberOfPlayers === "4") {
        teamName.required = true;
      } else {
        teamName.required = false;
      }
    });
  });
});

difficulty.forEach((path) => {
  path.addEventListener("change", (event) => {
    level = event.target.value;
  });
});

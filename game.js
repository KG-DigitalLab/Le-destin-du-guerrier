const number = JSON.parse(localStorage.getItem("number"));
console.log(number);

const level = JSON.parse(localStorage.getItem("level"));
console.log(level);

const player = JSON.parse(localStorage.getItem("player"));
console.log(player);

const team = JSON.parse(localStorage.getItem("team"));
console.log(team);

const keys = document.querySelectorAll(".key");

const pendu = document.querySelector("#pendu");

let currentPlayer = 0;

let maskedWord;
let secretWord;
let counter;
let errors;

function playLetter(letter) {
  console.log(letter);
  console.log(secretWord.includes(letter));
  let newMaskedWord;

  if (counter === 0) {
    return;
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

document.querySelector("#namePlayer").textContent =
  `⚔️ Le destin est entre tes mains : ${player[currentPlayer]}`;

console.log(currentPlayer);

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

const guessedLettersElement = document.querySelector(".guessed-letters");
const guessLetterButton = document.querySelector(".guess");
const letterInput = document.querySelector(".letter");
const wordInProgress = document.querySelector(".word-in-progress");
const remainingGuessesElement = document.querySelector(".remaining");
const remainingGuessesSpan = document.querySelector(".remaining span");
const message = document.querySelector(".message");
const playAgainButton = document.querySelector(".play-again");
const hintYesButton = document.querySelector(".hint-yes");
const hintOffer = document.querySelector(".hint-offer");
const hintNoButton = document.querySelector(".hint-no");
const hintRequestButton = document.querySelector(".hint-request");
const hintText = document.querySelector(".hint-text");


let word = "magnolia";
const guessedLetters = [];
let remainingGuesses = 10;
let wordBank = [];
let remainingEntries = [];
let currentHint = "";
let previousWord = "";

const getWord = async function () {
    if (wordBank.length === 0) {
  const response = await fetch("js/digital-flagship-word-bank.json");
  if (!response.ok) {
    throw new Error("The word bank could not be loaded.");
  }

    wordBank = await response.json();
  }
    if (remainingEntries.length === 0) {
        remainingEntries = [...wordBank];
    }


    let randomIndex = Math.floor(Math.random() * remainingEntries.length);
        if (
            remainingEntries.length > 1 &&
         remainingEntries[randomIndex].answer === previousWord
        ) {
        randomIndex = (randomIndex + 1) % remainingEntries.length;
    }

    const selectedEntry = remainingEntries.splice(randomIndex, 1)[0];
    word = selectedEntry.answer;
    currentHint = selectedEntry.hint;
    previousWord = word;
    placeholder(word);
};

getWord();


//Display symbols here as placeholders for chosen word's letters
const placeholder = function (word) {
  const placeholderLetters = [];
    for (const letter of word) {
        //console.log(letter);
        placeholderLetters.push("●");
    }
  wordInProgress.innerText = placeholderLetters.join("");
};

guessLetterButton.addEventListener("click", function (e) {
    e.preventDefault();
    // Empty message section
    message.innerText = "";
    const guess = letterInput.value;
    const goodGuess = validateInput(guess);

    if (goodGuess) {
        makeGuess (guess);
    }
    letterInput.value = "";
});

const validateInput = function (input) {
    const acceptedLetter = /[a-zA-Z]/;
    if (input.length === 0) {
        message.innerText = "Please enter a letter.";
    } else if (input.length > 1) {
        message.innerText = "Please enter a single letter.";
    } else if (!input.match(acceptedLetter)) {
        message.innerText = "Please enter a letter from A to Z.";
    } else {
        return input;
    }
};

const makeGuess = function (guess) {
    guess = guess.toUpperCase();
    if (guessedLetters.includes(guess)) {
        message.innerText = "For real, you already guessed that letter. Try again.";
    } else {
      guessedLetters.push(guess);
      console.log(guessedLetters);
      updateGuessRemaining(guess);
      showGuessedLetters();
      updateWordInProgress(guessedLetters);
      if (
        guessedLetters.length === 1 &&
        remainingGuesses > 0 &&
        wordInProgress.innerText !== word.toUpperCase()
) {
  hintOffer.classList.remove("hide");
}
  }
};
const showGuessedLetters = function () {
    guessedLettersElement.innerHTML = "";
    for (const letter of guessedLetters) {
        const li = document.createElement("li");
        li.innerText = letter;
        guessedLettersElement.append(li);
    }
};

const updateWordInProgress = function (guessedLetters) {
    const wordUpper = word.toUpperCase();
    const wordArray = wordUpper.split("");
    const revealWord = [];
    for (const letter of wordArray) {
        if (guessedLetters.includes(letter)) {
            revealWord.push(letter.toUpperCase());
        } else {
            revealWord.push("●");
        }
    }
    wordInProgress.innerText = revealWord.join("");
    checkIfWin();
};


const updateGuessRemaining = function (guess) {
    const upperWord = word.toUpperCase();
     if (!upperWord.includes(guess)) {
        message.innerText = `Dang, the word has no ${guess}.`;
        remainingGuesses -= 1;
        } else {
        message.innerText = `Good guess! The word has the letter ${guess}.`;
        }
    
     if (remainingGuesses === 0) {
            message.innerHTML = `Game over! The word was <span class="highlight">${word}</span>.`;
            startOver();
        } else if (remainingGuesses === 1) {
            remainingGuessesSpan.innerText = `${remainingGuesses} guess`;
        } else {
            remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
    }
};



const checkIfWin = function () {
    if (word.toUpperCase() === wordInProgress.innerText) {
        message.classList.add("win");
        message.innerHTML = `<p class="highlight">That's what's up! You guessed the correct word! Congrats!</p>`;

        startOver();
    }
};

const startOver = function () {
    guessLetterButton.classList.add("hide");
    remainingGuessesElement.classList.add("hide");
    guessedLettersElement.classList.add("hide");
    playAgainButton.classList.remove("hide");
    hintOffer.classList.add("hide");
    hintRequestButton.classList.add("hide");
    hintText.classList.add("hide");
};

playAgainButton.addEventListener("click", function () {
  message.classList.remove("win");
  guessedLetters.length = 0;
  remainingGuesses = 10;
  remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
  guessedLettersElement.innerHTML = "";
  message.innerText = "";
  hintOffer.classList.add("hide");
  hintRequestButton.classList.add("hide");
  hintRequestButton.innerText = "Get a hint";
  hintText.classList.add("hide");
  hintText.innerText = "";
  currentHint = "";
  letterInput.value = "";

   getWord();



    guessLetterButton.classList.remove("hide");
    playAgainButton.classList.add("hide");
    remainingGuessesElement.classList.remove("hide");
    guessedLettersElement.classList.remove("hide");
});

hintNoButton.addEventListener("click", function () {
  // Hide the hint offer.
  // Reveal the Get a hint button.
    hintOffer.classList.add("hide");
    hintRequestButton.classList.remove("hide");
});


const revealHint = function () {
  hintText.innerText = currentHint;
  hintText.classList.remove("hide");
  hintOffer.classList.add("hide");
  hintRequestButton.classList.remove("hide");
  hintRequestButton.innerText = "Hide hint";
};

hintYesButton.addEventListener("click", revealHint);
hintRequestButton.addEventListener("click", function () {
  if (hintText.classList.contains("hide")) {
    revealHint();
  } else {
    hintText.classList.add("hide");
    hintRequestButton.innerText = "Show hint again";
  }
});


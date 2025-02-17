/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
  const copy = [...src];

  const length = copy.length;
  for (let i = 0; i < length; i++) {
    const x = copy[i];
    const y = Math.floor(Math.random() * length);
    const z = copy[y];
    copy[i] = z;
    copy[y] = x;
  }

  if (typeof src === "string") {
    return copy.join("");
  }

  return copy;
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
// create an array for dessert word list
const dessertWords = [
  "mochi",
  "macaron",
  "tiramisu",
  "chocolate",
  "pudding",
  "brownie",
  "shortcake",
  "cookies",
  "doughnut",
  "gelato",
];

// *** main game component *** //
// use useState helps manage the state of words in the game
// load words from localStorage if available, otherwise, we start with an empty array
function App() {
  const [words, setWords] = React.useState(() => {
    const savedWords = localStorage.getItem("gameWords");
    return savedWords ? JSON.parse(savedWords) : [];
  });

  // stores the current word that the player needs to guess
  // stores the scrambled version of the current word and hold the player's input or guess
  const [currentWord, setCurrentWord] = React.useState("");
  const [scrambledWord, setScrambledWord] = React.useState("");
  const [guess, setGuess] = React.useState("");

  // for game stats, points = correct guesses, strikes = wrong guesses, passes = skip guesses
  // use useState with function to set the stage from localStorage if data exists, else set default values
  // started with 0 points, 0 strikes, and 3 passes
  const [points, setPoints] = React.useState(() => {
    const savedGameData = localStorage.getItem("gameData");
    const gameData = savedGameData ? JSON.parse(savedGameData) : { points: 0 };
    return gameData.points;
  });

  const [strikes, setStrikes] = React.useState(() => {
    const savedGameData = localStorage.getItem("gameData");
    const gameData = savedGameData ? JSON.parse(savedGameData) : { strikes: 0 };
    return gameData.strikes;
  });

  const [passes, setPasses] = React.useState(() => {
    const savedGameData = localStorage.getItem("gameData");
    const gameData = savedGameData ? JSON.parse(savedGameData) : { passes: 3 };
    return gameData.passes;
  });

  // message to display to the player and check if the game is over
  const [message, setMessage] = React.useState("");
  const [gameOver, setGameOver] = React.useState(false);

  // use useEffect to save game progress in localStorage
  React.useEffect(() => {
    localStorage.setItem("points", points);
    localStorage.setItem("strikes", strikes);
    localStorage.setItem("passes", passes);
    localStorage.setItem("gameWords", JSON.stringify(words));
  }, [points, strikes, passes, words]);

  // use useEffect to start a new game when the component first loads
  React.useEffect(() => {
    startNewGame();
  }, []);

  // function to start or reset the game
  // shuffle the words first, set the current word, scrambled word, and reset the game stats
  const startNewGame = () => {
    const shuffledWords = shuffle(dessertWords);
    setWords(shuffledWords);
    setCurrentWord(shuffledWords[0]);
    setScrambledWord(shuffle(shuffledWords[0]));

    // reset all game stats in both state and localStorage
    localStorage.removeItem("points");
    localStorage.removeItem("strikes");
    localStorage.removeItem("passes");
    localStorage.removeItem("gameWords");
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setGameOver(false);
    setMessage("");
  };

  // when the player submits a guess
  // first, prevent page refresh with e.preventDefault()
  const proceedGuess = (e) => {
    console.log(
      `Current Points: ${points}, Current Strikes: ${strikes}, Current Passes: ${passes}`
    );

    e.preventDefault();

    // check if the guess is correct or not, if correct, increase points and move to the next word
    // if not, increase strikes and check if the game is over
    if (guess.toLowerCase() === currentWord) {
      setPoints((prev) => prev + 1);
      setMessage(" ✅ Correct! Let's move on to next one! 🥳");
      moveToNextWord();
    } else {
      setStrikes((prev) => prev + 1);
      setMessage("❌ Wrong! Try again.");
      if (strikes + 1 >= 3) {
        setGameOver(true);
      }
    }
    setGuess("");
  };

  // move to next word and end game if no words are left
  const moveToNextWord = () => {
    const remainingWords = words.filter((word) => word !== currentWord);

    if (remainingWords.length === 0) {
      setGameOver(true);
      return;
    }

    const nextWord = remainingWords[0];
    setWords(remainingWords);
    setCurrentWord(nextWord);
    setScrambledWord(shuffle(nextWord));
  };

  // pass part - allows player to skip a word clicking the pass button
  const proceedPass = () => {
    if (passes > 0) {
      setPasses((prev) => prev - 1);
      moveToNextWord();
      setMessage("👀 Word passed 👀");
    } else {
      // a message when pass limit is reached
      setMessage("🚨 You've already used all your passes❗❗❗");
    }
  };

  return (
    <div className="game-container">
      {!gameOver ? (
        <>
          <div className="game-stats">
            <div>Points: {points}</div>
            <div>Strikes: {strikes}/3</div>
            <div>Passes: {passes}</div>
          </div>

          <div className="scrambled-word">{scrambledWord}</div>

          <form onSubmit={proceedGuess}>
            <div className="input-container">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Unscramble the dessert"
              />
              <button type="submit">Guess</button>
              <button type="button" onClick={proceedPass}>
                Pass
              </button>
            </div>
          </form>

          {message && <div className="message">{message}</div>}
        </>
      ) : (
        <div>
          <h2>
            {points === dessertWords.length ? "🌟 You Won! 🌟" : "🤪 Game Over"}
          </h2>
          <p>Your Score: {points}</p>
          <button onClick={startNewGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

// render the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

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
// create an array for my dessert list
const desserts = [
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

// the main game component
function App() {
  // load the word list from localStorage if its there, otherwise start with an empty array
  let saved = localStorage.getItem("words") || "[]";
  const [words, setWords] = React.useState(JSON.parse(saved));

  // word stuff - current one, mixed up version, and the guess
  const [current, setCurrent] = React.useState("");
  const [jumbled, setJumbled] = React.useState("");
  const [guess, setGuess] = React.useState("");

  // game stats from localStorage or set defaults
  let stats = JSON.parse(
    localStorage.getItem("stats") || '{"points":0,"wrong":0,"skips":3}'
  );
  const [points, setPoints] = React.useState(stats.points);
  const [wrong, setWrong] = React.useState(stats.wrong);
  const [skips, setSkips] = React.useState(stats.skips);

  // hold messages for the player and flag if the game is over
  const [msg, setMsg] = React.useState("");
  const [over, setOver] = React.useState(false);

  // save progress to localStorage when it changes
  React.useEffect(() => {
    localStorage.setItem("stats", JSON.stringify({ points, wrong, skips }));
    localStorage.setItem("words", JSON.stringify(words));
  }, [points, wrong, skips, words]);

  // start the game on load
  React.useEffect(() => {
    newGame();
  }, []);

  // reset everything for a new game (full shuffled list, current word, mixed up word, points, wrong guesses, skips, and game over flag)
  function newGame() {
    let mixedDesserts = shuffle(desserts);
    setWords(mixedDesserts);
    setCurrent(mixedDesserts[0]);
    setJumbled(shuffle(mixedDesserts[0]));
    setPoints(0);
    setWrong(0);
    setSkips(3);
    setOver(false);
    setMsg("Guess the dessert word!");
    localStorage.clear();
  }

  // handle player’s guess, check if it is right and update accordingly
  function handleGuess(e) {
    // stop the page from submitting
    e.preventDefault();
    if (guess.toLowerCase() == current) {
      setPoints(points + 1);
      setMsg("Got it! Next one...");
      nextWord();
    } else {
      setWrong(wrong + 1);
      setMsg("Nah, try again.");
      if (wrong + 1 >= 3) setOver(true);
    }
    setGuess("");
  }

  // go to the next word, end if game over
  function nextWord() {
    let left = words.filter((w) => w != current);
    if (!left.length) {
      setOver(true);
      return;
    }
    setWords(left);
    setCurrent(left[0]);
    setJumbled(shuffle(left[0]));
  }

  // skip the current word if player has passes left
  function skipWord() {
    if (skips > 0) {
      setSkips(skips - 1);
      setMsg("Skipped it.");
      nextWord();
    } else {
      setMsg("Out of skips!");
    }
  }

  return (
    <div className="game-container">
      {over ? (
        <div>
          <h2>{points == desserts.length ? "You Won !!" : "Game over :("}</h2>
          <p>Your Score: {points}</p>
          <button onClick={newGame}>Play Again</button>
        </div>
      ) : (
        <div>
          <div className="game-stats">
            <div>Points: {points}</div>
            <div>Strikes: {wrong}/3</div>
            <div>Passes: {skips}</div>
          </div>
          <div className="scrambled-word">{jumbled}</div>
          <form onSubmit={handleGuess}>
            <div className="input-container">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Unscramble the dessert"
              />
              <button type="submit">Guess</button>
              <button type="button" onClick={skipWord} disabled={skips === 0}>
                Pass
              </button>
            </div>
          </form>
          {msg && <div className="message">{msg}</div>}
        </div>
      )}
    </div>
  );
}

// render the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

/*
 * Create a list that holds all of your cards
 */
const cardsList = ["diamond", "diamond", "paper-plane-o", "paper-plane-o",
    "anchor", "anchor", "bolt", "bolt",
    "cube", "cube", "leaf", "leaf",
    "bicycle", "bicycle", "bomb", "bomb"];

var toCompare = [];
var remainingMatches;
var moveCounter;
var moveDisplay = document.getElementsByClassName("moves")[0];
var maxStars = 3;
var startTime;
var timer;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
gameSetup();

function gameSetup() {
    // Reset how many matches there are to find, move counter, and timer
    remainingMatches = cardsList.length / 2;
    moveCounter = 0;
    moveDisplay.innerHTML = "0";
    renderStars();
    toCompare = [];

    // Shuffle the cards and create the base ul for the deck display
    var shuffledCards = shuffle(cardsList);
    var deck = document.createElement("ul");
    deck.className = "deck";

    // Map over the shuffled cards to create each and add to the ul
    shuffledCards.map(card => {
        var cardElem = document.createElement("li");
        cardElem.classList = "card";
        var i = document.createElement("i");
        i.classList = `fa fa-${card}`;
        cardElem.appendChild(i);

        // Set the listener for each card when clicked
        cardElem.onclick = (e => {
            // Make sure this card isn't already in the toCompare list
            if (toCompare.filter(item => item === e.target).length > 0) return;

            // Make sure we aren't already comparing two cards
            if (toCompare.length == 2) return;

            // Push the card into the compare list and show it
            toCompare.push(e.target);
            e.target.className = "card open show";
            compareCards();
        })
        // Put the card in the deck display
        var node = document.getElementById("deckHolder");
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
        deck.appendChild(cardElem);
    });

    // Clear any old deck and add new deck

    document.getElementById("deckHolder").appendChild(deck);

    // Start the timer
    startTime = Date.now();
    displayTimer();
    timer = window.setInterval(() => {
        // Display the elapsed time
        displayTimer(Date.now());
    }, 1000);
}

function convertToTimeString(duration) {
    // Conversion function from https://coderwall.com/p/wkdefg/converting-milliseconds-to-hh-mm-ss-mmm
    // with some modification to account for NaN when timer first start (added || 0)
    var milliseconds = parseInt((duration % 1000) / 100)
        , seconds = parseInt((duration / 1000) % 60) || 0
        , minutes = parseInt((duration / (1000 * 60)) % 60) || 0
        , hours = parseInt((duration / (1000 * 60 * 60)) % 24) || 0;

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}

function displayTimer(currentTime) {
    var timerDisplay = convertToTimeString(currentTime - startTime);

    document.getElementsByClassName("timer")[0].innerHTML = timerDisplay;

}

function compareCards() {
    // If two cards haven't been selected then there's nothing to compare
    if (toCompare.length < 2) return;

    // Increment move count
    moveCounter++;
    moveDisplay.innerHTML = moveCounter;
    renderStars();

    // Check for matches
    if (toCompare[0].firstChild.className === toCompare[1].firstChild.className) {
        // If there's a match then don't listen for clicks any more
        toCompare[0].onclick = null;
        toCompare[1].onclick = null;
        // Set the style to matched
        toCompare[0].className = "card match";
        toCompare[1].className = "card match";
        // Decrement the remaining matches counter
        remainingMatches--;
        console.log("remainingMatches: ", remainingMatches);
        toCompare = [];

        // Check if all the matches have been made
        if (!remainingMatches) {
            // Stop the timer
            window.clearInterval(timer);
            // Get the end time
            endTime = Date.now();
            // Display congratulations
            window.setTimeout(() => {
                var filledStars = maxStars - ((moveCounter - 16) / 3);
                if (filledStars > 3) filledStars = 3;
                displayCongratulations(moveCounter, filledStars, convertToTimeString(endTime - startTime));
            })
        }
    } else {
        // Not a match, so leave the cards flipped for a second
        window.setTimeout(() => {
            toCompare[0].className = "card";
            toCompare[1].className = "card";
            toCompare = [];
        }, 1000)
    }
}

function renderStars() {
    // Calculate how many filled stars should display
    var filledStars = maxStars - ((moveCounter - 16) / 3);

    // Create the star display
    starList = document.createElement("ul");
    starList.className = "stars";

    for (var i = 0; i < 3; i++) {
        var star = document.createElement("li");
        var type = document.createElement("i");
        star.appendChild(type);
        if (i < filledStars) {
            type.className = "fa fa-star";
        } else {
            type.className = "fa fa-star-o";
        }

        starList.appendChild(star);
    }

    // Remove existing star display and replace with new
    var node = document.getElementById("starHolder");
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
    node.appendChild(starList);
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function displayCongratulations(moves, stars, time) {
    // Display a congratulations message using a confirmation, which will allow the
    // player to start a new game.
    message = `Congratulations! You finished the game in ${time}, using ${moves} moves. That's a ${stars} stars rating. Play again?`;
    window.confirm(message) ? gameSetup() : null;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

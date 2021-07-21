//--------------------------------------- THE GREAT RGB GUESSING GAME ---------------------------------------
// Code written by Josh Berkman -- With some help from Stack Overflow
//--------------------------------- MENU VARIABLES ---------------------------------
//Get menu container
let menuCntr = document.getElementById("Menu-Cntr");
//Get difficulty options
let difficultyElements = document.querySelectorAll(".difficulty");
//--------------------------------- GAME VARIABLES ---------------------------------
//Get game container
let gameCntr = document.getElementById("Game-Cntr");
//Get the menu button
let menuBtn = document.getElementById("Menu-Btn");
//Get all possible selections
let selections = document.querySelectorAll(".selection");
//Get the colors of possible selections
let colors = document.querySelectorAll(".color");
//Get text that will show the RGB value to guess
let rgbText = document.getElementById("RGB");
//Array to hold RGB values
let rgbArray = [];
//Declare for later; Use to decide which rgb value in the array
//will be the winning value
let correctAnswer;
//Declare for later; How many values are there to choose from
let difficulty;         //3, 6, or 9
//Get the wins scoreboard element
let winsElement = document.getElementById("Wins");
//Get the losses scoreboard element
let lossesElement = document.getElementById("Losses");
//Wins value
let wins = 0;
//Losses value
let losses = 0;


//------------------------------------------- MENU -------------------------------------------
//Difficulty buttons
for (let i = 0; i < 3; i++) {
    //Listen for a difficulty button
    difficultyElements[i].addEventListener("click", function() {
        //Set the game's difficulty
        if (i === 0) {
            //3 Selection
            difficulty = 3;
        }
        else if (i === 1) {
            //6 Selections
            difficulty = 6;
        }
        else {
            //9 Selections
            difficulty = 9;
        }

        //Set scoreboard text on load
        winsElement.innerText = wins;
        lossesElement.innerText = losses;

        //How many selections are needed based on difficulty
        showSelections();

        //Switch to the game board
        menuCntr.classList.add("hide-menu");
        gameCntr.classList.remove("hide-game");

        //Start the game
        startGame();
    });
}

//Return to menu button
menuBtn.addEventListener("click", function() {
    //End current game
    endGame();
    //Go back to the menu
    backToMenu();
});




//------------------------------------------- GAME -------------------------------------------
//Store each event listener for the color selections
//so they can be later removed
const selectionEvents = new WeakMap();

//Start the game by setting up the event listeners
//and what happens when a user clicks
function startGame() {
    //Get and set the colors
    getColors();
    setColors();

    for (let i = 0; i < difficulty; i++) {
        const clickEvent = function() {
            //Pause clicking
            pauseClicking();

            //Show selected answer's background
            colors[i].classList.add("color-sm");
            
            //How fast before reseting board
            let timer;

            //Reveal all the other answers if answer is incorrect
            if (i !== correctAnswer) {
                //Update loss score
                losses++;

                //2 seconds before reseting
                timer = 2000;

                //Wait half a second before revealing the correct answer
                let reveal = setInterval(function() {
                    //Show the correct answer's background
                    colors[correctAnswer].classList.add("color-sm");

                    //Hide all the incorrect answers except the one selected
                    for (let j = 0; j < difficulty; j++) {
                        if (j !== correctAnswer && j !== i) {
                            selections[j].classList.add("selection-hide");
                        }
                    }

                    //Close loop
                    clearInterval(reveal);
                }, 500);
            }
            else {
                //Update win score
                wins++;

                //1 second before reseting
                timer = 1000;
            }

            //Update the scoreboard
            updateScore();

            //Reset the board
            let reset = setInterval(function() {
                //Get rid of shrinking classes
                colors.forEach(element => {
                    element.classList.remove("color-sm");
                });

                //Reapply load animation
                selections.forEach(element => {
                    //Cancle event if cancelable
                    //Not sure if this is needed or not...
                    element.preventDefault;
                    //Remove load animation class
                    element.classList.remove("load-animation");
                    //Weird magic command that allows CSS animation to restart
                    void element.offsetWidth;
                    //Remove hidden selections
                    element.classList.remove("selection-hide");
                    //Reapply the load animation class
                    element.classList.add("load-animation");
                });

                //Reset the colors
                getColors();
                setColors();

                //Allow clicking again
                resumeClicking();

                //Close loop
                clearInterval(reset);
            }, timer);
        }
        //Add and store click event
        selections[i].addEventListener("click", clickEvent);
        selectionEvents.set(selections[i], clickEvent);
    }
}

//Remove those event listeners so when a player goes
//back to the menu those listeners aren't still active
function endGame() {
    selections.forEach(element => {
        const clickEvent = selectionEvents.get(element);
        if (clickEvent) {
            selectionEvents.delete(element);
            element.removeEventListener("click", clickEvent);
        }
        //Reapply hidden selection class
        //so the game completely resets
        element.classList.add("hide-selection");
    });
    //Reset the score
    resetScore();
}

//Show the selections that will be needed for a given difficulty
function showSelections() {
    for (let i = 0; i < difficulty; i++) {
        selections[i].classList.remove("hide-selection");
    }
}

//Randomly generate predetermined amount of colors
function getColors() {
    //Empty array just in case
    rgbArray = [];

    //Add 3, 6, or 9 colors to an array
    for (let i = 0; i < difficulty; i++) {
        //Get individual color values
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);

        //Create a string
        let rgb = "rgb(" + r + ", " + g + ", " + b + ")";

        //Add rgb value to array
        rgbArray.push(rgb);
    }
}

//Set up the game board
function setColors() {
    //Set the colors' icons
    for (let i = 0; i < difficulty; i++) {
        colors[i].style.backgroundColor = rgbArray[i];
    }

    //Which rgb value will be the correct answer?
    correctAnswer = Math.floor(Math.random() * difficulty);

    //Reset correct/wrong answer backgrounds
    selections.forEach(element => {
        element.classList.remove("selection-green");
        element.classList.remove("selection-red");
    });

    //Set correct/wrong answer backgrounds
    for (let i = 0; i < difficulty; i++) {
        //Make selection background green
        if (i === correctAnswer) {
            selections[i].classList.add("selection-green");
        }
        //Make selection background red
        else {
            selections[i].classList.add("selection-red");
        }
    }

    //Tell user the rgb value to find
    rgbText.innerText = rgbArray[correctAnswer].toUpperCase();
}

//Prevent player from clicking when they shouldn't
function pauseClicking() {
    selections.forEach(element => {
        element.classList.add("no-click");
    });
}

//Allow the player to click again
function resumeClicking() {
    selections.forEach(element => {
        element.classList.remove("no-click");
    });
}

//Update the scoreboard
function updateScore() {
    winsElement.innerText = wins;
    lossesElement.innerText = losses;
}

//Reset the score when the user goes back to the menu
function resetScore() {
    wins = 0;
    losses = 0;
    winsElement.innerText = wins;
    lossesElement.innerText = losses;
}

//Go back to the menu
function backToMenu() {
    //Switch back to the menu
    menuCntr.classList.remove("hide-menu");
    gameCntr.classList.add("hide-game");
}


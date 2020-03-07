# ![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png) Project 1: Frogger

This is a version of the game Frogger which I made during the Software Engineering Immersive course. The time frame to create the game was 9 days. 

## Built with
* HTML5
* CSS3
* Vanilla JavaScript (ES6)
* Git
* GitHub

## Deployment
The game is deployed on GitHub Pages and can be found [here](https://didemertens.github.io/sei-project-1/).

## Getting started
Clone or download the repo. Then open the `index.html` file in your browser to play the game. It should work in all browsers, including Chrome, Firefox, Safari and Opera.

## Game architecture
The goal of this version of Frogger is to get all of the witches to their cauldrons at the other side of the board. There are obstacles to avoid, the birds and winged horses, and others that you have to hitch a ride with, the clouds and rainbows.  

The player uses the arrow keys to move the witches. There are 3 difficulty levels, which changes the total amount of lives to 5, 3 or 1. At the end, the user can save their score and a list of the top 10 scores is shown, which uses local storage.

<img src="/assets/frogger-scr-1.png" alt="Frogger game play screenshot" height="400"/> <img src="/assets/frogger-scr-2.png" alt="Frogger game play screenshot" height="400"/>

### Win condition
If the player gets all of the witches to their cauldrons, the game ends and the player wins. The score screen is displayed and the player can save their score.

### Lose conditions
If the player has no lives left and not all of the witches are at their cauldrons, the player loses. The score screen will be displayed and the player will still be able to save their score.


## Challenges and future improvements
* Making the obstacles move as smooth as possible, using CSS animations and JavaScript. Because the game is built with a grid, the index of the obstacles is updated slightly after the animation. If for example a player hits an obstacle, the index wouldn’t be the right one yet. I fixed this by using timeouts for checking if the player was hit or not, but this means that to have the best game experience, you have to wait for a short time to see if you’re dead or not after each step.

* The player image changes, depending on which way the player moves. This is done by changing and checking the player image and the background image each time an arrow key is pressed. However, when you move the player really fast, it doesn't remove the witch from the background because the index has already been changed.

* Instead of showing the result and ranking inside the existing grid, I want to make a new grid and hide that at first (same as with the start screen). That way, it isn't necessary to create all of the HTML elements in JS.
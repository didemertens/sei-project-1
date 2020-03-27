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
<img src="/assets/frogger-scr-1.png" alt="Frogger game play screenshot" height="400"/> <img src="/assets/frogger-scr-2.png" alt="Frogger game play screenshot" height="400"/>

The goal of this version of Frogger is to get all of the witches to their cauldrons at the other side of the board. There are obstacles to avoid, the birds and winged horses, and others that you have to hitch a ride with, the clouds and rainbows.  

The player uses the arrow keys to move the witches. I wanted the image of the witch to change depending on the arrow keys. For example, if the witch moved to the right I wanted her image to face the right as well. I did this by setting the correct image of the witch on the correct background image, as can be seen here for the right arrow key:

```
 switch (e.keyCode) {
      case 39:
        if (playerIndex % width < width - 1) playerIndex++
        setBackgroundImg()
        squares[playerIndex].style.backgroundImage = `url(assets/witch-right.png), url(assets/${backImg})`
        break
      ...
```

I needed the background image as well, because there are different background images on the board. To show the correct background image behind the witch each time, I made a function that sets the correct image. I first grab the relevant square and then use currentStyle or getComputedStyle to get the image in the correct format. I then needed to slice a lot of data from the image as I only needed a particular part.

```
 function setBackgroundImg() {
    const img = squares[playerIndex]
    const squareImg = img.currentStyle || window.getComputedStyle(img, false).backgroundImage.slice(4, -1).replace(/"/g, '')
    const squareSlash = squareImg.slice('').lastIndexOf('/')
    backImg = squareImg.slice(squareSlash + 1)
  }
```


There are 3 difficulty levels, which changes the total amount of lives to 5, 3 or 1 for the game. At the end, the user can save their score by typing in their initials and a list of the top 10 scores is shown, which uses local storage.

### Win condition
If the player gets all of the witches to their cauldrons, the game ends and the player wins. The score screen is displayed and the player can save their score.

### Lose conditions
If the player has no lives left and not all of the witches are at their cauldrons, the player loses. The score screen will be displayed and the player will still be able to save their score.

## Wins and challenges
* It was amazing to be able to actually play a game I made myself. I learned a lot about using timeouts and intervals as well as connecting these all together so the game runs in the correct order. 

* The player image changes, depending on which way the player moves. This was both a win and a challenge. I managed to actually change the image as well as get the correct background image each time an arrow key is pressed. However, when you move the player really fast (by holding in the same key), there is a slight delay and it doesn't remove the witch from the background because the index has already been changed.

* It was very difficult to get the obstacles to move as smooth as possible using CSS animations and JavaScript. Because the game is built with a grid, the index of the obstacles is updated slightly after the animation. If for example a player hits an obstacle, the index wouldn’t be the right one yet. I fixed this by using timeouts for checking if the player was hit or not, but this means that to have the best game experience, you have to wait for a short time to see if you’re dead or not after each step.

## Future improvements
* Instead of showing the result and ranking inside the existing grid, I want to make a new grid and hide that at first (which I did do for the start screen). That way, it isn't necessary to create all of the HTML elements in JS.

* I would like to make it possible to also play this game on a phone. Because the witches are moved using the arrow keys, it doesn't work when you're on a device without those keys. I want to add for example the keys on the screen so people can use that to play.
# Frogger Game
This a version of the game Frogger created with HTML, CSS and JavaScript. 

## Game play
The goal is to get all 5 witches to their cauldrons, avoiding the birds and winged horses. After those obstacles, the player needs to hitch a ride with a cloud or rainbow. There are 3 difficulty levels, which changes the total amount of lives (5, 3 or 1) at the beginning of a game. At the end, the user can save their score and a ranking top 10 is shown, which uses local storage.  
Play it [here](https://didemertens.github.io/sei-project-1/).

## Future improvements
* Add tests to find bugs.
* When you click really fast as the player, it doesn't remove the witch from the background because the index has already been changed.
* Instead of showing the result and ranking inside the existing grid, make a new grid and hide that at first (same as with start screen). That way, it isn't necessary to create all of the HTML elements in JS.

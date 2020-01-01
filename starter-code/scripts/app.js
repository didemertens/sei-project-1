// * Frogger
// Add a start button to play game, variable gamePlaying = true
// Add event listeners to arrow keys
// Make game board
// Place player
// Add obstacles, like cars
// Move obstacles

// Check if player has hit an obstacle
// Yes, remove 1 life
// if lives = 0, stop game and remove keydown event listener

// Get all 5 frogs home
// Timer for getting the frogs home? 
// Every step, get 10 points
// Every frog home, get 50 points
// All 5 frogs home, get 1000 points

function init() {
  // DOM variables
  const grid = document.querySelector('.grid')
  const start = document.querySelector('.start')
  const lifeDisplay = document.querySelector('#playerLives')

  // game variables
  const width = 7
  const height = 11
  const squares = []
  const car = [50]
  let playerLives = 5
  let gamePlaying = false
  let playerIndex = width * height - 4


  // Functions
  function playGame() {
    if (!gamePlaying) {
      gamePlaying = true
      createBoard()
      addPlayer()
      addCars()
    }
  }

  function createBoard() {
    Array(width * height).join('.').split('.').forEach(() => {
      const square = document.createElement('div')
      square.classList.add('grid-item')
      squares.push(square)
      grid.appendChild(square)
    })
  }

  function addCars() {
    squares[car].classList.add('car')
  }

  function handleKeyDown(e) {
    // ! console.log(playerIndex)
    switch (e.keyCode) {
      case 39:
        if (playerIndex % width < width - 1) playerIndex++
        break
      case 37:
        if (playerIndex % width > 0) playerIndex--
        break
      case 38:
        if (playerIndex - width >= 0) playerIndex -= width
        break
      case 40:
        if (playerIndex + width < width * height) playerIndex += width
        break
    }
    addPlayer()
  }

  function addPlayer() {
    squares.forEach(square => square.classList.remove('player'))
    squares[playerIndex].classList.add('player')
    playerDead()
  }

  function playerDead() {
    if (car.includes(playerIndex)) {
      if (playerLives > 1) {
        playerLives -= 1
        lifeDisplay.innerHTML = playerLives
      } else {
        playerLives -= 1
        lifeDisplay.innerHTML = playerLives
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }
  // Event listeners
  window.addEventListener('keydown', handleKeyDown)
  start.addEventListener('click', playGame)

  // ! DELETE LATER
  playGame()
}

window.addEventListener('DOMContentLoaded', init)
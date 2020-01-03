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

// Get frog to specific place on board

// Get all 5 frogs home
// Add a loop using player lives, running 5 times and then stop game

/////////////

// Every step, get 10 points
// Every frog home, get 50 points
// All 5 frogs home, get 1000 points
// Show result + score

// Timer for getting the frogs home? 

function init() {
  // DOM variables
  const grid = document.querySelector('.grid')
  const start = document.querySelector('.start')
  const lifeDisplay = document.querySelector('#player-lives')
  const scoreDisplay = document.querySelector('#player-score')

  // game variables
  // board
  const width = 9
  const height = 11

  let homes = [8, 6, 4, 2, 0]
  let squares = []
  let carsRight = [80]
  let carsLeft = [81]
  let gamePlaying = false
  let carInterval = null
  let timeOutCars = null

  let playerIndex = width * height - 5
  let playerLives = 5
  let frogFamily = 5
  let frogsHome = 0
  let playerScore = 0

  // Functions
  function playGame() {
    if (!gamePlaying) {
      // Make game playable
      gamePlaying = true
      window.addEventListener('keydown', handleKeyDown)

      // Show reset button
      start.removeEventListener('click', playGame)
      start.addEventListener('click', resetGame)
      start.innerHTML = 'Reset'

      // Set up board
      createBoard()
      createHomes()
      addPlayer()
      carInterval = setInterval(moveCars, 1000)
    }
  }

  // *********** GAME BOARD

  function createBoard() {
    Array(width * height).join('.').split('.').forEach(() => {
      const square = document.createElement('div')
      square.classList.add('grid-item')
      squares.push(square)
      grid.appendChild(square)
    })
  }

  function createHomes() {
    homes.forEach(home => squares[home].classList.add('homes'))
  }


  // *********** CARS

  function createCars() {
    if (carsRight.length < 2) {
      const newCar = 80
      carsRight.push(newCar)
    }
    if (carsLeft.length < 2) {
      const newCar = 81
      carsLeft.push(newCar)
    }
  }

  function displayCars() {
    squares.forEach(square => square.classList.remove('car'))
    carsRight.forEach(car => squares[car].classList.add('car'))
    carsLeft.forEach(car => squares[car].classList.add('car'))
  }

  function moveCars() {
    carsRight = carsRight.map(car => {
      if (car < 89) {
        return car += 1
      } else if (car === 89) {
        return car = 81
      }
    })
    carsLeft = carsLeft.map(car => {
      if (car > 72) {
        return car -= 1
      } else if (car === 72) {
        return car = 79
      }
    })
    playerLost()
    displayCars()
    timeOutCars = setTimeout(createCars, 1000)
  }

  // *********** MOVE PLAYER

  function handleKeyDown(e) {
    // console.log(playerIndex)
    switch (e.keyCode) {
      case 39:
        if (playerIndex % width < width - 1) playerIndex++
        break
      case 37:
        if (playerIndex % width > 0) playerIndex--
        break
      case 38:
        if (playerIndex - width >= 0) {
          playerIndex -= width
          addPoints(10)
        }
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
    playerWon()
    playerLost()
  }

  // *********** SHOW/UPDATE SCORE
  function addPoints(points) {
    playerScore += points
    displayScore()
  }

  function displayScore() {
    scoreDisplay.innerHTML = playerScore
  }


  // *********** CHECK WON/LOST

  function playerWon() {
    if (homes.includes(playerIndex)) {
      addPoints(50)
      frogsHome += 1
      frogFamily -= 1
      squares[playerIndex].classList.remove('homes')
      squares[playerIndex].classList.add('player-won')

      homes.forEach(home => {
        if (home === playerIndex) {
          homes.splice(homes.indexOf(home), 1)
        }
      })

      if (frogFamily > 1 && frogsHome !== 5) {
        resetPlayer()
      } else if (frogsHome < 5 && playerLives > 1) {
        frogFamily += playerLives
        resetPlayer()
      } else {
        addPoints(1000)
        stopGame()
      }
    }
  }

  function playerLost() {
    if (carsRight.includes(playerIndex) || carsLeft.includes(playerIndex)) {
      if (playerLives > 1) {
        playerScore -= 10
        displayScore()
        playerLives -= 1
        lifeDisplay.innerHTML = playerLives
        resetPlayer()
      } else {
        playerLives -= 1
        lifeDisplay.innerHTML = playerLives
        stopGame()
      }
    } else if (squares[playerIndex].classList.contains('player-won')) {
      if (playerLives > 1 && frogsHome !== 5) {
        playerScore -= 10
        displayScore()
        playerLives -= 1
        lifeDisplay.innerHTML = playerLives
        resetPlayer()
      } else {
        playerLives -= 1
        lifeDisplay.innerHTML = playerLives
        stopGame()
      }
    }
  }

  function resetPlayer() {
    playerIndex = width * height - 5
    squares.forEach(square => square.classList.remove('player'))
    squares[playerIndex].classList.add('player')
  }

  // *********** STOP/RESET GAME

  function stopGame() {
    gamePlaying = false
    clearInterval(carInterval)
    clearTimeout(timeOutCars)
    window.removeEventListener('keydown', handleKeyDown)
  }

  function resetGame() {
    stopGame()
    // Remove board
    squares.forEach(square => grid.removeChild(square))
    // Reset variables
    homes = [8, 6, 4, 2, 0]
    squares = []
    carsRight = [80]
    playerLives = 5
    frogFamily = 5
    frogsHome = 0
    playerIndex = width * height - 5
    carInterval = null
    timeOutCars = null
    // Show start button again
    start.removeEventListener('click', resetGame)
    start.addEventListener('click', playGame)
    start.innerHTML = 'Start'
  }

  // Event listeners
  start.addEventListener('click', playGame)

  // ! DELETE LATER
  playGame()
}

window.addEventListener('DOMContentLoaded', init)
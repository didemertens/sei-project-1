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

// Every step, get 10 points
// Every frog home, get 50 points
// All 5 frogs home, get 1000 points

// Show result + score
////////
// Add water, move with logs etc.
// Add animation when player dies

// Add highscore with local storage
// Timer for getting the frogs home? 

function init() {
  // DOM variables
  const grid = document.querySelector('.grid')
  const start = document.querySelector('.start')
  const lifeDisplay = document.querySelector('#player-lives')
  const scoreDisplay = document.querySelector('#player-score')

  // game variables
  let gamePlaying = false
  let resultGame = ''
  // board
  const width = 9
  const height = 11
  let squares = []
  let homes = [8, 6, 4, 2, 0]
  // cars
  let carsRight = [80, 84]
  let carsLeft = [76, 78, 81]
  // water
  let waterSquaresRight = [8, 9, 10, 13, 14, 15, 16, 20, 21, 22, 23]
  let waterSquaresLeft = [30, 31, 34, 35, 36, 37, 38, 42, 43, 44]
  // let carAmount = 0
  let moveCarInterval = null
  let addingCarsTimeOut = null
  // let counterCarsAdded = 0
  // player
  let playerIndex = width * height - 5
  let playerLives = 5
  let frogFamily = 5
  let frogsHome = 0
  let playerScore = 0
  let gameWon = false
  let gameLost = false


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
      moveCarInterval = setInterval(moveCars, 900)
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

  function moveCars() {
    carsRight = carsRight.reduce((newCars, car) => {
      if (car < 89) {
        car += 1
        newCars.push(car)
      } else if (car === 89) {
        newCars.splice(carsRight.indexOf(car), 1)
        setTimeout(() => {
          createCar('right')
        }, 1000)
      }
      return newCars
    }, [])

    carsLeft = carsLeft.reduce((newCars, car) => {
      if (car > 72) {
        car -= 1
        newCars.push(car)
      } else if (car === 72) {
        newCars.splice(carsLeft.indexOf(car), 1)
        setTimeout(() => {
          createCar('left')
        }, 1000)
      }
      return newCars
    }, [])


    playerLost()
    displayCars()
  }

  function displayCars() {
    squares.forEach(square => square.classList.remove('car'))
    carsRight.forEach(car => squares[car].classList.add('car'))
    carsLeft.forEach(car => squares[car].classList.add('car'))
  }

  function createCar(direction) {
    if (direction === 'right') {
      const newCar = 81
      carsRight.unshift(newCar)
    } else {
      const newCar = 80
      carsLeft.push(newCar)
    }

    displayCars()
  }

  // function loopAddCars() {
  //   if (counterCarsAdded < 3) {
  //     counterCarsAdded++
  //     addingCarsTimeOut = setTimeout(() => {
  //       createCars()
  //       loopAddCars()
  //     }, 1500)
  //   }
  // }

  // function createCars() {
  //   if (carsRight.length < 2) {
  //     const newCar = 80
  //     carsRight.push(newCar)
  //   }

  //   if (carsLeft.length >= carAmount && carAmount <= 3) {
  //     if (carAmount % 2 === 0) {
  //       const newCar = 81
  //       carsLeft.push(newCar)
  //     }
  //     carAmount++
  //   }
  // }


  // *********** WATER/LOGS

  function displayWater() {
    // waterSquares = Array.from({ length: 3 * width }, (v, i) => i + width)
    squares.forEach(square => square.classList.remove('water'))
    waterSquaresRight.forEach(water => squares[water].classList.add('water'))
    waterSquaresLeft.forEach(water => squares[water].classList.add('water'))

  }


  function moveWater() {
    waterSquaresRight = waterSquaresRight.reduce((newWater, water) => {
      if (water < 26) {
        water += 1
        newWater.push(water)
      } else if (water === 26) {
        water = 9
        newWater.push(water)
      }

      // newCars.splice(carsRight.indexOf(car), 1)
      // setTimeout(() => {
      //   createCar('right')
      // }, 1000)
      return newWater
    }, [])

    waterSquaresLeft = waterSquaresLeft.reduce((newWater, water) => {
      if (water > 27) {
        water -= 1
        newWater.push(water)
      } else if (water === 27) {
        water = 44
        newWater.push(water)
      }
      return newWater
    }, [])

    // playerLost()
    displayWater()
  }

  // *********** MOVE PLAYER

  function handleKeyDown(e) {
    console.log(playerIndex)
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


  function showResult() {
    squares.forEach(square => grid.removeChild(square))
    resultGame = document.createElement('h3')
    resultGame.classList.add('result-game')
    grid.appendChild(resultGame)
    grid.style.backgroundColor = 'black'
    if (gameWon) {
      resultGame.innerHTML = `You won!<br>You got ${playerScore} points.`
    } else if (gameLost) {
      resultGame.innerHTML = `Game over!<br>You got ${playerScore} points.`
    }
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
        gameWon = true
        stopGame()
        showResult()
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
        gameLost = true
        stopGame()
        showResult()
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
        gameLost = true
        stopGame()
        showResult()
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
    clearInterval(moveCarInterval)
    clearTimeout(addingCarsTimeOut)
    window.removeEventListener('keydown', handleKeyDown)
  }

  function resetGame() {
    stopGame()
    if (gameWon || gameLost) {
      grid.removeChild(resultGame)
      grid.style.backgroundColor = 'white'
    } else {
      squares.forEach(square => grid.removeChild(square))
    }
    // Reset variables
    homes = [8, 6, 4, 2, 0]
    squares = []
    carsRight = [80, 84]
    carsLeft = [81, 78, 76]
    waterSquaresRight = [8, 9, 10, 13, 14, 15, 16, 20, 21, 22, 23]
    waterSquaresLeft = [30, 31, 34, 35, 36, 37, 38, 42, 43, 44]
    // counterCarsAdded = 0
    // carAmount = 0

    playerLives = 5
    frogFamily = 5
    frogsHome = 0
    playerScore = 0
    playerIndex = width * height - 5
    gameWon = false
    gameLost = false

    moveCarInterval = null
    addingCarsTimeOut = null
    // Reset lives/score
    lifeDisplay.innerHTML = playerLives
    scoreDisplay.innerHTML = playerScore
    // Show start button again
    start.removeEventListener('click', resetGame)
    start.addEventListener('click', playGame)
    start.innerHTML = 'Start'
  }

  // Event listeners
  start.addEventListener('click', playGame)

  // ! DELETE LATER
  playGame()
  setInterval(moveWater, 1000)
  // gameLost = true
  // showResult()
}

window.addEventListener('DOMContentLoaded', init)
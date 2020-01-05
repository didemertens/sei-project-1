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
// Add water, move with logs etc.

////////
// Count down before player can play

// Add animation when player dies

// Add more cars

// Make one/two log rows faster


// Add highscore with local storage

// Add easy, medium, hard
// > normal, dizzy, puppy
// Timer for getting the frogs home? 

function init() {
  // DOM VARIABLES
  const grid = document.querySelector('.grid')
  const start = document.querySelector('.start')
  const lifeDisplay = document.querySelector('#player-lives')
  const scoreDisplay = document.querySelector('#player-score')

  // GAME VARIABLES
  let gamePlaying = false
  let resultGame = ''
  // board
  const width = 9
  const height = 11

  let counterRunning = false
  let countDownGame = ''
  let counterTime = 3

  let squares = []
  let homes = [8, 6, 4, 2, 0]
  // cars
  let carsRight = [80, 84]
  let carsLeft = [76, 78, 81]
  // water
  let waterSquares = []
  let logsRight = [9, 10, 12, 13, 15, 16, 17, 22, 23, 24, 25]
  let logsLeft = [27, 28, 31, 32, 37, 38, 43, 44]
  // intervals and timeouts
  let moveCarInterval = null
  let addingCarsTimeOut = null
  let moveLogInterval = null
  let counterTimeOut = null
  let timeOutRemoveCounter = null
  let timeOutGame = null
  // player
  let playerIndex = width * height - 5
  let playerLives = 5
  let frogFamily = 5
  let frogsHome = 0
  let playerScore = 0
  let gameWon = false
  let gameLost = false


  // Functions
  // *********** START GAME
  function playGame() {
    if (!gamePlaying) {
      gamePlaying = true
      // Show reset button
      start.removeEventListener('click', playGame)
      start.addEventListener('click', resetGame)
      start.innerHTML = 'Reset'
      // Counter
      if (!counterRunning) {
        counterRunning = true
        createCounter()
      }
    }
  }

  // Create/show counter
  function createCounter() {
    grid.style.backgroundColor = 'black'
    countDownGame = document.createElement('h2')
    countDownGame.classList.add('count-down')
    grid.appendChild(countDownGame)
    showCountDown()
  }

  function showCountDown() {
    countDownGame.innerHTML = `Get ready!<br> ${counterTime}`
    countDown()
  }

  function countDown() {
    if (counterTime >= 1) {
      counterTime--
      counterTimeOut = setTimeout(showCountDown, 1000)
    } else {
      countDownGame.innerHTML = 'Go!'
      timeOutRemoveCounter = setTimeout(removeCounter, 1000)
      timeOutGame = setTimeout(makeGame, 1000)
    }
  }

  function removeCounter() {
    grid.removeChild(countDownGame)
    clearTimeout(counterTimeOut)
    clearTimeout(timeOutRemoveCounter)
    grid.style.backgroundColor = 'white'
    counterRunning = false
  }

  function makeGame() {
    clearTimeout(timeOutGame)
    createBoard()
    movePlayer()
  }

  // *********** GAME BOARD

  function createBoard() {
    Array(width * height).join('.').split('.').forEach(() => {
      const square = document.createElement('div')
      square.classList.add('grid-item')
      squares.push(square)
      grid.appendChild(square)
    })
    moveCars()
    moveLogs()
    moveCarInterval = setInterval(moveCars, 900)
    moveLogInterval = setInterval(moveLogs, 1000)
    createHomes()
    createSafePlaces()
  }

  function movePlayer() {
    addPlayer()
    window.addEventListener('keydown', handleKeyDown)
  }

  function createHomes() {
    homes.forEach(home => squares[home].classList.add('homes'))
  }

  function createSafePlaces() {
    const safeSquaresOne = [Array.from({ length: width }, (x, i) => i + 45), Array.from({ length: width }, (x, i) => i + 90)]
    safeSquaresOne.forEach(array => array.forEach(safePlace => squares[safePlace].classList.add('safe-place')))
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

    displayCars()
  }

  function displayCars() {
    squares.forEach(square => square.classList.remove('car'))
    carsRight.forEach(car => squares[car].classList.add('car'))
    carsLeft.forEach(car => squares[car].classList.add('car'))
    playerLost()
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

  function moveLogs() {
    logsRight = logsRight.reduce((newLogs, log) => {
      if (log < 26) {
        log += 1
        newLogs.push(log)
      } else if (log === 26) {
        log = 9
        newLogs.push(log)
      }
      return newLogs
    }, [])

    logsLeft = logsLeft.reduce((newLogs, log) => {
      if (log > 27) {
        log -= 1
        newLogs.push(log)
      } else if (log === 27) {
        log = 44
        newLogs.push(log)
      }
      return newLogs
    }, [])

    displayLogs()
    movePlayerOnLog()
  }

  function displayLogs() {
    squares.forEach(square => square.classList.remove('log'))
    logsRight.forEach(log => squares[log].classList.add('log'))
    logsLeft.forEach(log => squares[log].classList.add('log'))
    displayWater()
  }

  function displayWater() {
    squares.forEach(square => square.classList.remove('water'))
    waterSquares = Array.from({ length: 4 * width }, (x, i) => i + width)
    waterSquares = waterSquares.filter(water => !logsRight.includes(water) && !logsLeft.includes(water))
    waterSquares.forEach(water => squares[water].classList.add('water'))
  }

  function movePlayerOnLog() {
    if (logsRight.includes(playerIndex + 1)) {
      if (playerIndex % width < width - 1) {
        playerIndex++
        addPlayer()
      }
    }
    if (logsLeft.includes(playerIndex - 1)) {
      if (playerIndex % width > 0) {
        playerIndex--
        addPlayer()
      }
    }
    playerLost()
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
    if (carsRight.includes(playerIndex) || carsLeft.includes(playerIndex) || waterSquares.includes(playerIndex)) {
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
    clearInterval(moveLogInterval)
    window.removeEventListener('keydown', handleKeyDown)
  }

  function resetGame() {
    stopGame()
    if (counterRunning) {
      removeCounter()
    }
    if (gameWon || gameLost) {
      grid.removeChild(resultGame)
      grid.style.backgroundColor = 'white'
    } else {
      squares.forEach(square => grid.removeChild(square))
    }
    // Reset variables
    // board
    homes = [8, 6, 4, 2, 0]
    squares = []
    carsRight = [80, 84]
    carsLeft = [81, 78, 76]
    waterSquares = []
    logsRight = [9, 10, 12, 13, 15, 16, 17, 22, 23, 24, 25]
    logsLeft = [27, 28, 31, 32, 37, 38, 43, 44]
    countDownGame = ''
    counterTime = 3
    // player
    playerLives = 5
    frogFamily = 5
    frogsHome = 0
    playerScore = 0
    playerIndex = width * height - 5
    gameWon = false
    gameLost = false
    // intervals and timeouts
    moveCarInterval = null
    addingCarsTimeOut = null
    moveLogInterval = null
    counterTimeOut = null
    timeOutRemoveCounter = null
    timeOutGame = null
    // Reset display lives/score
    lifeDisplay.innerHTML = playerLives
    scoreDisplay.innerHTML = playerScore
    // Show start button again
    playGame()
  }

  // Event listeners
  start.addEventListener('click', playGame)

  // ! DELETE LATER
  playGame()
  // gameLost = true
  // showResult()
}

window.addEventListener('DOMContentLoaded', init)
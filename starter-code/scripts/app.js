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

// Count down before player can play
// Add more cars

// Make one/two log rows faster

// Add animation when player dies

// Add highscore with local storage
// Sort the highscore list
// Show max 10

////////

// Add easy, medium, hard
// > normal, dizzy, puppy
// Attack of the cat(s)?  Following dogs?
// Timer for getting the frogs home? 

// 2 players?

// Skip story button
// Toggle options?

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
  let carsRightOne = [80, 84]
  let carsRightTwo = [63, 69]
  let carsLeftOne = [76, 78, 81]
  let carsLeftTwo = [55, 57, 61]
  // water
  let waterSquares = []
  let logsRightOne = [10, 11, 13, 14, 15, 16]
  let logsRightTwo = [18, 19, 22, 23, 24, 25]
  let logsLeftOne = [37, 38, 39, 42, 43, 44]
  let logsLeftTwo = [28, 29, 31, 32, 33]
  // intervals and timeouts
  let moveCarInterval = null
  let addingCarsTimeOut = null
  let moveLogInterval = null
  let moveLogFastInterval = null
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
  let playerDied = false

  // Highscore
  let userNameDiv = ''
  let nameDisplay = ''
  let userName = ''
  let highscoreList = ''
  let highscoreItem = ''
  let highscoreClear = ''
  let inputUserName = ''
  let highscoreCleared = false
  let highscoreShown = false
  let playerScoreShown = false

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
      // ! Delete
      makeGame()
      // ! uncomment later
      // if (!counterRunning) {
      //   counterRunning = true
      //   createCounter()
      // }
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
    moveLogs()
    // ! Uncomment later
    // moveLogInterval = setInterval(moveLogs, 1000)
    // moveLogFastInterval = setInterval(moveLogsFast, 600)
    moveCars()
    // ! Uncomment later
    // moveCarInterval = setInterval(moveCars, 900)
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
    carsRightOne = carsRightOne.reduce((newCars, car) => {
      if (car < 89) {
        car += 1
        newCars.push(car)
      } else if (car === 89) {
        newCars.splice(carsRightOne.indexOf(car), 1)
        setTimeout(() => {
          createCar('rightOne')
        }, 1000)
      }
      return newCars
    }, [])

    carsRightTwo = carsRightTwo.reduce((newCars, car) => {
      if (car < 71) {
        car += 1
        newCars.push(car)
      } else if (car === 71) {
        newCars.splice(carsRightTwo.indexOf(car), 1)
        setTimeout(() => {
          createCar('rightTwo')
        }, 1000)
      }
      return newCars
    }, [])

    carsLeftOne = carsLeftOne.reduce((newCars, car) => {
      if (car > 72) {
        car -= 1
        newCars.push(car)
      } else if (car === 72) {
        newCars.splice(carsLeftOne.indexOf(car), 1)
        setTimeout(() => {
          createCar('leftOne')
        }, 1000)
      }
      return newCars
    }, [])

    carsLeftTwo = carsLeftTwo.reduce((newCars, car) => {
      if (car > 54) {
        car -= 1
        newCars.push(car)
      } else if (car === 54) {
        newCars.splice(carsLeftTwo.indexOf(car), 1)
        setTimeout(() => {
          createCar('leftTwo')
        }, 1000)
      }
      return newCars
    }, [])

    displayCars()
  }

  function displayCars() {
    squares.forEach(square => square.classList.remove('car-right', 'car-left'))
    carsRightOne.forEach(car => squares[car].classList.add('car-right'))
    carsRightTwo.forEach(car => squares[car].classList.add('car-right'))
    carsLeftOne.forEach(car => squares[car].classList.add('car-left'))
    carsLeftTwo.forEach(car => squares[car].classList.add('car-left'))
    playerLost()
  }

  function createCar(direction) {
    if (direction === 'rightOne') {
      const newCar = 81
      carsRightOne.unshift(newCar)
    } else if (direction === 'rightTwo') {
      const newCar = 63
      carsRightTwo.unshift(newCar)
    } else if (direction === 'leftOne') {
      const newCar = 80
      carsLeftOne.push(newCar)
    } else if (direction === 'leftTwo') {
      const newCar = 62
      carsLeftTwo.push(newCar)
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
  //   if (carsRightOne.length < 2) {
  //     const newCar = 80
  //     carsRightOne.push(newCar)
  //   }

  //   if (carsLeftOne.length >= carAmount && carAmount <= 3) {
  //     if (carAmount % 2 === 0) {
  //       const newCar = 81
  //       carsLeftOne.push(newCar)
  //     }
  //     carAmount++
  //   }
  // }


  // *********** WATER/LOGS

  function moveLogs() {
    logsRightOne = logsRightOne.reduce((newLogs, log) => {
      if (log < 17) {
        log += 1
        newLogs.push(log)
      } else if (log === 17) {
        log = 9
        newLogs.push(log)
      }
      return newLogs
    }, [])

    logsLeftTwo = logsLeftTwo.reduce((newLogs, log) => {
      if (log > 27) {
        log -= 1
        newLogs.push(log)
      } else if (log === 27) {
        log = 35
        newLogs.push(log)
      }
      return newLogs
    }, [])

    displayLogs()
    movePlayerOnLog()
  }

  function moveLogsFast() {
    logsRightTwo = logsRightTwo.reduce((newLogs, log) => {
      if (log < 26) {
        log += 1
        newLogs.push(log)
      } else if (log === 26) {
        log = 18
        newLogs.push(log)
      }
      return newLogs
    }, [])

    logsLeftOne = logsLeftOne.reduce((newLogs, log) => {
      if (log > 36) {
        log -= 1
        newLogs.push(log)
      } else if (log === 36) {
        log = 44
        newLogs.push(log)
      }
      return newLogs
    }, [])

    displayLogs()
    movePlayerOnLogFast()
  }

  function displayLogs() {
    squares.forEach(square => square.classList.remove('log', 'leaf'))
    logsRightOne.forEach(log => squares[log].classList.add('log'))
    logsRightTwo.forEach(log => squares[log].classList.add('leaf'))
    logsLeftOne.forEach(log => squares[log].classList.add('leaf'))
    logsLeftTwo.forEach(log => squares[log].classList.add('log'))
    displayWater()
  }

  function displayWater() {
    squares.forEach(square => square.classList.remove('water'))
    waterSquares = Array.from({ length: 4 * width }, (x, i) => i + width)
    waterSquares = waterSquares.filter(water => !logsRightOne.includes(water) && !logsRightTwo.includes(water)
      && !logsLeftOne.includes(water) && !logsLeftTwo.includes(water))
    waterSquares.forEach(water => squares[water].classList.add('water'))
  }

  function movePlayerOnLog() {
    if (logsRightOne.includes(playerIndex + 1)) {
      if (playerIndex % width < width - 1) {
        playerIndex++
        addPlayer()
      }
    }
    if (logsLeftTwo.includes(playerIndex - 1)) {
      if (playerIndex % width > 0) {
        playerIndex--
        addPlayer()
      }
    }
    playerLost()
  }

  function movePlayerOnLogFast() {
    if (logsRightTwo.includes(playerIndex + 1)) {
      if (playerIndex % width < width - 1) {
        playerIndex++
        addPlayer()
      }
    }
    if (logsLeftOne.includes(playerIndex - 1)) {
      if (playerIndex % width > 0) {
        playerIndex--
        addPlayer()
      }
    }
    playerLost()
  }

  // *********** MOVE PLAYER

  function handleKeyDown(e) {
    console.log(e.keyCode)
    const movement = ''
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
      } else if (frogsHome < 5 && playerLives >= 1) {
        frogFamily += playerLives
        resetPlayer()
      } else {
        addPoints(1000)
        gameWon = true
        setHighscore(playerScore)
        stopGame()
        showResult()
      }
    }
  }

  function playerLost() {
    if (carsRightOne.includes(playerIndex) || carsLeftOne.includes(playerIndex)
      || carsRightTwo.includes(playerIndex) || carsLeftTwo.includes(playerIndex)
      || waterSquares.includes(playerIndex)) {
      if (playerLives > 1) {
        playerScore -= 10
        playerLives -= 1
        displayScore()
        lifeDisplay.innerHTML = playerLives
        playerDead()
      } else {
        playerLives = 0
        lifeDisplay.innerHTML = playerLives
        gameLost = true
        stopGame()
        showResult()
      }
    } else if (squares[playerIndex].classList.contains('player-won')) {
      if (playerLives > 1 && frogsHome !== 5) {
        playerScore -= 10
        playerLives -= 1
        displayScore()
        lifeDisplay.innerHTML = playerLives
        playerDead()
      } else {
        playerLives = 0
        lifeDisplay.innerHTML = playerLives
        gameLost = true
        stopGame()
        showResult()
      }
    }
  }

  function playerDead() {
    playerDied = true
    clearInterval(moveCarInterval)
    clearInterval(moveLogFastInterval)
    clearInterval(moveLogInterval)
    squares[playerIndex].classList.remove('player')
    squares[playerIndex].classList.add('player-dead')
    playerIndex = width * height - 5
    setTimeout(resetPlayer, 1000)
  }

  function resetPlayer() {
    if (playerDied) {
      // moveCarInterval = setInterval(moveCars, 900)
      moveLogInterval = setInterval(moveLogs, 1000)
      moveLogFastInterval = setInterval(moveLogsFast, 600)
      playerDied = false
    }
    squares.forEach(square => square.classList.remove('player-dead'))
    playerIndex = width * height - 5
    addPlayer()
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
    playerScoreShown = true
    squares.forEach(square => grid.removeChild(square))
    resultGame = document.createElement('h3')
    resultGame.classList.add('result-game')
    grid.appendChild(resultGame)
    grid.style.backgroundColor = 'black'
    if (gameWon) {
      resultGame.innerHTML = `You won!<br><span class="total-points">You got ${playerScore} points</span>`
    } else if (gameLost) {
      resultGame.innerHTML = `Game over!<br><span class="total-points">You got ${playerScore} points</span>`
    }
    getUserName()
  }

  // *********** HIGHSCORE

  function getUserName() {
    userNameDiv = document.createElement('div')
    userNameDiv.classList.add('show-highscore')
    grid.appendChild(userNameDiv)

    nameDisplay = document.createElement('input')
    nameDisplay.classList.add('user-name')
    userNameDiv.appendChild(nameDisplay)
    nameDisplay.setAttribute('type', 'text')
    nameDisplay.setAttribute('placeholder', 'Your initials')
    nameDisplay.setAttribute('maxlength', 3)

    inputUserName = document.createElement('button')
    inputUserName.classList.add('submit-btn')
    inputUserName.innerHTML = 'Submit'
    userNameDiv.appendChild(inputUserName)

    inputUserName.addEventListener('click', setHighscore)
  }

  function setHighscore() {
    userName = document.querySelector('.user-name').value
    grid.removeChild(userNameDiv)

    const stringScore = String(playerScore)
    localStorage.setItem(userName, stringScore)
    sortHighscore()
  }

  function sortHighscore() {
    const highscoreArray = []
    if (localStorage.length > 0) {
      for (i = 0; i < localStorage.length; i++) {
        highscoreArray.push([localStorage.key(i), localStorage.getItem(localStorage.key(i))])
      }
    }

    highscoreArray.sort((a, b) => {
      return b[1] - a[1]
    })
    showHighscore(highscoreArray)
  }

  let highscoreDiv = ''
  let highscoreTitle = ''

  function showHighscore(sortedScore) {
    highscoreShown = true
    grid.removeChild(resultGame)

    highscoreDiv = document.createElement('div')
    highscoreDiv.classList.add('show-highscore')
    grid.appendChild(highscoreDiv)

    highscoreTitle = document.createElement('h2')
    highscoreTitle.classList.add('highscore-title')
    highscoreTitle.innerHTML = 'Ranking'
    highscoreDiv.appendChild(highscoreTitle)

    highscoreList = document.createElement('ol')
    highscoreDiv.appendChild(highscoreList)

    if (sortedScore.length > 10) {
      for (let i = 0; i < 10; i++) {
        highscoreItem = document.createElement('li')
        highscoreItem.classList.add('highest-scores')
        highscoreList.appendChild(highscoreItem)
        highscoreItem.innerHTML = `${sortedScore[i][0]} - ${sortedScore[i][1]} `
      }
    } else {
      sortedScore.forEach(nameScore => {
        highscoreItem = document.createElement('li')
        highscoreItem.classList.add('highest-scores')
        highscoreList.appendChild(highscoreItem)
        highscoreItem.innerHTML = `${nameScore[0]} - ${nameScore[1]} `
      })
    }

    highscoreClear = document.createElement('button')
    highscoreClear.classList.add('clear-btn')
    highscoreDiv.appendChild(highscoreClear)
    highscoreClear.innerHTML = 'Clear'
    highscoreClear.addEventListener('click', clearHighscore)
  }

  function clearHighscore() {
    highscoreCleared = true
    localStorage.clear()
    grid.removeChild(highscoreDiv)
  }

  // *********** STOP/RESET GAME

  function stopGame() {
    gamePlaying = false
    start.innerHTML = 'Play again'
    clearInterval(moveCarInterval)
    clearInterval(moveLogFastInterval)
    clearTimeout(addingCarsTimeOut)
    clearInterval(moveLogInterval)
    window.removeEventListener('keydown', handleKeyDown)
  }

  function resetGame() {
    stopGame()
    if (counterRunning) {
      removeCounter()
    }
    // highscore
    if (highscoreCleared) {
      grid.style.backgroundColor = 'white'
    } else if (highscoreShown) {
      grid.removeChild(highscoreDiv)
      grid.style.backgroundColor = 'white'
    } else if (playerScoreShown) {
      grid.removeChild(resultGame)
      grid.removeChild(userNameDiv)
      grid.style.backgroundColor = 'white'
    } else {
      squares.forEach(square => grid.removeChild(square))
    }

    // Reset variables
    // board
    homes = [8, 6, 4, 2, 0]
    squares = []
    carsRightOne = [80, 84]
    carsRightTwo = [63, 69]
    carsLeftOne = [81, 78, 76]
    carsLeftTwo = [55, 57, 60]
    waterSquares = []
    logsRightOne = [10, 11, 13, 14, 15, 16]
    logsRightTwo = [18, 19, 22, 23, 24, 25]
    logsLeftOne = [37, 38, 39, 42, 43, 44]
    logsLeftTwo = [28, 29, 31, 32, 33]
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
    playerDied = false
    // intervals and timeouts
    moveCarInterval = null
    addingCarsTimeOut = null
    moveLogInterval = null
    moveLogFastInterval = null
    counterTimeOut = null
    timeOutRemoveCounter = null
    timeOutGame = null
    // Reset display lives/score
    lifeDisplay.innerHTML = playerLives
    scoreDisplay.innerHTML = playerScore
    // Highscore/player score
    playerScoreShown = false
    highscoreCleared = false
    highscoreShown = false
    // Play again
    playGame()
  }

  // Event listeners
  start.addEventListener('click', playGame)

  // ! DELETE LATER
  playGame()
  // gameLost = true
  // showResult()

  console.log(highscoreCleared)

}

window.addEventListener('DOMContentLoaded', init)
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

// Player, show background image as well
// Smooth movement cars
// Create road
// Show player, not car going over player

// Make log/leaf smoother
////////

// Remove bugs (play again)

//////

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
  let carsRight = [81, 84, 63, 69]
  let carsLeft = [73, 79, 54, 57, 61]
  let roadSquares = []
  // water
  let waterSquares = []
  let logsRight = [10, 13, 16, 27, 29, 31, 33]
  let leafLeft = [38, 40, 42, 44, 18, 20, 22, 24]
  // intervals and timeouts
  let moveCarInterval = null
  // let addingCarsTimeOut = null
  let moveLogInterval = null
  let moveLeafFastInterval = null
  let counterTimeOut = null
  let timeOutRemoveCounter = null
  let timeOutGame = null
  // player
  // ! Uncomment later
  // let playerIndex = width * height - 5
  let playerIndex = 48
  // !
  let playerLives = 3
  let frogFamily = 5
  let frogsHome = 0
  let playerScore = 0
  let gameWon = false
  let gameLost = false
  let playerDied = false
  let waterTimeout = null
  // const carHitTimeout = null
  let inWater = false
  let carHit = false
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
      // ! Uncomment later
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
    // ! Uncomment later
    moveLogs()
    moveLeafFast()
    moveLogInterval = setInterval(moveLogs, 900)
    moveLeafFastInterval = setInterval(moveLeafFast, 800)
    // ! Uncomment later
    moveCars()
    moveCarInterval = setInterval(moveCars, 600)
    createHomes()
    createSafePlaces()
    setBackgroundImg()
  }

  function movePlayer() {
    addPlayer()
    window.addEventListener('keydown', handleKeyDown)
  }

  function createHomes() {
    homes.forEach(home => squares[home].classList.add('homes'))
  }

  function createSafePlaces() {
    const safeSquaresOne = [Array.from({ length: width }, (x, i) => i + 45), Array.from({ length: width }, (x, i) => i + 90), Array.from({ length: width }, (x, i) => i)]
    safeSquaresOne.forEach(array => array.forEach(safePlace => squares[safePlace].classList.add('safe-place')))
  }

  // *********** CARS

  function moveCars() {
    carsRight = carsRight.map(car => {
      if (car % width < width - 1) {
        return car + 1
      } else {
        return car - (width - 1)
      }
    })

    carsLeft = carsLeft.map(car => {
      if (car % width > 0) {
        return car - 1
      } else {
        return car + (width - 1)
      }
    })
    displayCars()
  }

  function displayCars() {
    squares.forEach(square => square.classList.remove('car-right', 'car-left', 'moving-right', 'moving-left'))
    carsRight.forEach(car => squares[car].classList.add('car-right', 'moving-right'))
    carsLeft.forEach(car => squares[car].classList.add('car-left', 'moving-left'))
    displayRoad()
    playerCar()
  }

  function displayRoad() {
    squares.forEach(square => square.classList.remove('road'))
    roadSquares = Array.from({ length: 4 * width }, (x, i) => i + (width * 6))
    roadSquares = roadSquares.filter(road => !carsRight.includes(road) && !carsLeft.includes(road))
    roadSquares.forEach(road => squares[road].classList.add('road'))
  }


  // *********** WATER/LOGS

  function moveLogs() {
    logsRight = logsRight.map(log => {
      if (log % width < width - 1) {
        return log + 1
      } else {
        return log - (width - 1)
      }
    })
    displayLogs()
    movePlayerOnLog()
  }

  function moveLeafFast() {
    leafLeft = leafLeft.map(leaf => {
      if (leaf % width > 0) {
        return leaf - 1
      } else {
        return leaf + (width - 1)
      }
    })
    displayLogs()
    movePlayerOnLogFast()
  }

  function displayLogs() {
    squares[playerIndex].style.backgroundImage = ''
    setBackgroundImg()
    squares.forEach(square => square.classList.remove('log', 'leaf', 'log-last', 'moving-left-log', 'moving-right-log'))
    logsRight.forEach(log => squares[log].classList.add('log', 'moving-right-log'))
    leafLeft.forEach(log => squares[log].classList.add('leaf', 'moving-left-log'))
    displayWater()
  }

  function movePlayerOnLog() {
    if (logsRight.includes(playerIndex + 1)) {
      if (playerIndex % width < width - 1) {
        playerIndex++
        addPlayer()
      }
    }
    playerWater()
  }

  function movePlayerOnLogFast() {
    if (leafLeft.includes(playerIndex - 1)) {
      if (playerIndex % width > 0) {
        playerIndex--
        addPlayer()
      }

    }
    playerWater()
  }

  function displayWater() {
    squares.forEach(square => square.classList.remove('water'))
    waterSquares = Array.from({ length: 4 * width }, (x, i) => i + width)
    waterSquares = waterSquares.filter(water => !logsRight.includes(water) && !leafLeft.includes(water))
    waterSquares.forEach(water => squares[water].classList.add('water'))
  }

  // ! MOVE LATER
  let backImg = ''
  // let playerTimeout = null

  function setBackgroundImg() {
    const img = squares[playerIndex]
    const squareImg = img.currentStyle || window.getComputedStyle(img, false).backgroundImage.slice(4, -1).replace(/"/g, '')
    const squareSlash = squareImg.slice('').lastIndexOf('/')
    backImg = squareImg.slice(squareSlash + 1)
  }

  // *********** MOVE PLAYER
  function handleKeyDown(e) {
    squares[playerIndex].style.backgroundImage = ''

    switch (e.keyCode) {
      case 39:
        if (playerIndex % width < width - 1) playerIndex++
        setBackgroundImg()
        squares[playerIndex].style.backgroundImage = `url(assets/dog-right.png), url(assets/${backImg})`
        break
      case 37:
        if (playerIndex % width > 0) playerIndex--
        setBackgroundImg()
        squares[playerIndex].style.backgroundImage = `url(assets/dog-left.png), url(assets/${backImg})`
        break
      case 38:
        if (playerIndex - width >= 0) {
          playerIndex -= width
          addPoints(10)
        }
        setBackgroundImg()
        squares[playerIndex].style.backgroundImage = `url(assets/dog.png), url(assets/${backImg})`
        break
      case 40:
        if (playerIndex + width < width * height) playerIndex += width
        setBackgroundImg()
        squares[playerIndex].style.backgroundImage = `url(assets/dog-down.png), url(assets/${backImg})`
        break
    }
    // squares.forEach(square => square.classList.remove('player'))
    addPlayer()
  }

  function addPlayer() {
    // clearTimeout(playerTimeout)
    squares.forEach(square => square.classList.remove('player'))
    squares[playerIndex].classList.add('player')
    setTimeout(playerWon, 250)
    playerCar()
    playerWater()
  }

  // *********** CHECK WON/LOST

  function playerWon() {
    squares[playerIndex].style.backgroundImage = ''
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

  function playerWater() {
    if (waterSquares.includes(playerIndex)) {
      inWater = true
      waterTimeout = setTimeout(playerLost, 375)
    }
  }

  function playerCar() {
    carsRight.forEach(car => {
      if (car + 1 === playerIndex || car === playerIndex) {
        carHit = true
        playerLost()
      }
    })

    carsLeft.forEach(car => {
      if (car - 1 === playerIndex || car === playerIndex) {
        carHit = true
        playerLost()
      }
    })
  }

  function playerLost() {
    if (inWater) {
      inWater = false
      clearTimeout(waterTimeout)
    }

    if (carHit || waterSquares.includes(playerIndex)) {
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
    clearInterval(moveLogInterval)
    clearInterval(moveLeafFastInterval)
    squares[playerIndex].classList.remove('player')
    squares[playerIndex].classList.add('player-dead')
    // ! Background img
    squares[playerIndex].style.backgroundImage = ''
    // stop car/log animation
    squares.forEach(square => square.classList.remove('moving-right', 'moving-left', 'moving-left-log', 'moving-right-log'))
    playerIndex = width * height - 5
    setTimeout(resetPlayer, 1000)
    carHit = false
  }

  function resetPlayer() {
    if (playerDied) {
      moveCars()
      moveCarInterval = setInterval(moveCars, 600)
      moveLogs()
      moveLogInterval = setInterval(moveLogs, 900)
      moveLeafFast()
      moveLeafFastInterval = setInterval(moveLeafFast, 800)
      playerDied = false
    }
    squares.forEach(square => square.classList.remove('player-dead'))
    playerIndex = width * height - 5
    setBackgroundImg()
    addPlayer()
    squares[playerIndex].style.backgroundImage = 'url(assets/dog.png), url(assets/grass.png)'
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
      for (let i = 0; i < localStorage.length; i++) {
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
    window.removeEventListener('keydown', handleKeyDown)
    clearInterval(moveCarInterval)
    clearInterval(moveLeafFastInterval)
    // clearTimeout(addingCarsTimeOut)
    clearInterval(moveLogInterval)
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
    carsRight = [81, 84, 63, 69]
    carsLeft = [73, 79, 54, 57, 61]
    waterSquares = []
    logsRight = [10, 13, 16, 27, 29, 31, 33]
    leafLeft = [38, 40, 42, 44, 18, 20, 22, 24]
    countDownGame = ''
    counterTime = 3
    // player
    playerLives = 3
    frogFamily = 5
    frogsHome = 0
    playerScore = 0
    playerIndex = width * height - 5
    gameWon = false
    gameLost = false
    playerDied = false
    // intervals and timeouts
    // moveCarInterval = null
    // // addingCarsTimeOut = null
    // moveLogInterval = null
    // moveLeafFastInterval = null
    // counterTimeOut = null
    // timeOutRemoveCounter = null
    // timeOutGame = null

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
}

window.addEventListener('DOMContentLoaded', init)
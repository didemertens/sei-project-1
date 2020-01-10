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
// Remove bugs (play again)
////////


//////

function init() {
  // DOM VARIABLES
  const startGrid = document.querySelector('.start-grid')
  const grid = document.querySelector('.grid')
  const start = document.querySelector('.start')
  const playBtn = document.querySelector('.play-btn')
  const gameResultDisplay = document.querySelector('.game-lives-score')
  const lifeDisplay = document.querySelector('#player-lives')
  const scoreDisplay = document.querySelector('#player-score')
  const difficultyEasy = document.querySelector('#easy-choice')
  const difficultyMedium = document.querySelector('#medium-choice')

  // GAME VARIABLES
  let gamePlaying = false
  let resultGame = ''
  // board
  const width = 9
  const height = 11
  let squares = []
  let backImg = ''
  let cauldrons = [8, 6, 4, 2, 0]
  // Enemies
  let birdsRight = [81, 84, 63, 69]
  let horsesLeft = [73, 79, 54, 57, 61]
  // water
  let waterSquares = []
  let rainbowRight = [10, 11, 12, 13, 27, 28, 29, 30, 31]
  let cloudLeft = [38, 40, 42, 44, 18, 20, 22, 24]
  // intervals and timeouts
  let moveEnemiesInterval = null
  let moveRainbowInterval = null
  let moveCloudFastInterval = null
  // player
  let playerIndex = width * height - 5
  let playerLives = 3
  let frogFamily = 5
  let frogsHome = 0
  let playerScore = 0
  let gameWon = false
  let gameLost = false
  let playerDied = false
  let waterTimeout = null
  let inWater = false
  let enemiesHit = false
  // Highscore
  let highscoreDiv = ''
  let highscoreTitle = ''
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
  function createStartScreen() {
    resetGame()
    grid.style.display = 'none'
    start.style.visibility = 'hidden'
    gameResultDisplay.style.visibility = 'hidden'
    startGrid.style.display = 'flex'
  }

  function removeStartScreen() {
    grid.style.display = 'flex'
    start.style.visibility = 'visible'
    gameResultDisplay.style.visibility = 'visible'
    startGrid.style.display = 'none'
    playGame()
  }

  function playGame() {
    if (!gamePlaying) {
      gamePlaying = true
      if (difficultyEasy.checked) {
        playerLives = 5
        lifeDisplay.innerHTML = playerLives
      } else if (difficultyMedium.checked) {
        playerLives = 3
        lifeDisplay.innerHTML = playerLives
      } else {
        playerLives = 1
        lifeDisplay.innerHTML = playerLives
      }
      // Show reset btn
      start.innerHTML = 'Reset'
      makeGame()
    }
  }

  function makeGame() {
    // Create board and player with event listener
    createBoard()
    movePlayer()
  }

  // *********** GAME BOARD
  function createBoard() {
    // Create grid squares
    Array(width * height).join('.').split('.').forEach(() => {
      const square = document.createElement('div')
      square.classList.add('grid-item')
      squares.push(square)
      grid.appendChild(square)
    })
    // Move every obstacle/platform
    moveRainbow()
    moveCloudFast()
    moveRainbowInterval = setInterval(moveRainbow, 900)
    moveCloudFastInterval = setInterval(moveCloudFast, 800)
    moveEnemies()
    moveEnemiesInterval = setInterval(moveEnemies, 600)
    // Create static elements
    createCauldrons()
    createSafePlaces()
    // Set background img of player
    setBackgroundImg()
  }

  function movePlayer() {
    addPlayer()
    window.addEventListener('keydown', handleKeyDown)
  }

  function createCauldrons() {
    cauldrons.forEach(cauldron => squares[cauldron].classList.add('cauldron'))
  }

  function createSafePlaces() {
    const safeSquaresOne = [Array.from({ length: width }, (x, i) => i + 45), Array.from({ length: width }, (x, i) => i + 90), Array.from({ length: width }, (x, i) => i)]
    safeSquaresOne.forEach(array => array.forEach(safePlace => squares[safePlace].classList.add('safe-place')))
  }

  // *********** ENEMIES
  function moveEnemies() {
    birdsRight = birdsRight.map(bird => {
      if (bird % width < width - 1) {
        return bird + 1
      } else {
        return bird - (width - 1)
      }
    })
    horsesLeft = horsesLeft.map(horse => {
      if (horse % width > 0) {
        return horse - 1
      } else {
        return horse + (width - 1)
      }
    })
    displayEnemies()
  }

  function displayEnemies() {
    squares.forEach(square => square.classList.remove('bird-right', 'horse-left', 'moving-right', 'moving-left'))
    birdsRight.forEach(bird => squares[bird].classList.add('bird-right', 'moving-right'))
    horsesLeft.forEach(horse => squares[horse].classList.add('horse-left', 'moving-left'))
    displayRoad()
    playerEnemies()
  }

  function displayRoad() {
    squares.forEach(square => square.classList.remove('road-blue'))
    squares.forEach(square => square.classList.remove('road-pink'))
    let roadSquaresOne = [Array.from({ length: width }, (x, i) => i + width * 6), Array.from({ length: width }, (x, i) => i + width * 8)]
    let roadSquaresTwo = [Array.from({ length: width }, (x, i) => i + width * 7), Array.from({ length: width }, (x, i) => i + width * 9)]
    roadSquaresOne = roadSquaresOne.filter(road => !birdsRight.includes(road) && !horsesLeft.includes(road))
    roadSquaresTwo = roadSquaresTwo.filter(road => !birdsRight.includes(road) && !horsesLeft.includes(road))
    roadSquaresOne.forEach(array => array.forEach(road => squares[road].classList.add('road-blue')))
    roadSquaresTwo.forEach(array => array.forEach(road => squares[road].classList.add('road-pink')))
  }

  // *********** WATER/RAINBOW/CLOUD
  function moveRainbow() {
    rainbowRight = rainbowRight.map(rainbow => {
      if (rainbow % width < width - 1) {
        return rainbow + 1
      } else {
        return rainbow - (width - 1)
      }
    })
    displayWaterPlatforms()
    movePlayerOnRainbow()
  }

  function moveCloudFast() {
    cloudLeft = cloudLeft.map(cloud => {
      if (cloud % width > 0) {
        return cloud - 1
      } else {
        return cloud + (width - 1)
      }
    })
    displayWaterPlatforms()
    movePlayerOnCloudFast()
  }

  function displayWaterPlatforms() {
    squares[playerIndex].style.backgroundImage = ''
    setBackgroundImg()
    squares.forEach(square => square.classList.remove('rainbow', 'cloud', 'moving-left-cloud'))
    rainbowRight.forEach(rainbow => squares[rainbow].classList.add('rainbow'))
    cloudLeft.forEach(cloud => squares[cloud].classList.add('cloud', 'moving-left-cloud'))
    displayWater()
  }

  function movePlayerOnRainbow() {
    if (rainbowRight.includes(playerIndex + 1)) {
      if (playerIndex % width < width - 1) {
        playerIndex++
        addPlayer()
      }
    }
    playerWater()
  }

  function movePlayerOnCloudFast() {
    if (cloudLeft.includes(playerIndex - 1)) {
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
    waterSquares = waterSquares.filter(water => !rainbowRight.includes(water) && !cloudLeft.includes(water))
    waterSquares.forEach(water => squares[water].classList.add('water'))
  }

  // *********** MOVE PLAYER
  function handleKeyDown(e) {
    squares[playerIndex].style.backgroundImage = ''
    switch (e.keyCode) {
      case 39:
        if (playerIndex % width < width - 1) playerIndex++
        setBackgroundImg()
        squares[playerIndex].style.backgroundImage = `url(assets/witch-right.png), url(assets/${backImg})`
        break
      case 37:
        if (playerIndex % width > 0) playerIndex--
        setBackgroundImg()
        squares[playerIndex].style.backgroundImage = `url(assets/witch-left.png), url(assets/${backImg})`
        break
      case 38:
        if (playerIndex - width >= 0) {
          playerIndex -= width
          addPoints(10)
        }
        setBackgroundImg()
        squares[playerIndex].style.backgroundImage = `url(assets/witch.png), url(assets/${backImg})`
        break
      case 40:
        if (playerIndex + width < width * height) playerIndex += width
        setBackgroundImg()
        squares[playerIndex].style.backgroundImage = `url(assets/witch-down.png), url(assets/${backImg})`
        break
    }
    addPlayer()
  }

  function setBackgroundImg() {
    const img = squares[playerIndex]
    const squareImg = img.currentStyle || window.getComputedStyle(img, false).backgroundImage.slice(4, -1).replace(/"/g, '')
    const squareSlash = squareImg.slice('').lastIndexOf('/')
    backImg = squareImg.slice(squareSlash + 1)
  }

  function addPlayer() {
    squares.forEach(square => square.classList.remove('player'))
    squares[playerIndex].classList.add('player')
    setTimeout(playerWon, 250)
    playerEnemies()
    playerWater()
  }

  // *********** CHECK WON/LOST
  function playerWon() {
    squares[playerIndex].style.backgroundImage = ''
    if (cauldrons.includes(playerIndex)) {
      addPoints(50)
      frogsHome += 1
      frogFamily -= 1
      squares[playerIndex].classList.remove('cauldrons')
      squares[playerIndex].classList.add('player-won')

      cauldrons.forEach(cauldron => {
        if (cauldron === playerIndex) {
          cauldrons.splice(cauldrons.indexOf(cauldron), 1)
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
        stopGame()
        showResult()
      }
    }
  }

  // Check if player in water/hit enemy, then set time out for player lost
  function playerWater() {
    if (waterSquares.includes(playerIndex)) {
      inWater = true
      waterTimeout = setTimeout(playerLost, 400)
    } else if (squares[playerIndex].classList.contains('player-won')) {
      playerLost()
    }
  }

  function playerEnemies() {
    birdsRight.forEach(bird => {
      if (bird + 1 === playerIndex || bird === playerIndex) {
        enemiesHit = true
        playerLost()
      }
    })
    horsesLeft.forEach(horse => {
      if (horse - 1 === playerIndex || horse === playerIndex) {
        enemiesHit = true
        playerLost()
      }
    })
  }

  function playerLost() {
    // If player on safe place, not dead
    if (squares[playerIndex].classList.contains('safe-place')) {
      return
    }
    // If in water, reset check player in water function
    if (inWater) {
      inWater = false
      clearTimeout(waterTimeout)
    }
    // Check dead
    if (enemiesHit || waterSquares.includes(playerIndex)) {
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
        playerDead()
        stopGame()
        setTimeout(showResult, 400)
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
        playerDead()
        stopGame()
        setTimeout(showResult, 400)
      }
    }
  }

  function playerDead() {
    playerDied = true
    clearInterval(moveEnemiesInterval)
    clearInterval(moveRainbowInterval)
    clearInterval(moveCloudFastInterval)
    squares[playerIndex].classList.remove('player')
    squares[playerIndex].classList.add('player-dead')
    squares[playerIndex].style.backgroundImage = ''
    squares.forEach(square => square.classList.remove('moving-right', 'moving-left', 'moving-left-log'))
    setTimeout(resetPlayer, 1000)
    enemiesHit = false
  }

  function resetPlayer() {
    // Add intervals again if player has died
    if (playerDied) {
      moveEnemies()
      moveRainbow()
      moveCloudFast()
      moveEnemiesInterval = setInterval(moveEnemies, 600)
      moveRainbowInterval = setInterval(moveRainbow, 900)
      moveCloudFastInterval = setInterval(moveCloudFast, 800)
      playerDied = false
    }
    // Reset board and player
    squares.forEach(square => square.classList.remove('player-dead'))
    playerIndex = width * height - 5
    addPlayer()
    setBackgroundImg()
    squares[playerIndex].style.backgroundImage = 'url(assets/witch-down.png), url(assets/ground.png)'
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
    // Remove every square
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild)
    }
    // Show result
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
    // Get username/initials
    nameDisplay = document.createElement('input')
    nameDisplay.classList.add('user-name')
    userNameDiv.appendChild(nameDisplay)
    nameDisplay.setAttribute('type', 'text')
    nameDisplay.setAttribute('placeholder', 'Your initials')
    nameDisplay.setAttribute('maxlength', 3)
    // Create submit button with event listener to show highscore
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

  function showHighscore(sortedScore) {
    highscoreShown = true
    grid.removeChild(resultGame)
    // Create highscore page
    highscoreDiv = document.createElement('div')
    highscoreDiv.classList.add('show-highscore')
    grid.appendChild(highscoreDiv)
    // Title
    highscoreTitle = document.createElement('h2')
    highscoreTitle.classList.add('highscore-title')
    highscoreTitle.innerHTML = 'Ranking'
    highscoreDiv.appendChild(highscoreTitle)
    // List
    highscoreList = document.createElement('ol')
    highscoreDiv.appendChild(highscoreList)
    // Max 10 items in list
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
    // Add clear button so player can remove all highscores
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
    createStartScreen()
  }

  // *********** STOP/RESET GAME

  function stopGame() {
    gamePlaying = false
    start.innerHTML = 'Play again'
    // Freeze game
    window.removeEventListener('keydown', handleKeyDown)
    clearInterval(moveEnemiesInterval)
    clearInterval(moveCloudFastInterval)
    clearInterval(moveRainbowInterval)
  }

  function resetGame() {
    // If reset button is clicked in middle of game
    if (!gameWon || !gameLost) {
      stopGame()
    }
    // Highscore asked/shown/cleared
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
      while (grid.firstChild) {
        grid.removeChild(grid.firstChild)
      }
    }
    // Reset variables
    // board
    cauldrons = [8, 6, 4, 2, 0]
    squares = []
    birdsRight = [81, 84, 63, 69]
    horsesLeft = [73, 79, 54, 57, 61]
    waterSquares = []
    rainbowRight = [10, 11, 12, 13, 27, 28, 29, 30, 31]
    cloudLeft = [38, 40, 42, 44, 18, 20, 22, 24]
    // player
    playerLives = 3
    frogFamily = 5
    frogsHome = 0
    playerScore = 0
    playerIndex = width * height - 5
    gameWon = false
    gameLost = false
    playerDied = false
    // Reset display lives/score
    lifeDisplay.innerHTML = playerLives
    scoreDisplay.innerHTML = playerScore
    // Highscore/player score
    playerScoreShown = false
    highscoreCleared = false
    highscoreShown = false
  }

  // Event listeners
  start.addEventListener('click', createStartScreen)
  playBtn.addEventListener('click', removeStartScreen)
}

window.addEventListener('DOMContentLoaded', init)
// * Frogger
// Make game board
// Place player
// Add event listeners keys
// Add obstacles, like cars
// When hit by obstacle, loss of a life
// Get all 5 frogs home
// Timer for getting the frogs home? 
// Every step, get 10 points
// Every frog home, get 50 points
// All 5 frogs home, get 1000 points

function init() {
  // DOM variables
  const grid = document.querySelector('.grid')

  // game variables
  const width = 7
  const height = 11
  const squares = []
  let playerIndex = width * height - 4


  // Functions
  function createBoard() {
    Array(width * height).join('.').split('.').forEach(() => {
      const square = document.createElement('div')
      square.classList.add('grid-item')
      squares.push(square)
      grid.appendChild(square)
    })
  }

  function handleKeyDown(e) {
    // ! console.log(playerIndex)
    switch (e.keyCode) {
      case 39:
        if (playerIndex % width < width - 1) {
          playerIndex++
        }
        break
      case 37:
        if (playerIndex % width > 0) {
          playerIndex--
        }
        break
      case 38:
        if (playerIndex - width >= 0) {
          playerIndex -= width
        }
        break
      case 40:
        if (playerIndex + width < width * height) {
          playerIndex += width
        }
        break
    }
    squares.forEach(square => square.classList.remove('player'))
    squares[playerIndex].classList.add('player')
  }


  // Event listeners
  window.addEventListener('keydown', handleKeyDown)


  // ! DELETE LATER
  createBoard()
}

window.addEventListener('DOMContentLoaded', init)
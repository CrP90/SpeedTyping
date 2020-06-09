const RANDOM_TEXT_API_URL = 'http://api.quotable.io/random'
const TEXT_DISPLAY_ELEMENT = document.getElementById('textDisplay')
const TEXT_INPUT_ELEMENT = document.getElementById('textInput')
const TIMER_ELEMENT = document.getElementById('timer')
const GAME_RESULT_ELEMENT = document.getElementById('gameResult')
const GAME_RESULT_TEXT_ELEMENT = document.querySelector('[data-game-result]')
const RESTART_BUTTON = document.getElementById('restartButton')

let startTime
let totalCh
let chTyped
startGame()

async function startGame() {
  totalCh = 0
  chTyped = 0
  TEXT_DISPLAY_ELEMENT.innerText = ''
  const text = await getRandomText()
  text.split('').forEach(ch => {
      const chSpan = document.createElement('span')
      chSpan.innerText = ch
      TEXT_DISPLAY_ELEMENT.appendChild(chSpan)
      totalCh++
  });
  startTimer()
}

RESTART_BUTTON.addEventListener('click', () => {
  TIMER_ELEMENT.innerText = 0
  TEXT_INPUT_ELEMENT.value = null
  TEXT_INPUT_ELEMENT.focus()
  GAME_RESULT_ELEMENT.classList.remove('show')
  startGame()
}) 

TEXT_INPUT_ELEMENT.addEventListener('input', (e) => {
  const arrayText = TEXT_DISPLAY_ELEMENT.querySelectorAll('span')
  const currentInput = e.target.value
  chTyped++

  arrayText.forEach((chSpan, index) => {
    const ch = currentInput[index]
    if (ch == null) {
      chSpan.classList.remove('correct')
      chSpan.classList.remove('incorrect')
    } else if (ch === chSpan.innerText) {
      chSpan.classList.add('correct')
      chSpan.classList.remove('incorrect')
    } else {
      chSpan.classList.remove('correct')
      chSpan.classList.add('incorrect')
    }
  })

  if (currentInput === TEXT_DISPLAY_ELEMENT.innerText) {
    endGame()
  }
})

function endGame() {
  let gameDuration = getTime()
  let speedTyping = ((chTyped * 60) / gameDuration).toFixed(1)
  let typeAccuracy = ((totalCh / chTyped).toFixed(2)) * 100
  GAME_RESULT_TEXT_ELEMENT.innerText = `Typing speed: ${speedTyping} characters / minute \n  
                                        Type accuracy: ${typeAccuracy}% \n 
                                        ${chTyped} characters typed in ${gameDuration} seconds`
  GAME_RESULT_ELEMENT.classList.add('show')
}

function getRandomText() {
  return fetch(RANDOM_TEXT_API_URL)
    .then(response => response.json())
    .then(data => data.content)
}

function startTimer() {
  startTime = new Date()
  setInterval(() => {
    TIMER_ELEMENT.innerText = getTimerTime()
  }, 1000)
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000)
}

function getTime() {
  return TIMER_ELEMENT.innerText
}

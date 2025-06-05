// Created by: Kyle Matthew Magnaye
// Created on: Jun 2025
// Simple countdown timer with fireworks sound 45 times after the song ends

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('timer-form')
  const display = document.getElementById('timer-display')
  const audio = document.getElementById('timer-sound')
  const fireworkAudio = new Audio('./assets/audio/new-year-fireworks-sound4-180205.mp3')
  let timerInterval

  form.addEventListener('submit', function (event) {
    event.preventDefault()

    const days = parseInt(document.getElementById('days').value, 10) || 0
    const hours = parseInt(document.getElementById('hours').value, 10) || 0
    const minutes = parseInt(document.getElementById('minutes').value, 10) || 0
    const seconds = parseInt(document.getElementById('seconds').value, 10) || 0
    let totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds

    // Check if the user entered zero for the countdown time.
    // If yes, show an alert and stop further execution.
    if (totalSeconds == 0) { // eslint-disable-next-line eqeqeq
      alert('Please enter a time greater than zero.')
      return
    }

    // Stop any previous countdown timer and show the starting time.
    clearInterval(timerInterval)
    updateDisplay(totalSeconds)

    // Start the countdown timer, updating every second.
    timerInterval = setInterval(function () {
      totalSeconds--
      updateDisplay(totalSeconds)
      // When timer reaches zero, stop the countdown and play the song.
      if (totalSeconds <= 0) {
        clearInterval(timerInterval)
        if (audio) {
          audio.currentTime = 0
          audio.play()
          // When the song finishes, play the fireworks sound 45 times.
          audio.onended = function () {
            playFireworks(45)
          }
        } else {
          // If there is no song, play the fireworks sound 45 times right away.
          playFireworks(45)
        }
      }
    }, 1000)
  })

  function updateDisplay (totalSeconds) {
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    display.textContent =
      String(days).padStart(2, '0') + ':' +
      String(hours).padStart(2, '0') + ':' +
      String(minutes).padStart(2, '0') + ':' +
      String(seconds).padStart(2, '0')
  }

  // Play the fireworks sound "number" times in a row, each time after the previous finishes.
  function playFireworks (number) {
    let count = 0
    function playOnce () {
      if (count < number) {
        fireworkAudio.currentTime = 0
        fireworkAudio.play()
        count++
        fireworkAudio.onended = playOnce
      }
    }
    playOnce()
  }
})

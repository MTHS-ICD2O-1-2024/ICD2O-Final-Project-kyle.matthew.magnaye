// Created by: Kyle Matthew Magnaye
// Created on: Jun 2025
// This script enables the countdown timer functionality.

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('timer-form');
  const display = document.getElementById('timer-display');
  const audio = document.getElementById('final-countdown-audio');
  let timerInterval;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get user input values
    const days = parseInt(document.getElementById('days').value, 10) || 0;
    const hours = parseInt(document.getElementById('hours').value, 10) || 0;
    const minutes = parseInt(document.getElementById('minutes').value, 10) || 0;
    const seconds = parseInt(document.getElementById('seconds').value, 10) || 0;

    // Calculate total seconds
    let totalSeconds =
      days * 24 * 60 * 60 +
      hours * 60 * 60 +
      minutes * 60 +
      seconds;

    // Clear previous timer if active
    clearInterval(timerInterval);

    updateDisplay(totalSeconds);

    timerInterval = setInterval(function () {
      totalSeconds--;
      if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        updateDisplay(0);
        if (audio) {
          audio.play();
        }
      } else {
        updateDisplay(totalSeconds);
      }
    }, 1000);
  });

  function updateDisplay(totalSeconds) {
    const d = Math.floor(totalSeconds / (24 * 60 * 60));
    const h = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const m = Math.floor((totalSeconds % (60 * 60)) / 60);
    const s = totalSeconds % 60;
    display.textContent =
      String(d).padStart(2, '0') + ':' +
      String(h).padStart(2, '0') + ':' +
      String(m).padStart(2, '0') + ':' +
      String(s).padStart(2, '0');
  }
});

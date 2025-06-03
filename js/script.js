// Created by: Kyle Matthew Magnaye
// Created on: Jun 2025
// This script enables the countdown timer functionality.

document.addEventListener('DOMContentLoaded', function () {
  // Get form and elements
  const form = document.getElementById('timer-form');
  const display = document.getElementById('timer-display');
  const audio = document.getElementById('timer-sound');
  let timerInterval; // Used to keep track of the countdown

  // When the form is submitted
  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Stop the page from reloading

    // Read values from the input fields and convert to numbers
    const days = parseInt(document.getElementById('days').value, 10) || 0;
    const hours = parseInt(document.getElementById('hours').value, 10) || 0;
    const minutes = parseInt(document.getElementById('minutes').value, 10) || 0;
    const seconds = parseInt(document.getElementById('seconds').value, 10) || 0;

    // Add up total seconds
    let totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;

    // If all values are zero, show a message and stop
    // eslint-disable-next-line eqeqeq
    if (totalSeconds == 0) {
      alert('Please enter a time greater than zero.');
      return;
    }

    // Stop any previous countdown
    clearInterval(timerInterval);

    // Show the starting time
    updateDisplay(totalSeconds);

    // Start the countdown: every 1 second, subtract one, update display
    timerInterval = setInterval(function () {
      totalSeconds--;
      if (totalSeconds <= 0) {
        clearInterval(timerInterval); // Stop timer
        updateDisplay(0); // Show zeros
        if (audio) {
          audio.play(); // Play sound if exists
        }
      } else {
        updateDisplay(totalSeconds);
      }
    }, 1000);
  });

  // This function updates the timer on the page
  function updateDisplay (totalSeconds) {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    display.textContent =
      String(days).padStart(2, '0') + ':' +
      String(hours).padStart(2, '0') + ':' +
      String(minutes).padStart(2, '0') + ':' +
      String(seconds).padStart(2, '0');
  }
});


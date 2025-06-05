// Created by: Kyle Matthew Magnaye
// Created on: Jun 2025
// This script enables the countdown timer functionality with a fireworks effect that bursts 45 times after the song ends.

document.addEventListener('DOMContentLoaded', function () {
  // Get form and elements
  const form = document.getElementById('timer-form')
  const display = document.getElementById('timer-display')
  const audio = document.getElementById('timer-sound')
  let timerInterval

  // --- Firework Audio ---
  let fireworkAudio = document.getElementById('firework-sound')
  if (!fireworkAudio) {
    fireworkAudio = document.createElement('audio')
    fireworkAudio.id = 'firework-sound'
    fireworkAudio.src = './assets/audio/new-year-fireworks-sound4-180205.mp3'
    document.body.appendChild(fireworkAudio)
  }

  // --- Fireworks Canvas ---
  const fwCanvas = document.createElement('canvas')
  fwCanvas.style.position = 'fixed'
  fwCanvas.style.left = '0'
  fwCanvas.style.top = '0'
  fwCanvas.style.width = '100vw'
  fwCanvas.style.height = '100vh'
  fwCanvas.style.pointerEvents = 'none'
  fwCanvas.style.zIndex = '9999'
  fwCanvas.style.display = 'none'
  document.body.appendChild(fwCanvas)
  const fwCtx = fwCanvas.getContext('2d')

  // --- Timer Logic ---
  form.addEventListener('submit', function (event) {
    event.preventDefault()

    const days = parseInt(document.getElementById('days').value, 10) || 0
    const hours = parseInt(document.getElementById('hours').value, 10) || 0
    const minutes = parseInt(document.getElementById('minutes').value, 10) || 0
    const seconds = parseInt(document.getElementById('seconds').value, 10) || 0
    let totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds

    // eslint-disable-next-line eqeqeq
    if (totalSeconds == 0) {
      alert('Please enter a time greater than zero.')
      return
    }

    clearInterval(timerInterval)
    updateDisplay(totalSeconds)

    timerInterval = setInterval(function () {
      totalSeconds--
      if (totalSeconds <= 0) {
        clearInterval(timerInterval)
        updateDisplay(0)
        if (audio) {
          audio.currentTime = 0
          audio.play()
          // Start fireworks when song ends
          audio.onended = function () {
            startFireworkShow(45)
          }
        } else {
          startFireworkShow(45)
        }
      } else {
        updateDisplay(totalSeconds)
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

  // --- Firework Show (45 bursts after song ends) ---
  function startFireworkShow (bursts) {
    fwCanvas.width = window.innerWidth
    fwCanvas.height = window.innerHeight
    fwCanvas.style.display = 'block'
    let particles = []
    let burstCount = 0
    const burstInterval = 120 // ms between bursts

    function launchBurst () {
      const burstX = Math.random() * fwCanvas.width * 0.7 + fwCanvas.width * 0.15
      const burstY = Math.random() * fwCanvas.height * 0.5 + fwCanvas.height * 0.15
      const color = `hsl(${Math.random() * 360},100%,60%)`
      for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * 2 * Math.PI
        const speed = 3 + Math.random() * 2
        particles.push({
          x: burstX,
          y: burstY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color,
          trail: []
        })
      }
    }

    const burstTimer = setInterval(function () {
      launchBurst()
      burstCount++
      if (burstCount >= bursts) clearInterval(burstTimer)
    }, burstInterval)

    animateFireworks()

    function animateFireworks () {
      fwCtx.globalCompositeOperation = 'destination-out'
      fwCtx.fillStyle = 'rgba(0,0,0,0.20)'
      fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height)
      fwCtx.globalCompositeOperation = 'lighter'

      particles.forEach(p => {
        // Draw trail
        if (p.trail.length > 1) {
          fwCtx.beginPath()
          fwCtx.moveTo(p.trail[0][0], p.trail[0][1])
          for (const pt of p.trail) fwCtx.lineTo(pt[0], pt[1])
          fwCtx.strokeStyle = p.color
          fwCtx.globalAlpha = 0.35
          fwCtx.lineWidth = 2
          fwCtx.stroke()
        }
        // Draw particle
        fwCtx.beginPath()
        fwCtx.arc(p.x, p.y, 3, 0, 2 * Math.PI)
        fwCtx.fillStyle = p.color
        fwCtx.globalAlpha = p.alpha
        fwCtx.fill()
        // Update
        p.trail.unshift([p.x, p.y])
        if (p.trail.length > 8) p.trail.pop()
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.06
        p.vx *= 0.98
        p.vy *= 0.98
        p.alpha -= 0.014
      })

      fwCtx.globalAlpha = 1.0
      particles = particles.filter(p => p.alpha > 0.05)
      if (particles.length > 0 || burstCount < bursts) {
        requestAnimationFrame(animateFireworks)
      } else {
        fwCanvas.style.display = 'none'
        fwCtx.globalCompositeOperation = 'source-over'
      }
    }
  }
})

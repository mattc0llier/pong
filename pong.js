const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let paddleVelocity = 15

const canvasYend = canvas.height - 100
const canvasYstart = 0
const paddleGap = 20
// KEYCODES
const upKey = 119
const downKey = 115

const ball = {
  xCoord: 250,
  yCoord: 250,
  xVelocity: 10,
  yVelocity: 0,
  radius: 10
}

const paddle = {
  yCoord: 0,
  xCoord: 0,
  height: 0,
  width: 0,
}

let leftPaddle = {}
Object.assign(leftPaddle, paddle, {
  yCoord: 250,
  xCoord: paddleGap,
  height: 100,
  width: 10,
})

let rightPaddle = {}
Object.assign(rightPaddle, paddle, {
  yCoord: 250,
  xCoord: canvas.width - paddleGap,
  height: 100,
  width: 10,
})

function drawCanvas() {
  //clear everything
  ctx.clearRect(0, 0, 1000, 800)

  // Draw left paddle
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(leftPaddle.xCoord, leftPaddle.yCoord)
  ctx.lineTo(leftPaddle.xCoord, leftPaddle.yCoord + leftPaddle.height)
  ctx.strokeStyle = 'white'
  ctx.lineWidth = leftPaddle.width
  ctx.stroke()

  // Draw right paddle
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(rightPaddle.xCoord, rightPaddle.yCoord)
  ctx.lineTo(rightPaddle.xCoord, rightPaddle.yCoord + rightPaddle.height)
  ctx.strokeStyle = 'white'
  ctx.lineWidth = rightPaddle.width
  ctx.stroke()

  // Draw ball
  ctx.beginPath()
  ctx.arc(ball.xCoord, ball.yCoord, ball.radius, 0, 6 * Math.PI)
  ctx.fillStyle = 'white'
  ctx.fill()

  // Draw dashed line
  ctx.setLineDash([20, 20])
  ctx.beginPath()
  ctx.moveTo(500, 0)
  ctx.lineTo(500, 1000)
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 2
  ctx.stroke()
}

let movePaddles = function(e) {
  e = e || window.event
  // use e.keyCode
  if (e.keyCode == upKey) {
    console.log('UP')
    if (leftPaddle.yCoord - paddleVelocity > canvasYstart) {
      leftPaddle.yCoord = leftPaddle.yCoord - paddleVelocity
    }
  } else if (e.keyCode == downKey) {
    console.log('DOWN')
    if (leftPaddle.yCoord + paddleVelocity < canvasYend) {
      leftPaddle.yCoord = leftPaddle.yCoord + paddleVelocity
    }
  }
}

function calculateState() {
  ball.xCoord = ball.xCoord + ball.xVelocity
  ball.yCoord = ball.yCoord + ball.yVelocity
  if (rightPaddleCollision()) {
    ball.xVelocity = -ball.xVelocity
    const deltaY = ball.yCoord - (rightPaddle.yCoord + rightPaddle.height / 2)
    ball.yVelocity = deltaY * 0.3

  } else if (leftPaddleCollision()) {
    ball.xVelocity = -ball.xVelocity
    const deltaY = ball.yCoord - (leftPaddle.yCoord + leftPaddle.height / 2)
    ball.yVelocity = deltaY * 0.3
  } else if (ceilingCollision()) {
    ball.yVelocity = -ball.yVelocity
  } else if(floorCollision()) {
    ball.yVelocity = -ball.yVelocity
  }
  calculateCPU()
}

function leftPaddleCollision() {
  const paddleTop = leftPaddle.yCoord
  const paddleBottom = leftPaddle.yCoord + leftPaddle.height
  if (ball.yCoord >= paddleTop && ball.yCoord <= paddleBottom) {
    if (ball.xCoord == leftPaddle.width + paddleGap) {
      return true
    }
  }
  return false
}

function rightPaddleCollision() {
  const paddleTop = rightPaddle.yCoord
  const paddleBottom = rightPaddle.yCoord + rightPaddle.height
  const ballRightSide = ball.xCoord + ball.radius
  const paddleLeftEdge = rightPaddle.xCoord - 10
  if (ball.yCoord >= paddleTop && ball.yCoord <= paddleBottom) {
    if (ballRightSide == rightPaddle.xCoord - rightPaddle.width) {
      console.log(
        'ball right side',
        ballRightSide,
        'Line xcoord',
        paddleLeftEdge
      )
      return true
    }
  }
  return false
}

function ceilingCollision() {
  if (ball.yCoord <= 0){
    return true
  }
  return false
}

function floorCollision() {
  if (ball.yCoord >= 600){
    return true
  }
  return false
}

function calculateCPU(){
  const paddleCentre = rightPaddle.yCoord + rightPaddle.height / 2

  if (paddleCentre < ball.yCoord) {
    rightPaddle.yCoord = rightPaddle.yCoord + 5
  } else {
    rightPaddle.yCoord = rightPaddle.yCoord - 5
  }
}

drawCanvas()
document.onkeypress = movePaddles

setInterval(() => {
  calculateState()
  drawCanvas()
}, 50)

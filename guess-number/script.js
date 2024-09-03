'use strict';

let secretNumber;
let score;
let highscore = 0;

function init() {
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  score = 20;
  document.querySelector('.message').textContent = 'Start guessing...';
  document.querySelector('.score').textContent = score;
  document.querySelector('.number').textContent = '?';
  document.querySelector('.guess').value = '';
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
}

init();

document.querySelector('.again').addEventListener('click', function () {
  init();
});

document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);
  if (!guess) {
    document.querySelector('.message').textContent = '⛔️ No number!';
  } else if (guess === secretNumber) {
    document.querySelector('.message').textContent = '🎉 Correct number!';
    document.querySelector('.number').textContent = secretNumber;
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';
    if (score > highscore) {
      highscore = score;
      document.querySelector('.highscore').textContent = highscore;
    }
  } else {
    if (score <= 1) {
      document.querySelector('.message').textContent = '💥 You lost the game';
      score = 0;
    } else {
      document.querySelector('.message').textContent =
        guess > secretNumber ? '📈 Too high' : '📉 Too low';
      --score;
    }
    document.querySelector('.score').textContent = score;
  }
});

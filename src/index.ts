import Game from './game';

(() => {
  const container = document.createElement('canvas');
  container.id = 'game-container';
  container.width = window.innerWidth;
  container.height = window.innerHeight;
  document.body.appendChild(container);

  const game = new Game(container);

  function mainLoop(tFrame: DOMHighResTimeStamp) {
    window.requestAnimationFrame(mainLoop);
    game.update(tFrame);
    game.render();
  }
  window.requestAnimationFrame(mainLoop);
})();

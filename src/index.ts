import { fromEvent } from 'rxjs';

import Game from 'game';

fromEvent(window, 'load').subscribe(() => {
  const container = document.createElement('canvas');
  container.id = 'game-container';
  container.width = window.innerWidth;
  container.height = window.innerHeight;
  document.body.appendChild(container);

  const game = new Game(container);
  game.init();
});

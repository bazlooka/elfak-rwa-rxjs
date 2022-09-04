import Game from 'game';
import { fromEvent } from 'rxjs';

fromEvent(window, 'load').subscribe(() => {
  const container = document.createElement('canvas');
  container.id = 'game-container';
  container.width = window.innerWidth;
  container.height = window.innerHeight;
  document.body.appendChild(container);

  const game = new Game(container);
  game.start();
});

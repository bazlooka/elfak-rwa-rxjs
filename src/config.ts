import BG_LAYER_1 from 'assets/images/bg1.png';
import BG_LAYER_2 from 'assets/images/bg2.png';
import BG_LAYER_3 from 'assets/images/bg3.png';
import BG_LAYER_4 from 'assets/images/bg4.png';
import { GameState } from 'enums';
import { IGameState } from 'interfaces';

export const BACKGROUNDS = [
  { imageSrc: BG_LAYER_1, speed: 30, zIndex: 0 },
  { imageSrc: BG_LAYER_2, speed: 40, zIndex: 0 },
  { imageSrc: BG_LAYER_3, speed: 70, zIndex: 0 },
  { imageSrc: BG_LAYER_4, speed: 90, zIndex: 0 },
];

export const INITIAL_GAME_STATE: IGameState = {
  currentState: GameState.ENTER_NICKNAME,
  score: 0,
  player: {
    id: 0,
    nickname: '',
    highscore: 0,
    electrons: 0,
  },
};

export const API_URL = 'http://localhost:3000';

export const SMALL_TEXT_FONT = '1rem "Press Start 2P"';
export const MEDIUM_TEXT_FONT = '2rem "Press Start 2P"';
export const LARGE_TEXT_FONT = '3rem "Press Start 2P"';

export const GAME_SPEED = 1;

export const MAXIMUM_DELTA_TIME = 1 / 30;

export const PLAYER_SIZE = 50;
export const PLAYER_ANIM_FRAME_DURATION = 1 / 15;
export const PLAYER_ANIM_FRAME_COUNT = 8;
export const PLAYER_ANIM_FRAME_SIZE = 32;
export const GRAVITY = 2000;
export const JUMP_ACCELERATION = 700;

export const OFFSCREEN_THRESHOLD = 50;

export const OBSTICLE_ASPECT_RATIO = 14;
export const OBSTICLE_SPAWN_INTERVAL_MS = 2000;
export const OBSTICLE_STARTING_POS = 30;
export const OBSTICLE_WIDTH = 60;
export const OBSTICLE_WINDOW_HEIGHT = 160;
export const OBSTICLE_SPEED = 300;
export const OBSTICLE_MARIGIN_Y = 0.15;
export const OBSTICLE_OFFSCREEN_THRESHOLD = 50;

export const ELECTRON_SIZE = 30;
export const ELECTRON_ANIM_FRAME_DURATION = 1 / 13;
export const ELECTRON_ANIM_FRAME_COUNT = 7;
export const ELECTRON_ANIM_FRAME_SIZE = 15;

export const BACKGROUND_ASPECT_RATIO = 3.125;

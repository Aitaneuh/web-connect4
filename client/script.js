import Renderer from './renderer.js'
import GameController from './game_controller.js'

const ROWS = 6;
const COLS = 7;
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentPlayer = 1;
let gameOver = false;

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const modeSel = document.getElementById('mode');

let gameMode = modeSel.value

const renderer = new Renderer(boardEl, statusEl);
const controller = new GameController(modeSel, resetBtn, renderer);


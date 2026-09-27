import { Board } from "./Board.js";
import { storage } from "./Storage.js";
import defaultTexts from "./defaultContent.js";
import { DnD } from "./DnD.js";
// import { DnDMouses } from "./DndMouses.js";

const board = document.querySelector(".board");

const newBoard = new Board(board);
newBoard.createBoard();

// работа с localStorage
const storageCard = storage.getStorage();
newBoard.renderCard(storageCard || defaultTexts);

window.addEventListener("beforeunload", () => {
  storage.setStorage();
});

// Реализация на событиях мыши
// const dnd = new DnDMouses(container);
// dnd.start();

// Реализация на событиях dnd
const dnd = new DnD(board);
dnd.start();

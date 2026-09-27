import { Form } from "./Form.js";
import { Card } from "./Card.js";

export class Board {
  constructor(board) {
    this.board = board;
    this.names = ["Задачи", "В разработке", "Выполнено"];
  }

  createBoard() {
    this.names.forEach((name) => {
      // создаем разметку каждой колонки и добавляем на страницу
      const column = this.createColumn(name);
      this.board.append(column);

      const cardList = column.querySelector(".cards-list");
      const form = new Form(cardList);
      column.append(form.formContainer);
    });
  }

  createColumn(title) {
    const column = document.createElement("div");
    column.className = "board-column";
    column.dataset.title = title;

    const contentColumn = `
      <div class="board-column-content">
        <h2>${title}</h2>
        <div class="cards-list"></div>
      </div>
    `;

    column.insertAdjacentHTML("beforeend", contentColumn);

    return column;
  }

  //добавление карточке на страницу, либо дефолтных, либо из формы
  renderCard(data) {
    const arrColumn = Array.from(document.querySelectorAll(".board-column"));
    arrColumn.forEach((column) => {
      const title = column.dataset.title;
      const cardListElem = column.querySelector(".cards-list");
      const cards = data[title];
      if (!cards) return;

      cards.forEach((card) => {
        const newCard = new Card(card);
        cardListElem.append(newCard.card);
      });
    });
  }
}

import { storage } from "./Storage.js";

export class Card {
  constructor(text) {
    // получаем текст, который будет в карточке
    this.text = text;
    // выносим слушателей в свойства, что бы корректно от них отписываться
    this.mouseEnterHandler = this.onMouseEnter.bind(this);
    this.mouseLeaveHandler = this.onMouseLeave.bind(this);
    this.deleteHandler = this.onDelete.bind(this);
    this.init();
  }

  init() {
    // создаем карточку
    this.createCard();
    // подписываем карточку на события внутри нее
    this.addListener();
  }

  createCard() {
    this.card = document.createElement("div");
    this.card.className = "card";
    this.card.draggable = true;

    // текст — через textContent
    this.cardText = document.createElement("div");
    this.cardText.className = "card-text";
    this.cardText.textContent = this.text;

    // крестик — отдельным элементом
    this.delete = document.createElement("button");
    this.delete.className = "card-delete";
    this.delete.type = "button";
    this.delete.textContent = "X";
    this.delete.draggable = false; // ← кнопка не тащится

    this.card.append(this.cardText);
    this.card.append(this.delete);
  }

  addListener() {
    // наведение мышки и показ крестика закрытия
    this.card.addEventListener("mouseenter", this.mouseEnterHandler);
    // уход мышки и скрытие крестика
    this.card.addEventListener("mouseleave", this.mouseLeaveHandler);
    // нажатие на крестик удаления карточки
    this.delete.addEventListener("click", this.deleteHandler);
  }

  onMouseEnter() {
    this.delete.classList.add("active");
  }

  onMouseLeave() {
    this.delete.classList.remove("active");
  }

  onDelete() {
    // перед удалением карточки отписываем ее от всех слушателей
    this.card.removeEventListener("mouseenter", this.mouseEnterHandler);
    this.card.removeEventListener("mouseleave", this.mouseLeaveHandler);
    this.delete.removeEventListener("click", this.deleteHandler);
    this.card.remove();
    storage.setStorage();
  }
}

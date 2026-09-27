import { storage } from "./Storage";

export class DnD {
  constructor(board) {
    this.board = board;
    this.cardLists = board.querySelectorAll(".cards-list");
    this.dragEl = null;
    this.fantomEl = null;
    this.padding = 30;
  }

  start() {
    // подписываем колонки на слушателей перетаскивания
    this.cardLists.forEach((list) => this.addListners(list));
    // подписываем документ на перетаскивание и сброс карточки
    document.addEventListener("dragover", this.onDragOver.bind(this));
    document.addEventListener("drop", this.onDrop.bind(this));
  }

  addListners(list) {
    list.addEventListener("dragstart", this.onDragStart.bind(this));
    list.addEventListener("dragend", this.onDragEnd.bind(this));
  }

  onDragStart(e) {
    const card = e.target.closest(".card");
    if (!card) return;

    this.dragEl = card;
    this.dragEl.classList.add("dragged");

    console.log("dragstart", card);

    // создаем фантом
    if (!this.fantomEl) {
      this.fantomEl = document.createElement("div");
      this.fantomEl.className = "fantom";
      this.fantomEl.style.width = this.dragEl.offsetWidth + "px";
      this.fantomEl.style.height = this.dragEl.offsetHeight + "px";
    }

    // const dragEl = this.dragEl;
    // const fantomEl = this.fantomEl;
    // // что бы копия осталась под курсором, делаем через асинхронное событие
    // setTimeout(() => {
    //   if (!dragEl.parentNode) return;
    //   dragEl.after(fantomEl);
    //   dragEl.remove();
    // }, 0);
  }

  // перетаскивание завершено - очищаем переменные
  onDragEnd() {
    // снимаем класс с перетаскиваемой карточки
    if (this.dragEl) {
      this.dragEl.classList.remove("dragged");

      // отмена drag (Esc) — вернуть карточку на место фантома
      if (
        !this.dragEl.parentNode &&
        this.fantomEl &&
        this.fantomEl.parentNode
      ) {
        this.fantomEl.before(this.dragEl);
      }
    }

    // удаляем фантом, если он остался в DOM
    if (this.fantomEl && this.fantomEl.parentNode) {
      this.fantomEl.remove();
    }
    console.log("dragend");

    // this.dragEl = null;
    // this.fantomEl = null;
  }

  onDragOver(e) {
    e.preventDefault();
    if (!this.dragEl) return;
    if (!(e.target instanceof HTMLElement)) return;

    const targetCard = e.target.closest(".card");
    const targetList = e.target.closest(".cards-list");

    if (!targetCard && !targetList) return;

    if (targetList && !targetCard) {
      // курсор над пустым местом списка — ставим фантом в конец
      const cards = Array.from(targetList.children).filter(
        (c) =>
          !c.classList.contains("dragged") && !c.classList.contains("fantom"),
      );

      if (cards.length === 0) {
        if (this.fantomEl.parentNode !== targetList) {
          this.fantomEl.remove();
          targetList.append(this.fantomEl);
        }
        return;
      }

      const last = cards[cards.length - 1];
      const lastRect = last.getBoundingClientRect();
      if (e.clientY - this.padding > lastRect.bottom) {
        if (targetList.lastElementChild !== this.fantomEl) {
          this.fantomEl.remove();
          targetList.append(this.fantomEl);
        }
      }
      return;
    }

    if (targetCard) {
      const rect = targetCard.getBoundingClientRect();
      const isLocationUp = this.isPositionUp(
        rect.top,
        rect.height,
        e.clientY - this.padding,
      );

      if (
        isLocationUp &&
        targetCard.previousElementSibling &&
        targetCard.previousElementSibling.classList.contains("fantom")
      )
        return;

      if (
        !isLocationUp &&
        targetCard.nextElementSibling &&
        targetCard.nextElementSibling.classList.contains("fantom")
      )
        return;

      this.fantomEl.remove();
      isLocationUp
        ? targetCard.before(this.fantomEl)
        : targetCard.after(this.fantomEl);
    }
  }

  onDrop(e) {
    e.preventDefault();

    if (!this.fantomEl || !this.dragEl) return;

    this.dragEl.removeAttribute("style");
    this.fantomEl.before(this.dragEl);
    this.dragEl.classList.remove("dragged");
    this.fantomEl.remove();
    this.fantomEl = null;
    this.dragEl = null;
    storage.setStorage();
  }

  isPositionUp(elemTop, elemHeight, clientY) {
    return clientY > elemTop && clientY < elemTop + elemHeight / 2;
  }
}

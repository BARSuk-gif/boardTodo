import { Card } from "./Card.js";
import { storage } from "./Storage.js";

export class Form {
  constructor(cardsList) {
    this.cardsList = cardsList;
    this.init();
  }

  init() {
    this.createForm();
    // подписка на события в этом блоке
    this.addListener();
  }

  createForm() {
    this.formContainer = document.createElement("div");
    this.formContainer.className = "form-add-task";

    // создаем стоку  добавить задачу
    this.formStr = document.createElement("div");
    this.formStr.className = "form-line";
    this.formStr.textContent = "+ добавить задачу";

    //создаем форму
    this.form = document.createElement("form");
    this.form.className = "form-content des-activate";

    this.formContainer.append(this.formStr);
    this.formContainer.append(this.form);

    const formContent = `
      <textarea class="task-content"></textarea>
      <button class="add-task">Добавить задачу</button>
      <button class="close" type="reset">X</button>
    `;
    this.form.insertAdjacentHTML("beforeend", formContent);

    this.textarea = this.form.querySelector(".task-content");
    this.closeBtn = this.form.querySelector(".close");
  }

  addListener() {
    //клик по строке Добавить задачу
    this.formStr.addEventListener("click", this.onOpenForm.bind(this));
    //отправка формы
    this.form.addEventListener("submit", this.onSubmitForm.bind(this));
    //отмена (нажатие на крестик)
    this.closeBtn.addEventListener("click", this.onCloseForm.bind(this));
  }

  onOpenForm() {
    //скрываем строку, показываем форму
    this.formStr.classList.add("des-activate");
    this.form.classList.remove("des-activate");
    this.textarea.focus();
  }

  onSubmitForm(e) {
    e.preventDefault();
    // тримим введенный текст
    const text = this.form.querySelector("textarea").value.trim();
    if (text) {
      // если текст есть после трима,
      // создаем новую карточку и добавляем ее в конец списка в нужный раздел
      const newCard = new Card(text);
      this.cardsList.append(newCard.card);
      storage.setStorage();
    }
    this.onCloseForm();
  }

  onCloseForm() {
    // очищаем форму, показываем add another task, скрываем форму
    this.form.reset();
    this.textarea.blur();
    this.formStr.classList.remove("des-activate");
    this.form.classList.add("des-activate");
  }
}

class Storage {
  getStorage() {
    try {
      const raw = localStorage.getItem("trello");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch (e) {
      console.warn("Не удалось прочитать storage", e);
      return null;
    }
  }

  setStorage() {
    const columns = document.querySelectorAll(".board-column");
    if (columns.length === 0) return;

    let name;

    const data = {};
    columns.forEach((el) => {
      const cards = el.querySelectorAll(".card");
      name = el.dataset.title;
      data[name] = [];
      cards.forEach((item) => {
        data[name].push(item.querySelector(".card-text").textContent);
      });
    });
    if (data[name].length === 0) return;
    localStorage.setItem("trello", JSON.stringify(data));
  }
}

export const storage = new Storage();

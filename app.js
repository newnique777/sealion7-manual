document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("q");
  const resultsDiv = document.getElementById("results");
  let data = [];

  fetch("data.json")
    .then(res => res.json())
    .then(json => {
      data = json;
    });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    resultsDiv.innerHTML = "";

    if (query.length < 2) return;

    const matches = data.filter(entry =>
      entry.title.toLowerCase().includes(query) ||
      entry.content.toLowerCase().includes(query)
    );

    matches.forEach(match => {
      const card = document.createElement("div");
      card.className = "card";

      const title = document.createElement("h3");
      title.textContent = match.title;
      title.addEventListener("click", () => {
        const content = card.querySelector("p");
        if (content) {
          content.remove();
        } else {
          const paragraph = document.createElement("p");
          paragraph.textContent = match.content;
          card.appendChild(paragraph);
        }
      });

      card.appendChild(title);
      resultsDiv.appendChild(card);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("q");
  const resultsDiv = document.getElementById("results");
  let data = [];

  function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
  }

  function isMatch(query, entry) {
    const normQuery = normalize(query);
    const title = normalize(entry.title);
    const content = normalize(entry.content);
    return title.includes(normQuery) || content.includes(normQuery);
  }

  fetch("data.json")
    .then(res => res.json())
    .then(json => {
      data = json;
    });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    resultsDiv.innerHTML = "";

    if (query.length < 2) return;

    const matches = data.filter(entry => isMatch(query, entry));

    if (matches.length === 0) {
      resultsDiv.innerHTML = "<p>No results found.</p>";
      return;
    }

    matches.forEach(match => {
      const card = document.createElement("div");
      card.className = "card";

      const title = document.createElement("h3");
      title.textContent = match.title;
      title.addEventListener("click", () => {
        const existing = card.querySelector("p");
        if (existing) {
          existing.remove();
        } else {
          const paragraph = document.createElement("p");
          paragraph.textContent = match.content + (match.page ? " (See page " + match.page + ")" : "");
          card.appendChild(paragraph);
        }
      });

      card.appendChild(title);
      resultsDiv.appendChild(card);
    });
  });
});

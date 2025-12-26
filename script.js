const from = document.getElementById("from");
const to = document.getElementById("to");
const historyList = document.getElementById("history");
const updatedText = document.getElementById("updated");
const themeToggle = document.getElementById("themeToggle");

let rates = {};

/* ===============================
   LOAD CURRENCY RATES
================================ */
fetch("https://open.er-api.com/v6/latest/USD")
  .then(res => res.json())
  .then(data => {
    rates = data.rates;

    updatedText.innerText =
      "Rates updated: " +
      new Date(data.time_last_update_utc).toLocaleString();

    Object.keys(rates).forEach(code => {
      from.innerHTML += `<option value="${code}">${code}</option>`;
      to.innerHTML += `<option value="${code}">${code}</option>`;
    });

    from.value = "USD";
    to.value = "PKR";
  });

/* ===============================
   CONVERT
================================ */
function convert() {
  const amount = document.getElementById("amount").value;
  if (!amount || !rates[from.value] || !rates[to.value]) return;

  const result = ((amount / rates[from.value]) * rates[to.value]).toFixed(2);

  document.getElementById("result").innerText =
    `${amount} ${from.value} = ${result} ${to.value}`;

  saveHistory(amount, from.value, to.value, result);
}

/* ===============================
   SWAP
================================ */
function swapCurrencies() {
  [from.value, to.value] = [to.value, from.value];
}

/* ===============================
   HISTORY (FIXED)
================================ */
function saveHistory(amount, fromC, toC, result) {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  history.unshift({
    text: `${amount} ${fromC} → ${result} ${toC}`
  });

  history = history.slice(0, 5); // keep max 5

  localStorage.setItem("history", JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  historyList.innerHTML = "";

  const history = JSON.parse(localStorage.getItem("history")) || [];

  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.text;
    historyList.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("history");
  historyList.innerHTML = "";
}

/* ===============================
   DARK MODE
================================ */
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.checked = true;
}

loadHistory();

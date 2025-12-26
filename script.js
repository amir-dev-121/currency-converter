const from = document.getElementById("from");
const to = document.getElementById("to");
const historyList = document.getElementById("history");
const updatedText = document.getElementById("updated");
const themeToggle = document.getElementById("themeToggle");

const ONE_DAY = 24 * 60 * 60 * 1000;
let rates = {};
let names = {};

/* Load currency names */
fetch("https://open.er-api.com/v6/codes")
  .then(res => res.json())
  .then(data => {
    data.supported_codes.forEach(([code, name]) => {
      names[code] = name;
    });
  });

/* Load rates */
fetch("https://open.er-api.com/v6/latest/USD")
  .then(res => res.json())
  .then(data => {
    rates = data.rates;

    updatedText.innerText =
      "Rates updated: " +
      new Date(data.time_last_update_utc).toLocaleString();

    Object.keys(rates).forEach(code => {
      const title = names[code] ? `${code} – ${names[code]}` : code;
      from.innerHTML += `<option value="${code}" title="${title}">${code}</option>`;
      to.innerHTML += `<option value="${code}" title="${title}">${code}</option>`;
    });

    from.value = "USD";
    to.value = "PKR";
  });

function convert() {
  const amount = document.getElementById("amount").value;
  if (!amount) return;

  const result = ((amount / rates[from.value]) * rates[to.value]).toFixed(2);
  document.getElementById("result").innerText =
    `${amount} ${from.value} = ${result} ${to.value}`;

  saveHistory(amount, from.value, to.value, result);
}

function swapCurrencies() {
  [from.value, to.value] = [to.value, from.value];
}

/* HISTORY */
function saveHistory(a, f, t, r) {
  let h = JSON.parse(localStorage.getItem("history")) || [];
  h.unshift({ text: `${a} ${f} → ${r} ${t}`, time: Date.now() });
  h = h.slice(0, 5);
  localStorage.setItem("history", JSON.stringify(h));
  loadHistory();
}

function loadHistory() {
  historyList.innerHTML = "";
  let h = JSON.parse(localStorage.getItem("history")) || [];
  h = h.filter(i => Date.now() - i.time < ONE_DAY);
  localStorage.setItem("history", JSON.stringify(h));
  h.forEach(i => historyList.innerHTML += `<li>${i.text}</li>`);
}

function clearHistory() {
  localStorage.removeItem("history");
  historyList.innerHTML = "";
}

/* DARK MODE */
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

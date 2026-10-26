const balanceElement = document.querySelector("#balance");
const historyList = document.querySelector("#history-list");
const statusElement = document.querySelector("#status");
const paymentButtons = document.querySelectorAll(".payment-button");
const rechargeButton = document.querySelector("#recharge");

let balance = 1000;

function formatAmount(amount) {
  return new Intl.NumberFormat("fr-FR").format(amount);
}

function updateBalance() {
  balanceElement.textContent = formatAmount(balance);
}

function addHistoryEntry({ title, amount, type }) {
  const emptyState = historyList.querySelector(".empty-state");
  if (emptyState) {
    emptyState.remove();
  }

  const item = document.createElement("li");
  item.className = `history-item ${type}`;

  const icon = document.createElement("span");
  icon.className = "history-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = type === "recharge" ? "+" : "↗";

  const details = document.createElement("div");
  details.className = "history-details";

  const titleElement = document.createElement("p");
  titleElement.className = "history-title";
  titleElement.textContent = title;

  const dateElement = document.createElement("p");
  dateElement.className = "history-date";
  dateElement.textContent = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

  const amountElement = document.createElement("span");
  amountElement.className = "history-amount";
  amountElement.textContent = `${type === "recharge" ? "+" : "−"}${formatAmount(amount)} F`;

  details.append(titleElement, dateElement);
  item.append(icon, details, amountElement);
  historyList.prepend(item);
}

function showStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.classList.toggle("error", isError);
}

paymentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const amount = Number(button.dataset.amount);

    if (balance < amount) {
      showStatus("Solde insuffisant. Rechargez votre compte.", true);
      return;
    }

    balance -= amount;
    updateBalance();
    addHistoryEntry({
      title: `Paiement gbaka · ${formatAmount(amount)} F`,
      amount,
      type: "payment",
    });
    showStatus(`Paiement de ${formatAmount(amount)} F effectué.`);
  });
});

rechargeButton.addEventListener("click", () => {
  balance += 1000;
  updateBalance();
  addHistoryEntry({
    title: "Rechargement",
    amount: 1000,
    type: "recharge",
  });
  showStatus("Votre compte a été rechargé de 1 000 F.");
});

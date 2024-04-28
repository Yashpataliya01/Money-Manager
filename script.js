let balanceVal = parseFloat(localStorage.getItem("balance") || 0);

document.querySelector("#balance").innerHTML = `Rs ${balanceVal}`;

let incomeVal = parseFloat(localStorage.getItem("income") || 0);
document.querySelector("#income").innerHTML = `Rs ${incomeVal}`;

let expenseVal = parseFloat(localStorage.getItem("expense") || 0);
document.querySelector("#expense").innerHTML = `Rs ${expenseVal}`;

const displayTransactionHistory = () => {
  let display = document.querySelector(".history")
  display.innerHTML = "";
  const transactionHistory = JSON.parse(localStorage.getItem("transactionHistory")) || [];
  balanceVal = 0;
  incomeVal = 0;
  expenseVal = 0;

  transactionHistory.forEach((transaction, index) => {
    let listItem = document.createElement("li")
    listItem.innerHTML = `
    <span class="transaction-title">${transaction.title}</span>
    <span class="transaction-amount">Rs ${transaction.amount}</span>
    <span class="transaction-date">${transaction.formattedDate}</span>
    <span class="transaction-type">${transaction.type}</span>
    `;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("data-index", index);
    deleteButton.addEventListener("click", deleteTransaction);

    listItem.appendChild(deleteButton);
    display.appendChild(listItem);
    if (transaction.type === "INCOME") {
      balanceVal += transaction.amount;
      incomeVal += transaction.amount;
    } else if (transaction.type === "EXPENSES") {
      balanceVal -= transaction.amount;
      expenseVal += transaction.amount;
    }
  });

  document.querySelector("#balance").innerHTML = `Rs ${balanceVal}`;
  document.querySelector("#income").innerHTML = `Rs ${incomeVal}`;
  document.querySelector("#expense").innerHTML = `Rs ${expenseVal}`;
}


const deleteTransaction = (event) => {
  const index = event.target.getAttribute("data-index");
  let transactionHistory = JSON.parse(localStorage.getItem("transactionHistory")) || [];
  
  if (transactionHistory[index].type === "INCOME") {
    balanceVal -= transactionHistory[index].amount;
    incomeVal -= transactionHistory[index].amount;
  } else if (transactionHistory[index].type === "EXPENSES") {
    balanceVal += transactionHistory[index].amount;
    expenseVal -= transactionHistory[index].amount;
  }
  transactionHistory.splice(index, 1);
  localStorage.setItem("transactionHistory", JSON.stringify(transactionHistory));
  document.querySelector("#balance").innerHTML = `Rs ${balanceVal}`;
  document.querySelector("#income").innerHTML = `Rs ${incomeVal}`;
  document.querySelector("#expense").innerHTML = `Rs ${expenseVal}`;
  displayTransactionHistory();

};


const submit = document.querySelector(".btn");
submit.addEventListener("click", () => {
  const title = document.querySelector("#title").value;
  const amount = parseFloat(document.querySelector("#amount").value);
  const date = document.querySelector("#date").value;
  const type = document.querySelector("#type").value.toUpperCase();
  const englishLettersRegex = /[A-Za-z]/;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (title.length === 0 || amount <= 0 || !englishLettersRegex.test(title) || !dateRegex.test(date)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const dateObj = new Date(date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;

  if (type === "INCOME") {
    balanceVal += amount;
    incomeVal += amount;
  } else if (type === "EXPENSES") {
    balanceVal -= amount;
    expenseVal += amount;
  } else {
    alert("Invalid type");
    return;
  }

  document.querySelector("#balance").innerHTML = `Rs ${balanceVal}`;
  localStorage.setItem("balance", balanceVal);

  document.querySelector("#income").innerHTML = `Rs ${incomeVal}`;
  localStorage.setItem("income", incomeVal);

  document.querySelector("#expense").innerHTML = `Rs ${expenseVal}`;
  localStorage.setItem("expense", expenseVal);

  const transaction = { title, amount, formattedDate, type };

  let transactionHistory = JSON.parse(localStorage.getItem("transactionHistory")) || [];

  transactionHistory.push(transaction);

  localStorage.setItem("transactionHistory", JSON.stringify(transactionHistory));

  displayTransactionHistory();

  document.querySelector("#title").value = "";
  document.querySelector("#amount").value = "";
  document.querySelector("#date").value = "";
});

displayTransactionHistory();

// Get DOM hooks
const balance = document.querySelector('#balance');
const money_plus = document.querySelector('#money-plus');
const money_minus = document.querySelector('#money-minus');
const list = document.querySelector('#list');
const form = document.querySelector('#form');
const text = document.querySelector('#text');
const amount = document.querySelector('#amount');

// const dummyTransactions = [
//   {id: 1, text: 'Flower', amount: -20},
//   {id: 2, text: 'Salary', amount: 300},
//   {id: 3, text: 'Book', amount: -10},
//   {id: 4, text: 'Camera', amount: 150}
// ];

// get the transactions out of local storage
// it will be a stringified array, so we need to run JSON.parse on it
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

// this will be out global state for transactions
// check if local storage for transactions is not empty, if not set it to localStorageTransactions
//  otherwise, create an empty array
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();
  
  // check if data has been entered, if so create a 'transaction' object
  // the object will have an id, text and amount
  // calls to outside function to generate a random id
  // then push the transaction object to transactions, which is the array of transactons objects
  // then call addTransactionDOM to add it to the DOM
  // then call updateValues() to update the income/expense values
  // then updat localstorage
  // then reset the text and value fields to nothing
  if(text.value.trim === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value
    }
    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();

    updateLocalStorage();

    text.value = '';
    amount.value = '';
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Get sign (credit or debit)
  // if amount is positive, give it a plus, less, give it a minus
  const sign = transaction.amount < 0 ? '-' : '+';

  // start creating the html for page
  const item = document.createElement('li');

  // Add class based on value, a value of minus would get <li class="minus"></li>
  // using a ternary operator to decide
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  // set the inner HTML for the item
  // using Math.abs() to remove the plus or minus
  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}
    </span><button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button>
  `;

  // add the newly created text to the list inner HTML
  list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
  // get the amounts by mapping through the transaction amounts property, creates a new array in amounts variable
  const amounts = transactions.map(transaction => transaction.amount);

  // for the total of all the amounts, we use reduce
  // reduce is a function that takes in an accumulator and each item, we then adds the accumulator total to a running item total
  // and finally, we use toFixed() to format with 2 decimal places
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  // console.log(amounts);
  // console.log(total);

  // we now want to add the income, those amounts with a positive value
  // we use filter to get rid of those with negative values
  // and then use reduce to add all the remaining values
  // toFixed() to format the final number
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0).toFixed(2);

  // console.log(income);

  // we now want the expenses
  // filter out for only values with a negative value
  // then use reduce to add them all together
  // multipley by -1 to make it negative
  // toFixed() to format the number
  const expense = (amounts
    .filter(item => item < 0)
    .reduce((acc, item) => (acc += item), 0) 
    * -1).toFixed(2);

  // console.log(expense);

  // now take the 3 numbers and add them to the HTML DOM
  balance.innerText =  `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Remove transaction by ID
// run a filter to remove the current id from the array
// it actually adds each one this is NOT the current id
// then update the localstorage
// and then reinitialize everything
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();

  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Event listeners
form.addEventListener('submit', addTransaction);

// Init function, runs on page load
// loop through the transactions with a forEach() and run addTransactionDOM on each transaction
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}

// kick off init
init();
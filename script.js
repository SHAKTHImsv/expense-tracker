const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const calculateBalances = document.getElementById('calculateBalances');
const balanceSummary = document.getElementById('balanceSummary');

// Sample exchange rates (for demonstration purposes)
const exchangeRates = {
    USD: 1,
    EUR: 1.1,
    GBP: 1.3,
    JPY: 0.007,
    INR: 0.013
};

let expenses = [];

// Event listener for adding expenses
expenseForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const person = document.getElementById('person').value.trim();
    const expenseDescription = document.getElementById('expenseDescription').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const currency = document.getElementById('currency').value;

    // Validate input
    if (!person || !expenseDescription || isNaN(amount) || amount <= 0) {
        alert("Please fill in all fields correctly.");
        return;
    }

    // Store the original amount and currency
    expenses.push({ person, description: expenseDescription, amount, currency });

    updateExpenseList();
    expenseForm.reset();
});

// Function to update the expense list displayed in a table
function updateExpenseList() {
    expenseList.innerHTML = expenses.map(expense => 
        `<tr>
            <td>${expense.person}</td>
            <td>${expense.description}</td>
            <td>${expense.amount} ${expense.currency}</td>
        </tr>`
    ).join('');
}

// Event listener for calculating balances
calculateBalances.addEventListener('click', function() {
    const balances = {};
    const totalInOriginalCurrency = {};

    // Calculate total expenses for each person in their original currency
    expenses.forEach(expense => {
        if (!balances[expense.person]) {
            balances[expense.person] = 0;
            totalInOriginalCurrency[expense.person] = { amount: 0, currency: expense.currency };
        }
        const amountInUSD = expense.amount / exchangeRates[expense.currency];
        balances[expense.person] += amountInUSD;

        // Sum the original amount for balance calculation
        totalInOriginalCurrency[expense.person].amount += expense.amount;
        totalInOriginalCurrency[expense.person].currency = expense.currency;
    });

    // Calculate total expenses in USD and number of people
    const totalAmount = Object.values(balances).reduce((sum, amount) => sum + amount, 0);
    const numPeople = Object.keys(balances).length;
    const amountPerPersonInUSD = (totalAmount / numPeople).toFixed(2);

    // Clear the balance summary before updating
    balanceSummary.innerHTML = '';

    // Calculate how much each person owes or is owed
    Object.keys(balances).forEach(person => {
        const balanceInUSD = (balances[person] - amountPerPersonInUSD).toFixed(2);
        
        // Convert balance back to the person's original currency for display
        const originalAmount = (Math.abs(balanceInUSD) * exchangeRates[totalInOriginalCurrency[person].currency]).toFixed(2);
        const currency = totalInOriginalCurrency[person].currency;

        balanceSummary.innerHTML += `
            <tr>
                <td>${person}</td>
                <td>${balanceInUSD >= 0 ? `Owes ${originalAmount} ${currency}` : `Owed ${originalAmount} ${currency}`}</td>
            </tr>`;
    });
    
    // Show the balance summary table
    balanceSummary.classList.remove('hidden');
});

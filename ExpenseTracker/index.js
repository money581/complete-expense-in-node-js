

function addNewExpense(e){
    e.preventDefault();

const expenseDetails={
    expenseamount:e.target.expenseamount.value,
    description:e.target.description.value,
    category:e.target.category.value
   

}
//console.log(expenseDetails)
const token=localStorage.getItem('token')
axios.post('http://localhost:3000/expense/addexpense',expenseDetails,{headers:{"Authorization":token}}).then((response) => {
   // console.log(response.data.expense);
addNewExpensetoUI(response.data.expense)

}).catch(err=>showError(err))
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
      const token=localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/expense/getexpenses',{headers:{"Authorization":token}});
      const expenses = response.data.expenses;
  
      expenses.forEach(expense => {
        addNewExpensetoUI(expense);
      });
    } catch (err) {
      showError(err);
    }
  });
  

function addNewExpensetoUI(expense){
    const parentElement=document.getElementById('listOfExpenses');
    const expenseElemId=`expense-${expense.id}`;
    parentElement.innerHTML+=`
    <li id=${expenseElemId}>
    ${expense.expenseamount} - ${expense.category} - ${expense.description}
    <button onclick='deleteExpense(event,${expense.id})'>
    Delete Expense </button>
    </li>
    `
}

function deleteExpense(event, expenseId) {
    event.preventDefault();
    const token=localStorage.getItem('token')
    // Send a DELETE request to the server to delete the expense
    axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseId}`,{headers:{"Authorization":token}})
      .then(response => {
        // Remove the expense element from the UI
        const expenseElement = document.getElementById(`expense-${expenseId}`);
        if (expenseElement) {
          expenseElement.remove();
        }
      })
      .catch(error => {
        showError(error);
      });
  }
  











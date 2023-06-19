

function addNewExpense(e){
    e.preventDefault();

const expenseDetails={
    expenseamount:e.target.expenseamount.value,
    description:e.target.description.value,
    category:e.target.category.value
   

}
console.log(expenseDetails)
axios.post('http://localhost:3000/expense/addexpense',expenseDetails).then((response) => {
    console.log(response.data.expense);
addNewExpensetoUI(response.data.expense)

}).catch(err=>showError(err))
}

window.addEventListener('DOMContentLoaded',()=>{
    axios.get('http://localhost:3000/expense/getexpenses').then(response=>{
        response.data.expenses.forEach(expense => {
            addNewExpensetoUI(expense);
            
        }).catch(err=>
            showError(err)
        )
    })
})

function addNewExpensetoUI(expense){
    const parentElement=document.getElementById('listOfExpenses');
    const expenseElemId=`expense-${expense.id}`;
    parentElement.innerHTML+=`
    <li id=${expenseElemId}>
    ${expense.expenseamount} - ${expense.category} - ${expense.description}
    <button onclick='deleteExpense(event,${expense.id})'>
    Delete expense </button>
    </li>
    `
}





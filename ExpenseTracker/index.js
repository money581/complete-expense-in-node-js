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
function showPremiumuserMessage(){
  document.getElementById('rzp-button1').style.visibility="hidden"
        document.getElementById('message').innerHTML="you are prime member now"
}
function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
} 

window.addEventListener('DOMContentLoaded', async () => {
    try {
      const token=localStorage.getItem('token')
      const decodeToken=parseJwt(token)
      //console.log(decodeToken);
      const isadmin = decodeToken.ispremiumuser
      if(isadmin){
      showPremiumuserMessage()
      showLeaderboard()
      }
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
  function showError(err){
    document.body.innerHTML+=`<div style="color:red;">$(err)</div>`
  }
function showLeaderboard(){
  const inputElement=document.createElement("input")
  inputElement.type="button"
  inputElement.value="Show Leaderboard"
inputElement.onclick=async()=>{
  const token=localStorage.getItem('token')
const userLeaderBoardArray=await axios.get('http://localhost:3000/premium/showLeaderBoard',{headers:{"Authorization":token}})
 var leaderboardElem=document.getElementById('leaderboard')
 leaderboardElem.innerHTML+='<h1> Leader Board </h1>'
 userLeaderBoardArray.data.forEach((userDetails)=>{
  leaderboardElem.innerHTML+=`<li>Name - ${userDetails.name} total Expense - ${userDetails.total_cost  } `
 })
}
document.getElementById('message').appendChild(inputElement)

}

  document.getElementById('rzp-button1').onclick=async function(e){
    const token=localStorage.getItem('token')
    const response=await axios.get('http://localhost:3000/purchase/premiummembership',{headers:{"Authorization":token}})
   // console.log(response);
    var options={
      "key":response.data.key_id,
      "order_id":response.data.order.id,
      "handler":async function(response){
        await axios.post('http://localhost:3000/purchase/updatetransactionstatus',{order_id:options.order_id, payment_id:response.razorpay_payment_id},{headers:{"Authorization":token}})
        alert('you are a premium user now')
        document.getElementById('rzp-button1').style.visibility="hidden"
        document.getElementById('message').innerHTML="you are prime member now"
      localStorage.setItem('token',res.data.token)
      // showLeaderboard()
      }
    }
 

  const rzp1=new Razorpay(options);
  rzp1.open();
  e.preventDefault();
  rzp1.on('payment.failed',function(response){
  //  console.log(response);
    alert('something went wrong')
  })
}










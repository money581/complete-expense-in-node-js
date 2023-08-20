let currentPage = 1;
let rowsPerPage = localStorage.getItem('rowsPerPage') ? localStorage.getItem('rowsPerPage') : 5;
let maxPages = 0;
function addNewExpense(e){
    e.preventDefault();

const expenseDetails={
    expenseamount:e.target.expenseamount.value,
    description:e.target.description.value,
    category:e.target.category.value
}
//console.log(expenseDetails)
const token=localStorage.getItem('token')
axios.post('http://16.171.170.233:3000/expense/addexpense',expenseDetails,{headers:{"Authorization":token}}).then((response) => {
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

// window.addEventListener('DOMContentLoaded', async () => {
//     try {
//       const token=localStorage.getItem('token')
//       const decodeToken=parseJwt(token)
//       //console.log(decodeToken);
//       const isadmin = decodeToken.ispremiumuser
//       if(isadmin){
//       showPremiumuserMessage()
//       showLeaderboard()
//       }
//       const response = await axios.get('http://16.171.170.233:3000/expense/getexpenses',{headers:{"Authorization":token}});
//       const expenses = response.data.expenses;
//       expenses.forEach(expense => {
//         addNewExpensetoUI(expense);
//       });
//     } catch (err) { 
//       showError(err);
//     }
//   });
async function getExpenses() {
  try {
      const token = localStorage.getItem('token');
      const decodeToken = parseJwt(token);
      const isadmin = decodeToken.ispremiumuser;
      if (isadmin) {
          showPremiumuserMessage();
          showLeaderboard();
      }
      const response = await axios.get(`http://16.171.170.233:3000/expense/getexpenses?page=${currentPage}&rows=${rowsPerPage}`, { headers: { 'Authorization': token } });
      document.getElementById('listOfExpenses').innerHTML = "";
      const { expenses, totalCount } = response.data;
      pagination(totalCount);

      if (expenses.length > 0) {
          for (let i = 0; i < expenses.length; i++) {
              addNewExpensetoUI(expenses[i]);
          }
      } else {
        throw new Error(response.data.message)
      }
  } catch (error) {
      console.log(error);
  }
}
  

function addNewExpensetoUI(expense){
    const parentElement=document.getElementById('listOfExpenses');
    const expenseElemId=`expense-${expense.id}`;
    const tableRow = document.createElement('tr');
    tableRow.id = expenseElemId;

    const amountCell = document.createElement('td');
    amountCell.textContent = expense.expenseamount;
    tableRow.appendChild(amountCell);

    const categoryCell = document.createElement('td');
    categoryCell.textContent = expense.category;
    tableRow.appendChild(categoryCell);

    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = expense.description;
    tableRow.appendChild(descriptionCell);

    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Expense';
    deleteButton.addEventListener('click', function(event) {
        deleteExpense(event, expense.id);
    });
    deleteCell.appendChild(deleteButton);
    tableRow.appendChild(deleteCell);

    parentElement.appendChild(tableRow);
}
document.addEventListener('DOMContentLoaded', getExpenses);

function deleteExpense(event, expenseId) {
    event.preventDefault();
    const token=localStorage.getItem('token')
    // Send a DELETE request to the server to delete the expense
    axios.delete(`http://16.171.170.233:3000/expense/deleteexpense/${expenseId}`,{headers:{"Authorization":token}})
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

  function download(){
   
    const token = localStorage.getItem('token');
    
    axios.get('http://16.171.170.233:3000/user/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 201){
            //the bcakend is essentially sending a download link
            //  which if we open in browser, the file would download
            var a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = 'myexpense.csv';
            a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        showError(err)
    });
}


function showLeaderboard(){
  const inputElement=document.createElement("input")
  inputElement.type="button"
  inputElement.value="Show Leaderboard"
inputElement.onclick=async()=>{
  const token=localStorage.getItem('token')
const userLeaderBoardArray=await axios.get('http://16.171.170.233:3000/premium/showLeaderBoard',{headers:{"Authorization":token}})
 var leaderboardElem=document.getElementById('leaderboard')
 leaderboardElem.innerHTML+='<h1> Leader Board </h1>'
 userLeaderBoardArray.data.forEach((userDetails)=>{
  //console.log(userDetails.total_cost);
  leaderboardElem.innerHTML+=`<li>Name - ${userDetails.name} total Expense - ${userDetails.totalExpenses } `
 })
}
document.getElementById('message').appendChild(inputElement)

}

  document.getElementById('rzp-button1').onclick=async function(e){
    const token=localStorage.getItem('token')
    const response=await axios.get('http://16.171.170.233:3000/purchase/premiummembership',{headers:{"Authorization":token}})
   // console.log(response);
    var options={
      "key":response.data.key_id,
      "order_id":response.data.order.id,
      "handler":async function(response){
        await axios.post('http://16.171.170.233:3000/purchase/updatetransactionstatus',{order_id:options.order_id, payment_id:response.razorpay_payment_id},{headers:{"Authorization":token}})
        alert('you are a premium user now')
        document.getElementById('rzp-button1').style.visibility="hidden"
        document.getElementById('message').innerHTML="you are prime member now"
      localStorage.setItem('token',response.data.token)
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


function pagination(totalCount) {
  maxPages = Math.ceil(totalCount / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(start + rowsPerPage - 1, totalCount);
  document.getElementById('page-details').textContent = `Showing ${start}-${end} of ${totalCount}`;

  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  prevBtn.style.display = currentPage > 1 ? 'block' : 'none';
  nextBtn.style.display = currentPage < maxPages ? 'block' : 'none';
}

function showChangedRows() {
  rowsPerPage = parseInt(event.target.value);
  localStorage.setItem('rowsPerPage', rowsPerPage);
  currentPage = 1; // Reset the current page to 1 when rows per page is changed
  getExpenses();
}

function showPreviousPage() {
  if (currentPage > 1) {
      currentPage--;
      getExpenses();
  }
}

function showNextPage() {
  if (currentPage < maxPages) {
      currentPage++;
      getExpenses();
  }
}

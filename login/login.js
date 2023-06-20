
function login(e){
    e.preventDefault(); 
    const loginDetails={
     email : e.target.email.value,
     password : e.target.password.value
    }
        axios.post('http://localhost:3000/user/login',loginDetails).then(response=>{
        //    console.log(response.data.message)
          alert(response.data.message) 
          localStorage.setItem('token',response.data.token)
          window.location.href="../ExpenseTracker/index.html"
         
}).catch(err=>{
console.log(JSON.stringify(err));
            document.body.innerHTML+=`<div style="color:red;">${err.message}<div>`;
        })
    }

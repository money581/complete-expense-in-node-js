const path = require('path');
const express = require('express');
const cors = require('cors');
var bodyParser = require("body-parser");
const userRoutes=require('./routes/user');
const User = require('./models/users');



const expenseRoutes = require('./routes/expense')

const app=express();
const dotenv=require('dotenv');
const sequelize = require('./util/database');
const Expense = require('./models/expenses');
dotenv.config();
app.use(cors());
User.hasMany(Expense);
Expense.belongsTo(User);
app.use(express.json())
app.use('/user',userRoutes);
app.use('/expense', expenseRoutes)



sequelize.sync()
.then(()=>{
    app.listen(3000)
}).catch(err=>{
    console.log(err);
});
const path = require('path');
const express = require('express');
const cors = require('cors');
var bodyParser = require("body-parser");
const userRoutes=require('./routes/user');
const User = require('./models/users');



const expenseRoutes = require('./routes/expense')
const Order = require('./models/orders');


const app=express();
const dotenv=require('dotenv');
const sequelize = require('./util/database');
const Expense = require('./models/expenses');
const purchaseRoutes = require('./routes/purchase')
const premiumFeatureRoutes = require('./routes/premiumFeature')
const resetPasswordRoutes = require('./routes/resetpassword')
const Forgotpassword = require('./models/forgotpassword');

dotenv.config();
app.use(cors());

app.use(express.json())
app.use('/user',userRoutes);
app.use('/expense', expenseRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/premium', premiumFeatureRoutes)
app.use('/password', resetPasswordRoutes);

const PORT=process.env.PORT ||3000

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);
sequelize.sync()
.then(()=>{
    app.listen(PORT)
    console.log(PORT);
}).catch(err=>{
    console.log(err);
});
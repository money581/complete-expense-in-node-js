const Expense = require('../models/expenses');
const User = require('../models/users');
const sequelize = require('../util/database');
// const addexpense = async (req, res) => {
//     const t= await sequelize.transaction();
//     const { expenseamount, description, category } = req.body;

//     if(expenseamount == undefined || expenseamount.length === 0 ){
//         return res.status(400).json({success: false, message: 'Parameters missing'})
//     }
    
//     Expense.create({ expenseamount, description, category, userId: req.user.id},{transaction:t}).then(expense => {
//         const totalExpense=Number(req.user.totalExpenses)+Number(expenseamount)
//         console.log(totalExpense);
//         User.update({
//             totalExpenses:totalExpense
          
//         },{
//             where:{id:req.user.id},
//             transaction:t
//          } ).then(async()=>{
//             await t.commit();
//             res.status(200).json({expense:expense} );
           
//          })
//          .catch(async(err)=>{
//            // console.log(err);
//           await t.rollback();
//             return res.status(500).json({success : false, error: err})
           
//          })
       
//     }).catch(async(err) => {
//        // console.log(err);
//        await t.rollback();
//         return res.status(500).json({success : false, error: err})
//         //console.log(error);
//     })
// }

// const getexpenses = (req, res)=> {
    
//     Expense.findAll({ where : { userId: req.user.id}}).then(expenses => {
//         return res.status(200).json({expenses, success: true})
//     })
//     .catch(err => {
//         console.log(err)
//         return res.status(500).json({ error: err, success: false})
//     })
// }
//convert async
const addexpense = async (req, res) => {
    try {
      const t = await sequelize.transaction();
      const { expenseamount, description, category } = req.body;
  
      if (expenseamount == undefined || expenseamount.length === 0) {
        return res.status(400).json({ success: false, message: 'Parameters missing' });
      }
  
      const expense = await Expense.create(
        { expenseamount, description, category, userId: req.user.id },
        { transaction: t }
      );
  
      const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);
      console.log(totalExpense);
  
      await User.update(
        {
          totalExpenses: totalExpense
        },
        {
          where: { id: req.user.id },
          transaction: t
        }
      );
  
      await t.commit();
      res.status(200).json({ expense: expense });
    } catch (err) {
      await t.rollback();
      console.log(err);
      return res.status(500).json({ success: false, error: err });
    }
  };
  
  const getexpenses = async (req, res) => {
    try {
      const expenses = await Expense.findAll({ where: { userId: req.user.id } });
      return res.status(200).json({ expenses, success: true });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err, success: false });
    }
  };
  

// const deleteexpense = (req, res) => {
//     const expenseid = req.params.expenseid;
//     if(expenseid == undefined || expenseid.length === 0){
//         return res.status(400).json({success: false, })
//     }
//     Expense.destroy({where: { id: expenseid, userId: req.user.id }}).then((noofrows) => {
//         if(noofrows === 0){
//             return res.status(404).json({success: false, message: 'Expense doenst belong to the user'})
//         }
//         return res.status(200).json({ success: true, message: "Deleted Successfuly"})
//     }).catch(err => {
//         console.log(err);
//         return res.status(500).json({ success: true, message: "Failed"})
//     })
// }


const deleteexpense = async (req, res) => {
    try {
      const expenseid = req.params.expenseid;
      
      if (expenseid == undefined || expenseid.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid expense ID' });
      }
      
      const expense = await Expense.findOne({ where: { id: expenseid, userId: req.user.id } });
      
      if (!expense) {
        return res.status(404).json({ success: false, message: 'Expense does not belong to the user' });
      }
      
      const deletedExpenseAmount = expense.expenseamount;
      const t = await sequelize.transaction();
      
      await Expense.destroy({ where: { id: expenseid, userId: req.user.id }, transaction: t });
      
      const user = await User.findOne({ where: { id: req.user.id } });
      const updatedTotalExpense = Number(user.totalExpenses) - Number(deletedExpenseAmount);
      
      await User.update(
        { totalExpenses: updatedTotalExpense },
        { where: { id: req.user.id }, transaction: t }
      );
      
      await t.commit();
      
      return res.status(200).json({ success: true, message: 'Expense deleted successfully' });
    } catch (err) {
      console.log(err);
      await t.rollback();
      return res.status(500).json({ success: false, message: 'Failed to delete expense' });
    }
  };
  module.exports = {
    deleteexpense,
    getexpenses,
    addexpense
}
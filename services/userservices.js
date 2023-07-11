const getExpenses = (req, where)=>{
    return req.user.getExpenses(where);
}
const countExpenses =(user,where)=>{
    return user.countExpenses(where);
}
 
module.exports ={
    getExpenses,
    countExpenses
}
const express = require('express');
const userController= require('../controllers/user')
const router=express.Router();
const expenseController = require('../controllers/expense')
const userauthentication = require('../middleware/auth')

router.post('/signup',userController.signup);
router.post('/login',userController.login);
router.get('/download',userauthentication.authenticate, expenseController.downloadExpense )

module.exports=router;
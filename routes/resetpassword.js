const express = require('express');

const resetpasswordController = require('../controllers/resetpassword');


const router = express.Router();

router.get('/updatepassword/:resetpasswordid', resetpasswordController.updatePassword)

router.get('/resetpassword/:id', resetpasswordController.resetPassword)

router.use('/forgotpassword', resetpasswordController.forgotPassword)

module.exports = router; 
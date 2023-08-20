const uuid = require('uuid');
const sib = require('sib-api-v3-sdk');
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const ForgotPassword = require('../models/forgotpassword');

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    //   const forgotpassword = new ForgotPassword({ active: true });

    //   // Generate a unique ID using uuid
    //   forgotpassword.id = uuid.v4();

    //  // console.log(forgotpassword);
    //   await forgotpassword.save();


    //   const id = forgotpassword.id;
    if (user) {
      const id = uuid.v4();
      user.createForgotpassword({ id, active: true })
        .catch(err => {
          throw new Error(err)
        })

      const client = sib.ApiClient.instance;
      const apiKey = client.authentications['api-key'];
      apiKey.apiKey = process.env.API_KEY;
      // console.log(process.env.API_KEY);
      const tranEmailApi = new sib.TransactionalEmailsApi();

      const sender = {
        email: 'amanagrawal581@gmail.com',
        name: 'yt'
      };
      const recievers = [
        {
          email: email,
        },
      ];

      tranEmailApi.sendTransacEmail({
        sender,
        to: recievers,
        subject: 'forgotpass please reset',
        textContent: `Follow the link and reset password`,
        htmlContent: `Click on the link below to reset password <br> <a href="http://16.171.170.233:3000/password/resetpassword/${id}">Reset password</a>`,
      }).then((response) => {
        return res.status(202).json({ success: true, message: "password mail sent Successful" });
      }).catch(err => console.log(err));
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};

exports.resetPassword = (req, res) => {
  const id = req.params.id;
  ForgotPassword.findOne({ where: { id } }).then(forgotpasswordrequest => {
    if (forgotpasswordrequest) {
      forgotpasswordrequest.update({ active: false });
      res.status(200).send(`<html>
                                  <script>
                                      function formsubmitted(e){
                                          e.preventDefault();
                                          console.log('called')
                                      }
                                  </script>

                                  <form action="/password/updatepassword/${id}" method="get">
                                      <label for="newpassword">Enter New password</label>
                                      <input name="newpassword" type="password" required></input>
                                      <button>reset password</button>
                                  </form>
                              </html>`
      )
      res.end()

    }
  })
}
exports.updatePassword = (req, res) => {

  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
    
    ForgotPassword.findOne({ where: { id: resetpasswordid } }).then(resetpasswordrequest => {
      User.findOne({ where: { id: resetpasswordrequest.userId } }).then(user => {
       // console.log('userDetails', user)
        if (user) {
          //encrypt the password

          const saltRounds = 10;
          bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) {
              console.log(err);
              throw new Error(err);
            }
            bcrypt.hash(newpassword, salt, function (err, hash) {
              // Store hash in your password DB.
              if (err) {
                console.log(err);
                throw new Error(err);
              }
              user.update({ password: hash }).then(() => {
                res.status(201).json({ message: 'Successfuly update the new password' })
              })
            });
          });
        } else {
          return res.status(404).json({ error: 'No user Exists', success: false })
        }
      })
    })
  } catch (error) {
    return res.status(403).json({ error, success: false })
  }

}

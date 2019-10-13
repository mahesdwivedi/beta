var express = require('express');
var router = express.Router();
var passport = require('passport');

// To return the user data to the client
router.get("/check", (req, res) => {

  if (req === undefined) {
    res.json({});
  } else {
    res.json({
      user: req.session.passport
    });
  }
});

// Navigating to auth/github provides us with option to sign in via github
router.get('/fitbit',
    passport.authenticate('fitbit', { scope: ['activity','heartrate','location','profile'] }
));
// The redirect url
router.get("/fitbit/success", (req, res) => {
    // For redirecting into the client app
    res.redirect("/algo");
  }
);

router.get('/fitbit/failure', (req, res) => {
    console.log(404)
})

router.get('/fitbit/callback', passport.authenticate( 'fitbit', { 
    successRedirect: '/auth/fitbit/success',
    failureRedirect: '/auth/fitbit/failure'
}));


// The API to log out, it clears req.user
router.get('/logout', function(req, res, next) {
  req.logout();
  res.json({ msg: "Logged out" });
});

module.exports = router;

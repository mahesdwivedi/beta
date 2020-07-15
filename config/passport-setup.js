const passport = require("passport");
var FitBitStrategy = require("passport-fitbit-oauth2").FitbitOAuth2Strategy;
const User = require("../models/user");
var axios = require("axios");

// Passport takes that user id and stores it internally on
// req.session.passport which is passport’s internal
// mechanism to keep track of things.
passport.serializeUser((user, done) => {
  done(null, user[0].id);
});

// makes a request to our DB to find the full profile information
// for the user and then calls done(null, user). This is where
// the user profile is attached to the request handler at req.user.
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    // This takes the profile info and attaches it on the request
    // object so its available on your callback url as req.user.
    done(null, user);
  });
});
// Implementing the passport github strategy
passport.use(
  new FitBitStrategy(
    {
      clientID: "22BL86",
      clientSecret: "90d58c00652cc1a257003a2e0a393133",
      callbackURL: "http://localhost:3000/auth/fitbit/callback"
    },
    function (accessToken, refreshToken, profile, done) {
      axios.interceptors.request.use(setToken => {
        let token = accessToken;
        setToken.headers.Authorization = `Bearer ${token}`;
        return setToken;
      });
      User.find({ fitbitId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);

module.exports = {};

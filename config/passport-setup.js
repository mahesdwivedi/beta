const passport = require("passport");
var FitBitStrategy = require("passport-fitbit-oauth2").FitbitOAuth2Strategy;
const User = require("../models/user");


// Passport takes that user id and stores it internally on 
// req.session.passport which is passport’s internal 
// mechanism to keep track of things.
passport.serializeUser((user, done) => {
  done(null, user.id);
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
      clientID: "22B645",
      clientSecret: "0fe01d68528bad127ca44c81eb28480c",
      callbackURL: "http://localhost:3000/auth/fitbit/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Callback method triggered upon signing in.
     console.log(profile)
      User.findOne({ fitbitId: profile.id }).then(currentUser => {
        if (currentUser) {
          // already have this user
          done(null, currentUser);
        } else {
          // if not, create user in our db
          new User({
            fitbitId: profile.id,
            username: profile.username,
            name: profile.displayName,
            auth: accessToken
          })
            .save()
            .then(newUser => {
              done(null, newUser);
            });
        }
      });
    }
  )
);

module.exports = {
  
}
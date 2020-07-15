var express = require("express");
var router = express.Router();
var passport = require("passport");
var axios = require("axios");
var cors = require("cors");

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
router.get(
  "/fitbit",
  cors(),
  passport.authenticate(
    "fitbit",
    {
      scope: [
        "activity",
        "heartrate",
        "location",
        "profile",
        "nutrition",
        "weight"
      ]
    },
    (req, res) => {
      console.log(req);
    }
  )
);
// The redirect url
router.get("/fitbit/success", (req, res) => {
  res.redirect("http://localhost:3001/admin/dashboard");
});

router.get("/fitbit/failure", (req, res) => {
  console.log(404);
});

router.get(
  "/fitbit/callback",
  passport.authenticate("fitbit", {
    successRedirect: "/auth/fitbit/success",
    failureRedirect: "/auth/fitbit/failure"
  })
);

router.get("/fitbit/success/perDayBurnt", (req, res) => {
  const date_ob = new Date();
  const date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  const today = year + "-" + month + "-" + date;
  axios
    .get(`https://api.fitbit.com/1/user/-/activities/date/${today}.json`)
    .then(calories => {
      res.send(calories.data);
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/fitbit/success/perMonthBurnt", (req, res) => {
  const date_ob = new Date();
  const date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  const today = year + "-" + month + "-" + date;
  axios
    .get(
      `https://api.fitbit.com/1/user/-/activities/calories/date/${today}/30d.json`
    )
    .then(calories => {
      res.send(calories.data);
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/fitbit/success/perMonthSteps", (req, res) => {
  const date_ob = new Date();
  const date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  const today = year + "-" + month + "-" + date;
  axios
    .get(
      `https://api.fitbit.com/1/user/-/activities/steps/date/${today}/30d.json`
    )
    .then(calories => {
      res.send(calories.data);
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/fitbit/success/perDaySteps", (req, res) => {
  const date_ob = new Date();
  const date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  const today = year + "-" + month + "-" + date;
  axios
    .get(
      `https://api.fitbit.com/1/user/-/activities/steps/date/${today}/1d.json`
    )
    .then(calories => {
      res.send(calories.data);
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/fitbit/success/perDayIntake", (req, res) => {
  const date_ob = new Date();
  const date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  const today = year + "-" + month + "-" + date;
  axios
    .get(`https://api.fitbit.com/1/user/-/foods/log/date/${today}.json`)
    .then(calories => {
      res.send(calories.data);
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/fitbit/success/heartRate", (req, res) => {
  const date_ob = new Date();
  const date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();

  const today = year + "-" + month + "-" + date;
  axios
    .get(
      `https://api.fitbit.com/1/user/-/activities/heart/date/${today}/30d.json`
    )
    .then(heartRate => {
      res.send(heartRate.data);
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/fitbit/success/perDayActivity", (req, res) => {
  const date_ob = new Date();
  const date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();

  const today = year + "-" + month + "-" + date;
  axios
    .get(
      `https://api.fitbit.com/1/user/-/activities/date/${today}.json`
    )
    .then(activity => {
      res.send(activity.data);
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/fitbit/success/profile", (req, res) => {
  axios
    .get("https://api.fitbit.com/1/user/-/profile.json")
    .then(profile => {
      res.send(profile.data);
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/fitbit/success/foods", (req, res) => {
  axios
    .get("https://api.fitbit.com/1/foods/units.json")
    .then(food => {
      res.send(food.data);
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/logout", function (req, res, next) {
  req.logout();
  console.log(req.user);
  res.redirect("http://localhost:3000/index.html")
});

module.exports = router;

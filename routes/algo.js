var express = require('express');
var router = express.Router();
const calorieData = require('../models/calorieData')
var axios = require('axios')

var avgCalBurnt,calorieIntake,foodValue;

router.post('/', function(req, res, next) {
    calorieIntake=req.body.calorieIntake;
    activityFactor=req.body.activityFactor;
    
    let newCalorieData = new calorieData(req.body);
    newCalorieData.save()
    .then(res.render('camera'))
    .catch((err) => console.log(err))
    });
  router.get('/', function(req, res, next) { 
    res.render('form');
  });
  

function bmiCalculator(height,weight){
    let bmi;
    bmi=weight/(height*height);
    return bmi;
}

function bmiCalculator(height,weight,age,activityFactor,sex){
    let bmr;
    if (sex=='male'){
        bmr=[(10*weight)+(6.25*height)-(5*age)-5]*activityFactor;
    }
    else{
        bmr=[(10*weight)+(6.25*height)-(5*age)-161]*activityFactor;
    }
    return bmi;
}

function choice(bmr,avgCalBurnt,calorieIntake,foodValue,suggestion){
    bmiValue=bmiCalculator(height,weight);
    if(suggestion==1){
        if((bmiValue)<18.25){
            let suggestedWeight;
            suggestedWeight=18.25*(height*height);
            if (sex=='male'){
                newBmr=[(10*suggestedWeight)+(6.25*height)-(5*age)-5]*activityFactor;
            }
            else{
                newBmr=[(10*suggestedWeight)+(6.25*height)-(5*age)-161]*activityFactor;
            }
        }
        else if(bmiValue>25){
            let suggestedWeight;
            suggestedWeight=18.25*(height*height);
            if (sex=='male'){
                newBmr=[(10*suggestedWeight)+(6.25*height)-(5*age)-5]*activityFactor;
            }
            else{
                newBmr=[(10*suggestedWeight)+(6.25*height)-(5*age)-161]*activityFactor;
            }
        }
        
    }
    else{
        newBmr=bmr;
    }
    let overallCalorie= calorieIntake-avgCalBurnt+foodValue;
    if(bmr>overallCalorie){
        return 0;
    }
    else{
        return 1;
    }
    
}

router.post("/camera", (req, res, next) => {
    let activityFactor=1.55;
    let calorieIntake=1000;
    axios({
        method: 'get',
        url: "https://api.fitbit.com/1/user/6PSSYP/activities/tracker/calories/date/2019-8-12/7d.json",
        headers: {authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMkI2NDUiLCJzdWIiOiI2UFNTWVAiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJ3aHIgd3BybyB3YWN0IHdsb2MiLCJleHAiOjE1NzA5MzI5MjMsImlhdCI6MTU3MDkwNDEyM30.Wut1GrUK7JmyGyYtmeFC5orPyfBnhcyEcGENOzi7cdE'}
    }).then(res => console.log(res.data)).catch(err => console.log(err)) 
    })

router.get('/camera', function(req, res, next) {
    res.render("camera");
  });

  module.exports = router;
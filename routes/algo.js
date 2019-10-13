var express = require('express');
var router = express.Router();
const calorieData = require('../models/calorieData')
var fs = require("fs")
var axios = require("axios")

router.post('/', function(req, res, next) {
    res.render('camera');
    });
  router.get('/', function(req, res, next) { 
    res.render('form');
  });
  

function bmiCalculator(height,weight){
    let bmi;
    bmi=weight*10000/(height*height);
    return bmi;
}

function bmrCalculator(height,weight,age,activityFactor,sex){
    let bmr;
    if (sex=='MALE'){
        bmr=[(10*weight)+(6.25*height)-(5*age)-5]*activityFactor;
    }
    else{
        bmr=[(10*weight)+(6.25*height)-(5*age)-161]*activityFactor;
    }
    return bmr;
}

function choice(avgCalBurnt,calorieIntake,foodValue,age,suggestion,height,weight,sex,activityFactor){
    bmr=bmrCalculator(height,weight,age,activityFactor,sex);
    bmiValue=bmiCalculator(height,weight);
    console.log(bmr+"bmr"+bmiValue+"bmi");
    if(suggestion==1){
        if((bmiValue)<18.25){
            let suggestedWeight;
            suggestedWeight=18.25*(height*height)/10000;
            console.log(suggestedWeight);
            if (sex=='MALE'){
                newBmr=[(10*suggestedWeight)+(6.25*height)-(5*age)-5]*activityFactor;
            }
            else{
                newBmr=[(10*suggestedWeight)+(6.25*height)-(5*age)-161]*activityFactor;
            }
        }
        else if(bmiValue>25){
            let suggestedWeight;
            suggestedWeight=25*(height*height)/10000;
            console.log(suggestedWeight);
            if (sex=='MALE'){
                newBmr=[(10*suggestedWeight)+(6.25*height)-(5*age)-5]*activityFactor;
            }
            else{
                newBmr=[(10*suggestedWeight)+(6.25*height)-(5*age)-161]*activityFactor;
            }
        }
        
    }
    else{
        newBmr=bmr;
        console.log(newBmr);
    }
    let overallCalorie= calorieIntake-avgCalBurnt+foodValue;
    if(bmiValue<18.25){
    if(suggestion==0){
        return 0;
    }
    else if(newBmr>overallCalorie){
        console.log("nbmr");
        console.log(newBmr);
        console.log(overallCalorie);
        return 1;
    }
    else{
        return 0;
    }}
    if(bmiValue>25){
        console.log("nbmr");
        console.log(newBmr);
        console.log(overallCalorie);
        if(suggestion==0){
            return 1;
        }
    else if(newBmr>overallCalorie){
        
        return 0;
    }
    else{
        return 1;
    }}

    
}

router.post("/camera", (req, res, next) => {
    axios({
        url: "http://api.foodai.org/v1/classify?image_url=https://currypoint2go.com/wp-content/uploads/2016/01/tava_roti.jpg&num_tag=5&api_key=51ef41867f59fbf727f665a89cdc284d09c9b4e8"
    }).then(res => {
        console.log(res)
    })
    var userProfileData = JSON.parse(fs.readFileSync('userProfile.json', 'utf8'));
    let height = userProfileData.user.height;
    console.log(height)
    let weight=1;
    let bmi=bmiCalculator(height,weight);
   
    if(bmi<18.25){
        res.redirect('/algo/underweight');
    }
    else if(bmi>25){
        res.redirect('/algo/overweight');
    }
    else{
        res.redirect('/algo/normal');
    }
   
})

router.get('/underweight', function(req, res, next) {
    res.render("underweight");
  });

  router.get('/overweight', function(req, res, next) {
    res.render("overweight");
  });

  router.get('/normal', function(req, res, next) {
    res.render("normal");
  });

  router.post('/suggestionHandler', function(req, res, next) {
    var userProfileData = JSON.parse(fs.readFileSync('userProfile.json', 'utf8'));
    let suggest=req.body.suggestion;
    let calorieIntake=1000;
    let height=userProfileData.user.height;
    let weight=1;
    let sex= userProfileData.user.gender;
    let calorieBurnt= 230;
    let activityFactor1=1.33;
    let foodValue=250;
    let age=userProfileData.user.age;
    let answer= choice(calorieBurnt,calorieIntake,foodValue,age,suggest,height,weight,sex,activityFactor1);
    res.render('result', {
        "datas": answer
      });
  });
  router.get('/result', function(req, res, next) {
    res.render("result");
  });

  router.post('/normal', function(req, res, next) {
    res.render("normal");
  });


router.get('/camera', function(req, res, next) {
    res.render("camera");
  });

  module.exports = router;
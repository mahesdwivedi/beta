var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var calorieSchema = new Schema({
    calorieIntake : { type: String, default: 'username' },
    activityFactor : { type: String, default: 'name' },
    created_at: Date
    
});
var calorieData = mongoose.model('calorieData', calorieSchema);
module.exports= calorieData;

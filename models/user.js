const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Apply the passport-local-mongoose plugin
// (If you get an object error here, use passportLocalMongoose.default instead)
userSchema.plugin(passportLocalMongoose.default);

module.exports = mongoose.model('User', userSchema);

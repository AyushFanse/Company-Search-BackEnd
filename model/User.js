const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//*---------------------------* Schema for User Data *---------------------------*//

const userSchema = new Schema({ 
    password:{
        type : String,
        required : true,
        minLength: 5
    },
    email:{
        type : String,
        required : true,
        lowercase: true,        
        unique : true
    }
})

//*---------------------------* Exporting Part*---------------------------*//

const User = mongoose.model('User' ,userSchema ,'Users' );
module.exports = User;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//*---------------------------* Schema for User Data *---------------------------*//

const companySchema = new Schema({ 
    company_name:{
        type : String,
        required : true
    },
    team:[{
        contact_title:{
            type : String,
            required : true
        },
        first_name:{
            type : String,
            required : true
        },
        last_name:{
            type : String,
            required : true
        },
        position:{
            type : String,
            required : true
        },
        email:{
            type : String,
            required : true
        },
        contact_number:{
            type : String,
            required : true,
            minLength: 10
        },
        primary:{
            type : Boolean
        },
        index:{
            type : Number
        }
    }],
    company_notes:{
        type : String,
        required : true
    },
    address:[{
        address_title:{
            type : String,
            required : true
        },
        line:{
            type : String,
            required : true
        },
        index:{
            type : Number
        },
        primary:{
            type : Boolean
        }
    }],
    city:{
        type : String,
        required : true
    },
    state:{
        type : String,
        required : true
    },
    zip_code:{
        type : Number,
        required : true
    },
    country:{
        type : String,
        required : true
    }
}, {timestamps: true})

//*---------------------------* Exporting Part *---------------------------*//

const Company = mongoose.model('Company' ,companySchema ,'Company' );
module.exports = Company;
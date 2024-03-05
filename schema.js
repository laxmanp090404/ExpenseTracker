// mongodb is schemaless but schema is required for proper data organisation

//we define using mongoose 
const mongoose = require('mongoose');
//schema definition
const expenseTrackerSchema = new mongoose.Schema({
    amount:{
       type: Number
    },
    category: {
        type:String
    },
    date:{
        type:String
    }
});
//model is expense used to access db ans is like view in sql
// .model(collectionname,schema);
const Expense = mongoose.model('expensedetails',expenseTrackerSchema);
//export to use in other files
module.exports = {Expense}
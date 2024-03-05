//package-lock and node modules should not be pushed
//.gitignore is used to store these files to be ignored
const express = require("express");
//bodyparser used to translate the req.bpdy into recognisable node js component
const bodyParser = require("body-parser");
//cors is used to prevent cors error from react
const cors = require('cors');
//Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.
//It manages relationships between data, provides schema validation,
//and is used to translate between objects in code and the representation of those objects in MongoDB.
const mongoose = require("mongoose");

//importing expense model which is like a view in sql
const { Expense } = require("./schema.js");
//creation of node application
const app = express();
// .use is middlewares
app.use(bodyParser.json());
app.use(cors());
async function connectToDb() {
  try {
    const url =
      "mongodb+srv://laxmanpanjalingam2004:sairam@cluster0.5snroxx.mongodb.net/ExpenseTracker?retryWrites=true&w=majority&appName=Cluster0";
    //  /databasename?
    //paste the connect driver url
    //mongoose.connect is asynchronous function
    await mongoose.connect(url);
    console.log("DB IS CONNECTED");
    //it will use available port in environment
    //const x = process.env.PORT;
    const port = process.env.PORT || 7000;
    app.listen(port, () => {
      console.log(`Application is running successfully at port ${port}`);
    });
  } catch (error) {
    console.log("error");
    console.log("Couldn't establish connection");
  }
}
//function call
connectToDb();
//add expense api
app.post("/add-expense", async (req, res) => {
  //res should be send as successful or failure
  try {
    await Expense.create({
      amount: req.body.amount,
      category: req.body.category,
      date: req.body.date,
    });
    res.status(201).json({ status: "success", message: "new expense added" });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "failed to create entry",
    });
  }
});

//get expense api
app.get("/get-expense", async (req, res) => {
  try {
    const currAllExpense = await Expense.find();
    res.status(200).json(currAllExpense);
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "failed to create entry",
    });
  }
});

//delete api
//we use delete req type and we get id of object created from ui and delete it.
//instead of appending in req body we use parameters
//http://localhost:7000/delete-expense/idofobject  this is method of params
//.delete("/delete-expense/:id")
app.delete("/delete-expense/:id", async (req, res) => {
  try {
    //FIRST CHECK IF IT EXISTS
  const expdata = await Expense.findById(req.params.id);
  if (expdata) {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `deleted entry with id ${req.params.id}` });
  } else {
    res.status(404).json({message:`Document with id ${res.params.id} not found`});
  }
  
}
catch (error) {
    res.status(500).json({
      message:"couldnt delete error",
      error : `${error}`
    })
  }});


  //UPDATE
  //USE BOTH BODY AND PARAMS
  //params for id update for data
  //for update we need id of element and new data

  app.patch('/edit-expense/:id',async(req,res)=>{
       try {
           const expdata =await Expense.findById(req.params.id);
           if(expdata){
                 //update the data using expdata
                 await expdata.updateOne({
                  "amount":req.body.amount,
                  "category":req.body.category,
                  "date":req.body.date
              });
              res.status(200).json({
                status:"success",
                message:"updated entry"
              })
           }
           else{
                 res.status(404).json({status:"failure",message:"not able to update"});
           }
       } catch (error) {
        res.status(500).json({
          status: "failure",
          message: "failed to update entry",});
       }
  })
  
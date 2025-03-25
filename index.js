const express = require('express');
const { resolve } = require('path');
const mongoose = require("mongoose");
const MenuItem = require("./MenuItem")
require("dotenv").config();

const app = express();
app.use(express.json());
const port = 3010;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.put("/menu/:id",async(req,res)=>{
  const id = req.params.id;
  const menuItem = await MenuItem.findByIdAndUpdate(id, req.body, {new: true});
  res.json(menuItem);
})
app.delete("/menu/:id",async(req,res)=>{
  try {
    const id = req.params.id;
  const deleteItem = await MenuItem.findByIdAndDelete(id);
  if(!deleteItem){
    res.status(400).json({message:"The item was not found"});
  }
  res.status(200).json({message:"The item is deleted successfully"});
  } catch (error) {
    res.status(500).json({message:"Error in deleteing the Menu Item"})
  }
})

app.post("/menu",async(req,res)=>{
  try {
    const {name,description,price} = req.body;
    if(!name || !price){
      return res.status(400).json({ message: "Please fill in all required fields" });
    }
    const newMenuItem = new MenuItem({
      name,
      price,
      description
      });
      const savedMenuItem = await newMenuItem.save();
      res.status(201).json({ message: "Item added successfully", menuItem: savedMenuItem });
  } catch (error) {
    res.status(500).json({ message: "Error creating new item", error: error.message })
  }
})
mongoose.connect(process.env.MONGODB_URL,{
  useNewUrlParser : true,
  useUnifiedTopology : true
})
.then(()=>console.log("The database is connected successfully"))
.catch(err => console.log("Error connecting MongoDB database",err))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

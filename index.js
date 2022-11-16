const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/Date.js");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb+srv://admin-deb:admin-deb@cluster0.kmq4fwh.mongodb.net/todolistDB");

let items = [];
let works = [];
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saterday"];

const Item = mongoose.model('Item', { name: {type: String, required: true} });

const item = [{ name: "Open Book" }, { name : "Look at the Book" }, { name: "Read Book" }];

const List = mongoose.model('List', { name: String, items: [{ name: {type: String, required: true} }] });

app.get("/:domains", function(req, res){
    const domainName = _.capitalize(req.params.domains);

    List.findOne({name: domainName}, function(err, results){

        if(!err){
            if(!results){
                // create a new list
                const list = new List({
                    name: domainName,
                    items: item
                });
            
                list.save();
                res.redirect("/"+domainName);
            }
            else{
                // render the list
                res.render("index", {keyDay: results.name, addNewItems: results.items});
            }
        }

    });
    
});

app.get("/", function(req, res){

    const formattedDate = date.getDate();

    Item.find({}, function(err, newItem){

        if(newItem.length === 0){
            Item.insertMany(item, (err) => {
                if(err){
                    console.log(err);
                } else{
                    console.log("Successfully Added to the Database.");
                }
            });
            res.redirect("/");
        } else {
            res.render("index", {keyDay: formattedDate, addNewItems: newItem});
        }
    });
});

app.get("/work", function(req, res){
    res.render("work", {keyDay: "Work", addNewItems: works});
});

app.post("/", function(req, res){
    const value = req.body.newItem;
    const name = req.body.add;

    if(name === date.getDate()){
        let newItem = new Item({name: req.body.newItem});
        newItem.save();
        res.redirect("/");
    }
    else{
        List.findOne({name: name}, function(err, foundList){
            foundList.items.push({name: value});
            foundList.save();
            res.redirect("/"+name);
        });
    }
});

app.post("/delete", function(req, res){
    const itemID = req.body.checkbox;
    const itemTitle = req.body.hiddenOne;

    if(itemTitle == date.getDate()){
        Item.findByIdAndRemove(itemID, function(err){
            if(!err) { console.log("Successfully Deleted!"); res.redirect("/"); }
        });
    }
    else{
        List.findOneAndUpdate({name: itemTitle}, {$pull: {items: {_id: itemID}}}, function(err, foundList){
            if(!err) { res.redirect("/"+itemTitle); }
        });
    }
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.");
});
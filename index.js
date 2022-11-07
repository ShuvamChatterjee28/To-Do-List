const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/Date.js");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

let items = ["Buy Food", "Cook Food", "Eat Food"];
let works = [];
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saterday"];

app.get("/", function(req, res){

    const formattedDate = date.getDate();

    res.render("index", {keyDay: formattedDate, addNewItems: items});
});

app.get("/work", function(req, res){
    res.render("work", {keyDay: "Work", addNewItems: works});
});

app.post("/", function(req, res){
    //console.log(req.body.add);

    if(req.body.add === "index"){
        items.push(req.body.newItem);
        res.redirect("/");
    }
    else if(req.body.add === "work"){
        works.push(req.body.newItem);
        res.redirect("/work");
    }
    
});

app.listen(3000, function(){
    console.log("Server is running on port 3000.");
});
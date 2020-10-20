var express = require('express');
var app = express();
var port = process.env.PORT || 0909;
var bodParser = require('body-parser');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient
var mongourl = "mongodb+srv://admin:admin28@09@srfoodcourt.1zmep.mongodb.net/edurekazomato?retryWrites=true&w=majority";
var cors = require('cors');
var db;

app.use(cors());

app.get('/',(req,res) => {
    res.send(``)
});
//health check
app.get('/health',(req,res) => {
    res.send("Api is working")
});
//list of city
app.get('/location', (req,res)=>{
    db.collection('location').find({}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)
    })
})
//list of meal type
app.get('/mealtype', (req,res)=>{
    db.collection('mealType').find({}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)
    })
})
//list of cuisine
app.get('/cuisine', (req,res)=>{
    db.collection('cuisine').find({}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)
    })
})
//restaurents   restaurents?city=4
app.get('/restaurents',(req,res) => {
    var query = {};
    if(req.query.city){
        query={city:req.query.city}
    }else if(req.query.mealtype){
        query={city:req.query.mealtype}
    }
    else{
        query={}
    }
    db.collection('restaurent').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})
//list of meal order
app.get('/order', (req,res)=>{
    db.collection('order').find({}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result)
    }) 
})
MongoClient.connect(mongourl,(err,connection) => {
    if(err) throw err;
    db = connection.db('edurekazomato');
    app.listen(port,(err) => {
        if(err) throw err;
        console.log(`Server is running on port ${port}`)
    })
})

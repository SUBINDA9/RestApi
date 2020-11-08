var express = require('express');
var app = express();
const path = require('path');
var port = process.env.PORT || 0909;
const http = require('http');
var bodParser = require('body-parser');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient
var mongourl = "mongodb+srv://admin:admin28@09@srfoodcourt.1zmep.mongodb.net/edurekazomato?retryWrites=true&w=majority";
var cors = require('cors');
var db;

app.use(cors());



app.use(express.static(path.join(__dirname,'build')));

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'build/index.html'))
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

//restaurents   restaurantDetails/1
app.get('/restaurentsDetails/:id',(req,res) => {
    console.log(req.params.id)
    var query = {_id:req.params.id}
    db.collection('restaurent').find(query).toArray((err,result) => {
        res.send(result)
    })
})



//placeorder
app.post('/placeorder',(req,res) => {
    db.collection('order').insertOne(req.body,(err,result) => {
        if(err){
            throw err
        }else{
            res.send('Data Added')
        }
    })
});

///Listing Page Api
app.get('/restaurantlist/:mealtype', (req,res) => {
    var query = {"type.mealtype":req.params.mealtype};
    var sort = {cost:-1}
    if(req.query.city && req.query.sort){
        query={"type.mealtype":req.params.mealtype,"city":req.query.city}
        sort = {cost:Number(req.query.sort)}
    }else if(req.query.cuisine  && req.query.sort){
        query={"type.mealtype":req.params.mealtype,"Cuisine.cuisine":(req.query.cuisine)}
        sort = {cost:Number(req.query.sort)}
    }else if(req.query.lcost && req.query.hcost && req.query.sort){
        query={"type.mealtype":req.params.mealtype,"cost":{$lt:parseInt(req.query.lcost),$gt:parseInt(req.query.hcost)} }
        sort = {cost:Number(req.query.sort)}
    }else if(req.query.city){
        query={"type.mealtype":req.params.mealtype,"city":req.query.city}
    }else if(req.query.cuisine){
        query={"type.mealtype":req.params.mealtype,"Cuisine.cuisine":(req.query.cuisine)}
    }else if(req.query.lcost && req.query.hcost){
        query={"type.mealtype":req.params.mealtype,"cost":{$lt:parseInt(req.query.lcost),$gt:parseInt(req.query.hcost)} }
    }
    else if(req.query.sort){
        query={"type.mealtype":req.params.mealtype}
        sort={cost:Number(req.query.sort)}
    }
    db.collection('restaurent').find(query).sort(sort).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
});

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

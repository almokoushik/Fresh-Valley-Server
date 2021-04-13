const express=require("express")
const cors=require("cors")
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const { ObjectID, ObjectId } = require("bson");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kar2i.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app=express()
app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
    res.send("This is Backend")
})


client.connect(err => {
    const databaseCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION);
    const databaseCollection2 = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION_2);

    app.post("/addItem",(req,res)=>{
        const newItem=req.body
        console.log(newItem)
        databaseCollection.insertOne(newItem)
        .then(result=>{
            console.log(result.insertedCount);
            res.send(result.insertedCount>0)
        })
        .catch(err=>{
            console.log(err)
        })
    })

    app.post("/addCartItem",(req,res)=>{
        databaseCollection2.insertOne(req.body)
        .then(result=>{
            console.log(result.insertedCount)
            res.send(result.insertedCount>0)
        })
        .catch(err=>console.log(err))
    })

    app.get("/posts",(req,res)=>{
        databaseCollection.find({}).toArray((err,result)=>{
            res.send(result)
        })
    })
    app.get("/orders/:email",(req,res)=>{
        databaseCollection2.find({ email: req.params.email }).toArray((error,result)=>{
            res.send(result)
        })
    })
    app.delete("/delete/:id",(req,res)=>{
        databaseCollection.deleteOne({ _id: ObjectID(req.params.id) })
        .then(result=>{
            console.log(result.deletedCount)
            res.send(result.deletedCount>0)

        })
        .catch(err=>{
            console.log(err)
        })       
    })
    app.get("/post/:id", (req, res) => {
        databaseCollection.find({_id:ObjectID(req.params.id)})
        .toArray((err,result)=>{
            res.send(result[0])
        })
    })
});

app.listen(5500,()=>console.log("Listening to port 5500"))
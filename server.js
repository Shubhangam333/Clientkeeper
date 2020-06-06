const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const port = 3000;

const mongojs = require('mongojs');
const db = mongojs('clientKeeper',['clients']);

//Set static folder
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());

//Allow request from agular
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With, Content-Type');
    next();
})

app.get('/',(req,res)=>{
    res.send('Please Use /api/clients');
});

//Get clients
app.get('/api/clients',(req,res,next)=>{
    db.clients.find().sort({first_name:1},(err,clients)=>{
        if(err){
            res.send(err);
        }
        res.json(clients);
    })
});
//Post Request
app.post('/api/clients',(req,res)=>{
    db.clients.insert(req.body,(err,client)=>{
      if(err){
          res.send(err);
      }
      res.json(client);
    })
})

//Update Client
app.put('/api/clients/:id',(req,res)=>{
    const id = req.params.id;
    db.clients.findAndModify({query:{_id: mongojs.ObjectId(id)},
      update:{
          $set:{
              first_name:req.body.first_name,
              last_name:req.body.last_name,
              email:req.body.email,
              phone:req.body.phone
          }},
          new:true
        },(err,client)=>{
            res.json(client);
        })
    })
//Delete Client
app.delete('/api/clients/:id',(req,res,next)=>{
    const id = req.params.id;
    db.clients.remove({_id:mongojs.ObjectId(id)},(err,client)=>{
      if(err){
          res.send(err);
      }
      res.json(client);
    })
})    

app.listen(port,()=>{
    console.log('Server started on port' + port);
})
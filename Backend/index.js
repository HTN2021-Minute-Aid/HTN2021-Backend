require('dotenv').config()
const FirebaseHandler = require('./firebaseHandler.js')
const express = require('express')
const bodyParser  = require('body-parser');

const PORT = process.env.PORT || 3000;
const app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));

app.post("/transcripts/add", async function(req, res){
    const response = await FirebaseHandler.addTranscript(req)
    res.status(response.status).send(response.resObj)
})

app.delete("/transcripts/delete", async function(req, res){
    const response = await FirebaseHandler.removeTranscript(req)
    res.status(response.status).send(response.resObj)
})

app.post("/users/transcripts", async function(req, res){
    const response = await FirebaseHandler.getTranscriptsFromUser(req)
    res.status(response.status).send(response.resObj)
})

app.post("/users/transcripts/content", async function(req, res){
    const response = await FirebaseHandler.getTranscriptContent(req)
    res.status(response.status).send(response.resObj)
})

app.listen(PORT, function() {
    console.log(`Listening on port ${PORT}`)
})
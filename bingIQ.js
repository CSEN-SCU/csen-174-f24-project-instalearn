//import http from 'http';
import express from "express";
//import path from 'path';
const app = express();
var port = 8000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
 });

 app.get('/search', (req, res) => {
    res.sendFile('bingIQ.html', {root:'public'});
 });

app.listen(port, function () {
    console.log('Starting the Node.js server for this sample. Navigate to http://localhost:'+port+'/ to view the webpage.');
});


//import http from 'http';
import express from "express";
import { getVocabCard, addSet, getVocabSet } from './vocabController.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
const app = express();
var port = 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname,'public/search-results.html'));
// });
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/getVocabularyCard', getVocabCard);
app.get('/getVocabularySet', getVocabSet);
app.post('/addSet', addSet);
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.listen(port, function () {
    console.log('Starting the Node.js server for this sample. Navigate to http://localhost:'+port+'/ to view the webpage.');
});


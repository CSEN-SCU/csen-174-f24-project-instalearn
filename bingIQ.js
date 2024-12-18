//import http from 'http';
import express from "express";
import { getVocabCard, addSet, getVocabSet, getUserSets, addCardToSet, deleteCard, deleteSet } from './vocabController.js';
import bodyParser from "body-parser";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

// Middleware to verify the ID token
async function authenticate(req, res, next) {
  //console.log("Headers in authenticate middleware:", req.headers); // Debug
  const idToken = req.headers["authorization"]?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).send("Unauthorized");
  }

  try {
    if (idToken != "userid1"){
      console.log(idToken);
      const decodedToken = await getAuth().verifyIdToken(idToken);
      req.user = {uid: decodedToken.uid}; // Attach user info to request
    }
    else{
      req.user = {uid: idToken};
    }
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).send("Unauthorized");
  }
}

// initializeApp({
//   credential: cert(serviceAccount),
// });


const app = express();
var port = 8000;

app.use(cors());
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Protected route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Serve static files (e.g., index.html)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

//log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Route to verify ID token from the client
app.post("/verify-token", async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid; // Extract user ID
    res.status(200).json({ message: "Authenticated", userId });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).send({ error: "Unauthorized" });
  }
});

app.get("/app", authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('/getVocabularyCard', getVocabCard);
app.get('/getVocabularySet', authenticate, getVocabSet);
app.get('/getUserSets', authenticate, getUserSets);
app.post('/addSet', authenticate, addSet);
app.post('/addCardToSet', authenticate, addCardToSet);
app.post('/deleteCard', authenticate, deleteCard);
app.post('/deleteSet', authenticate, deleteSet);
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/search', (req, res) => {
  res.sendFile('bingIQ.html', {root:'public'});
});

// Start the server
app.listen(port, () => console.log("Server running on http://localhost:8000"));

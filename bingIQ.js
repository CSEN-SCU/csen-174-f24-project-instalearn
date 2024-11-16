//import http from 'http';
import express from "express";
import bodyParser from "body-parser";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import path from "path";

// Initialize Firebase Admin SDK

// THIS IS THE PROBLEM LINE IN QUESTION
import serviceAccount from "./creds.json"; // Update path to your Firebase service account key
//sorry to yell I just wanted to make it obvious

initializeApp({
  credential: cert(serviceAccount),
});

// Middleware to verify the ID token
async function authenticate(req, res, next) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.user = decodedToken; // Attach user info to request
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).send("Unauthorized");
  }
}

//import path from 'path';
const app = express();
var port = 8000;

app.use(bodyParser.json());

// Serve static files (e.g., index.html)
app.use(express.static(path.join(__dirname, "public")));

/*app.get('/', (req, res) => {
    res.sendFile('index.html');
 });*/

/*app.listen(port, function () {
    console.log('Starting the Node.js server for this sample. Navigate to http://localhost:'+port+'/ to view the webpage.');
});*/


// Route to verify ID token from the client
app.post("/verify-token", async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    res.status(200).send({ message: "Authenticated", user: decodedToken });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).send({ error: "Unauthorized" });
  }
});

// Protected route
app.get("/", authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, "protected", "index.html"));
});

app.get('/search', (req, res) => {
  res.sendFile('bingIQ.html', {root:'public'});
});

// Start the server
app.listen(8000, () => console.log("Server running on http://localhost:8000"));

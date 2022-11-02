const express = require('express');
const path = require('path');
const fs = require("fs");
const uniqid = require ('uniqid');
const notesDatabase = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//senD to homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//send to notes html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes',(req,res)=> {
  res.json(notesDatabase);
});

app.post('/api/notes', (req, res) => {
  const note = req.body;
  note.id = uniqid();
  notesDatabase.push(note);
  fs.writeFile(
  './db/db.json',
  JSON.stringify(notesDatabase, null, 4),
  (err) => {
    err ? console.log(err) : res.send(note)
})
});

//delete the notesdatabase
app.delete('/api/notes/:id', (req, res) => {
  let noteId = req.params.id.toString();
  let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  const newNote = data.filter( note => note.id.toString() !== noteId );
  fs.writeFile('./db/db.json', JSON.stringify(newNote),err => {
    if (err) throw err;
    return true;
});
    res.json(newNote);
});

//send to homepage whenever we receive a GET request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

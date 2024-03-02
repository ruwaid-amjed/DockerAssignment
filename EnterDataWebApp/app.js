const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();


const connection = mysql.createConnection({
  host: 'mysql', 
  user: 'root', 
  password: 'Pirate65',
  database: 'enter_data_db'
});

connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});



// Body parser middleware should come before the route handlers
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const form = `
      <h1>Enter Data</h1>
      <form action="/submit-data" method="post">
        <input type="text" name="data" placeholder="Enter some data here" />
        <button type="submit">Submit</button>
      </form>
    `;
    res.send(form);
  } );

app.post('/submit-data',(req, res) => {
  const data = req.body.data;
  
  connection.query('INSERT INTO data_entries1 (data) VALUES (?)', [data], (error, results, fields) => {
    if (error) {
      res.status(500).send('Error saving data');
      return console.error(error.message);
    }
    console.log('Data Inserted:', results.insertId);
    res.send('Data received and stored!');
  });
});

app.listen(3000, () => {
  console.log('Enter Data service running on port 3000');
});

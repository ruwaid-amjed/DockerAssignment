
const express = require('express');
const session = require('express-session');
const MongoClient = require('mongodb').MongoClient;
const app = express();


// Set EJS as the view engine
app.set('view engine', 'ejs');

// MongoDB URL
const mongoUrl = 'mongodb://root:Pirate65@mongodb:27017';

app.get('/', async (req, res) => {

    try {
      const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
      const db = client.db('analytics_db');
      const statistics = await db.collection('statistics').find({}).toArray();
      client.close();

      res.render('index', { statistics });
    } catch (error) {
      console.error('Database connection error:', error);
      res.status(500).send('Error connecting to the database');
    }
  });

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Show Results app listening at http://localhost:${port}`);
});

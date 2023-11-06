const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./API Routes/UserRoutes'); 
const thoughtRoutes = require('./API Routes/thoughtRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/socialNetworkDB')
  .then(() => {
    console.log("Connected to MongoDB.");
  })
  .catch(err => {
    console.error("Could not connect to MongoDB.", err);
  });



mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});


app.use('/api/users', userRoutes);
app.use('/api/thoughts', thoughtRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


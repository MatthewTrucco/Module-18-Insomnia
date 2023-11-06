
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Thought = require('../models/Thought');


router.get('/', async (req, res) => {
  try {
    console.log('Attempting to find users...');
    const users = await User.find({}); // Temporarily removed populate for debugging purposes
    console.log('Users found:', users);
    res.json(users);
  } catch (err) {
    console.error('Error finding users:', err);
    res.status(500).send(err.message); // This will send the error message to the client
  }
});


router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('thoughts').populate('friends');
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});


router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).send(err);
  }
});


router.put('/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(400).send(err);
  }
});


router.delete('/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
 
    await Thought.deleteMany({ _id: { $in: user.thoughts } });
    res.send({ message: 'User and associated thoughts deleted' });
  } catch (err) {
    res.status(500).send(err);
  }
});


router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(400).send(err);
  }
});


router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;

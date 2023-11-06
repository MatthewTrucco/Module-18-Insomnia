const express = require('express');
const router = express.Router();
const Thought = require('../models/Thought');
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    console.log("GET ROUTE")
    const thoughts = await Thought.find({});
    console.log(thoughts, "thoughts")
    res.json(thoughts);
  } catch (err) {
    console.log(err, "err")
    res.status(500).json(err);
  }
});


router.get('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this id!' });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post('/', async (req, res) => {
  try {
    const newThought = await Thought.create(req.body);
    await User.findByIdAndUpdate(
      req.body.userId,
      { $push: { thoughts: newThought._id } },
      { new: true }
    );
    res.json(newThought);
  } catch (err) {
    res.status(400).json(err);
  }
});


router.put('/:thoughtId', async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedThought) {
      return res.status(404).json({ message: 'No thought found with this id!' });
    }
    res.json(updatedThought);
  } catch (err) {
    res.status(400).json(err);
  }
});


router.delete('/:thoughtId', async (req, res) => {
  try {
    const thoughtToDelete = await Thought.findByIdAndRemove(req.params.thoughtId);
    if (!thoughtToDelete) {
      return res.status(404).json({ message: 'No thought found with this id!' });
    }

    await User.findByIdAndUpdate(
      thoughtToDelete.userId, 
      { $pull: { thoughts: req.params.thoughtId } },
      { new: true }
    );
    res.json({ message: 'Thought successfully deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add Reaction related routes here
// ...

module.exports = router;

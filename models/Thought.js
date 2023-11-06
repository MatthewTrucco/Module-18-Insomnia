const mongoose = require('mongoose');
const reactionSchema = require('../Reaction');


const formatDate = (timestamp) => {
  return new Date(timestamp).toISOString();
};

const thoughtSchema = new mongoose.Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: formatDate
  },
  username: {
    type: String,
    required: true
  },
  reactions: [reactionSchema]
}, {
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true }
});

thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;

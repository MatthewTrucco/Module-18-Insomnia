const mongoose = require('mongoose');


const formatDate = (timestamp) => {
  
  return timestamp.toISOString();
};

const reactionSchema = new mongoose.Schema({
  reactionId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    
    get: formatDate,
  },
}, {
  toJSON: { getters: true },
  id: false 
});

module.exports = reactionSchema;

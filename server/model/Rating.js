const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const ratingSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  text: {
    type: ObjectId,
    ref: 'Texts'
  },
  rating: Number
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);

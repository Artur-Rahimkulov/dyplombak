const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const favoriteSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  text: {
    type: ObjectId,
    ref: 'Texts'
  },
  group: {
    type: ObjectId,
    ref: 'Favorites_group'
  }
}, { timestamps: true });

module.exports = mongoose.model('Favorites', favoriteSchema);

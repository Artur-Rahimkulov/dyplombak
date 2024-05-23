const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const favoriteGroupsSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    default: 'Избранное'
  }
}, { timestamps: true });

module.exports = mongoose.model('Favorites_group', favoriteGroupsSchema);

const Favorites = require('../model/Favorites');
const Favorites_group = require('../model/Favorites_group');
const Texts = require('../model/Texts');
const { checkAccess } = require('../utils/checkAccess');
exports.getFavoritesGroups = async (req, res) => {
  try {
    const user_id = req.user._id;
    const favorites_groups = await Favorites_group.find({ user: user_id }).exec();
    return res.json({
      status: true,
      favorites_groups: favorites_groups
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.createFavoritesGroup = async (req, res) => {
  try {
    const user_id = req.user._id;
    const favorites_group = await Favorites_group.create({
      user: user_id,
      name: req.body.name
    });
    return res.json({
      status: true,
      favorites_group: favorites_group
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.deleteFavoritesGroup = async (req, res) => {
  try {
    const favoritesFromGroup = await Favorites.deleteMany({ group: req.params.id }).exec();
    const favorites_group = await Favorites_group.deleteOne({ _id: req.params.id }).exec();
    return res.json({
      status: true,
      favorites_group: favorites_group
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.updateFavoritesGroup = async (req, res) => {
  try {
    const favorites_group = await Favorites_group.updateOne({ _id: req.params.id }, {
      name: req.body.name
    }).exec();
    return res.json({
      status: true,
      favorites_group: favorites_group
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.addTextToFavoritesGroup = async (req, res) => {
  try {
    const user_id = req.user._id;
    const text_id = req.params.text_id;
    const favorite_group_id = req.params.favorite_group_id;
    let text = await Texts.findOne({ _id: text_id }).exec();
    let checkAccessResult = await checkAccess('add_to_favorites', text, user_id);
    if (!checkAccessResult.status) return res.json({ message: checkAccessResult.message, status: false });
    const newFavorites = await Favorites.create({
      user: user_id,
      text: text_id,
      group: favorite_group_id
    });
    return res.json({
      status: true,
      favorites: newFavorites
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.deleteTextFromFavoritesGroup = async (req, res) => {
  try {
    const user_id = req.user._id;
    const text_id = req.params.text_id;
    const favorite_group_id = req.params.favorite_group_id;
    const favorites = await Favorites.deleteOne({ user: user_id, text: text_id, group: favorite_group_id }).exec();
    return res.json({
      status: true,
      favorites: favorites
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

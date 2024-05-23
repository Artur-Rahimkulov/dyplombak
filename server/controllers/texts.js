const Texts = require('../model/Texts');
const User = require('../model/User');
const Favorites = require('../model/Favorites');
const Favorites_group = require('../model/Favorites_group');
const Rating = require('../model/Rating');
const Comment = require('../model/Comment');
const Recent = require('../model/Recent');
const Access_link = require('../model/Access_link');
const { SHA256, SHA1 } = require('crypto-js');
const { type } = require('os');
const { checkAccess } = require('../utils/checkAccess');

const textsListMapper = async (text, user_id) => {
  let [liked, favorites, recent, access_linked, comments, author] = await Promise.all([
    Rating.findOne({ user: user_id, text: text._id }).exec(),
    Favorites.find({ user: user_id, text: text._id }).exec(),
    Recent.findOne({ user: user_id, text: text._id }).exec(),
    Access_link.findOne({ user: user_id, text: text._id }).exec(),
    Comment.find({ text: text._id }).exec(),
    User.findOne({ _id: text.author }).exec()
  ]);
  return {
    _id: text._id.toString(),
    title: text.title,
    author: author ? { _id: author._id, username: author.username } : null,
    description: text.description,
    views: text.views,
    likes: text.likes,
    dislikes: text.dislikes,
    accessLevel: text.accessLevel,
    access_link: text.access_link,
    createdAt: text.createdAt,
    updatedAt: text.updatedAt,
    user: {
      liked: liked ? liked.rating : null,
      favorites: favorites ? favorites : null,
      lastReaded: recent ? recent.updatedAt : null,
      access_linked: access_linked ? true : false
    }
  }
};
const textsMapperReadAndEdit = async (text, user_id) => {
  let [liked, favorites, recent, access_linked, comments, author] = await Promise.all([
    Rating.findOne({ user: user_id, text: text._id }).exec(),
    Favorites.find({ user: user_id, text: text._id }).exec(),
    Recent.findOne({ user: user_id, text: text._id }).exec(),
    Access_link.findOne({ user: user_id, text: text._id }).exec(),
    Comment.find({ text: text._id }).exec(),
    User.findOne({ _id: text.author }).exec()
  ]);
  return {
    _id: text._id.toString(),
    title: text.title,
    author: author ? author : null,
    text: text.text,
    description: text.description,
    views: text.views,
    likes: text.likes,
    dislikes: text.dislikes,
    accessLevel: text.accessLevel,
    access_link: text.access_link,
    user: {
      liked: liked ? liked.rating : null,
      favorites: favorites ? favorites : null,
      lastReaded: recent ? recent.updatedAt : null,
      access_linked: access_linked ? true : false
    },
    createdAt: text.createdAt,
    updatedAt: text.updatedAt
  }
};

const updateReadingCounts = async (text) => {
  return Texts.updateOne({ _id: text._id }, {
    views: text.views + 1,
  }).exec();
};

const updateRecent = async (text, user_id) => {
  const recent = await Recent.findOne({ user: user_id, text: text._id }).exec();
  if (recent) return Recent.updateOne({ user: user_id, text: text._id }, {
    $set: {
      updatedAt: new Date()
    }
  }).exec();
  else {
    // let recents = await Recent.find({ user: user_id }).sort({ updatedAt: -1 }).exec();
    // if (recents.length == 20)
    //   Recent.deleteOne({ user: user_id, text: recents[0].text }).exec();
    return Recent.create({
      user: user_id,
      text: text._id,
      updatedAt: new Date()
    })
  }

};

const updateAccess_link = async (text, user_id) => {
  const access_link = await Access_link.findOne({ user: user_id, text: text._id }).exec();
  if (access_link) return Access_link.updateOne({ user: user_id, text: text._id }, {
    $set: {
      updatedAt: new Date()
    }
  }).exec();
  else {
    return Access_link.create({
      user: user_id,
      text: text._id,
      updatedAt: new Date()
    });
  }

};

const deleteCaskadeFromText = async (text_id) => {
  let favorites = await Favorites.deleteMany({ text: text_id }).exec();
  let access_linked = await Access_link.deleteMany({ text: text_id }).exec();
  let recent = await Recent.deleteMany({ text: text_id }).exec();
  let ratings = await Rating.deleteMany({ text: text_id }).exec();
  let comments = await Comment.deleteMany({ text: text_id }).exec();
}

exports.getAllTexts = async (req, res) => {
  try {
    switch (req.query.activeKey) {
      case 'author':
        this.getTextsByAuthor(req, res);
        break;
      case 'public':
        this.getPublicTexts(req, res);
        break;
      case 'favorites':
        this.getFavoritesTexts(req, res);
        break;
      case 'access_linked':
        this.getAccess_linkedTexts(req, res);
        break;
      case 'recent':
        this.getRecentTexts(req, res);
        break;
      default:
        throw new Error('Invalid activeKey');
    }
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.getTextsByAuthor = async (req, res) => {
  try {
    const user_id = req.user._id;
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const search = req.query.search;
    const sort = req.query.sort;
    const sortOrder = req.query.sortOrder;
    let skip = pageSize * (page - 1);
    let findQuery = { author: user_id };
    if (search) {
      findQuery = { ...findQuery, title: { $regex: search } };
    }
    const texts = await
      Texts.find(findQuery)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(pageSize)
        .exec();
    let mappedTexts = await Promise.all(texts.map(text => textsListMapper(text, user_id)));
    Texts.countDocuments(findQuery).then((count) => {
      console.log('count', count);
      res.json({
        status: true,
        texts: mappedTexts,
        count: count
      });
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.getPublicTexts = async (req, res) => {
  try {
    const user_id = req.user._id;
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const search = req.query.search;
    const sort = req.query.sort;
    const sortOrder = req.query.sortOrder;
    let skip = pageSize * (page - 1);
    let findQuery = { accessLevel: 'public' };
    if (search) {
      findQuery = { ...findQuery, title: { $regex: search } };
    }
    const texts = await Texts.find(findQuery).sort({ [sort]: sortOrder }).skip(skip).limit(pageSize).exec();
    let mappedTexts = await Promise.all(texts.map(text => textsListMapper(text, user_id)));
    Texts.countDocuments(findQuery).then(count => {
      res.json({
        status: true,
        texts: mappedTexts,
        count: count
      });
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.getFavoritesTexts = async (req, res) => {
  try {
    const user_id = req.user._id;
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const search = req.query.search;
    const sort = req.query.sort;
    const sortOrder = req.query.sortOrder;
    const favoriteGroupId = req.query.favoriteGroupId;
    let skip = pageSize * (page - 1);
    let favoritesFind = { user: user_id };
    if (favoriteGroupId != 'all') {
      favoritesFind = { ...favoritesFind, group: favoriteGroupId };
    }
    const favorites = await Favorites.find(favoritesFind).exec();
    let findQuery = { _id: { $in: favorites.map(item => item.text) } };
    if (search) {
      findQuery = { ...findQuery, title: { $regex: search } };
    }
    const texts = await Texts.find(findQuery).sort({ [sort]: sortOrder }).skip(skip).limit(pageSize).exec();
    let mappedTexts = await Promise.all(texts.map(text => textsListMapper(text, user_id)));
    Texts.countDocuments(findQuery).then(count => {
      res.json({
        status: true,
        texts: mappedTexts,
        count: count
      });
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.getAccess_linkedTexts = async (req, res) => {
  try {
    const user_id = req.user._id;
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const search = req.query.search;
    const sort = req.query.sort;
    const sortOrder = req.query.sortOrder;
    let skip = pageSize * (page - 1);
    const access_linked = await Access_link.find({ user: user_id }).exec();
    let findQuery = { _id: { $in: access_linked.map(item => item.text) } }
    if (search) {
      findQuery = { ...findQuery, title: { $regex: search } };
    }
    const texts = await Texts.find(findQuery)
      .sort({ [sort]: sortOrder }).skip(skip).limit(pageSize).exec();
    let mappedTexts = await Promise.all(texts.map(text => textsListMapper(text, user_id)));
    Texts.countDocuments(findQuery).then(count => {
      res.json({
        status: true,
        texts: mappedTexts,
        count: count
      });
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.getRecentTexts = async (req, res) => {
  try {
    const user_id = req.user._id;
    const page = req.query.page;
    const pageSize = req.query.pageSize;
    const search = req.query.search;
    const sort = req.query.sort;
    const sortOrder = req.query.sortOrder;
    const recent = await Recent.find({ user: user_id }).exec();
    let skip = pageSize * (page - 1);
    let findQuery = { _id: { $in: recent.map(item => item.text) } }
    if (search) {
      findQuery = { ...findQuery, title: { $regex: search } };
    }
    const texts = await Texts.find(findQuery)
      .sort({ [sort]: sortOrder }).skip(skip).limit(pageSize).exec();
    let mappedTexts = await Promise.all(texts.map(text => textsListMapper(text, user_id)));
    Texts.countDocuments(findQuery).then(count => {
      res.json({
        status: true,
        texts: mappedTexts,
        count: count
      });
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.getTextForEdit = async (req, res) => {
  try {
    const text = await Texts.findOne({ _id: req.params.id }).exec();
    let checkAccessResult = await checkAccess('edit', text, req.user._id);
    if (!checkAccessResult.status) return res.json({ message: checkAccessResult.message, status: false });
    let mappedText = await textsMapperReadAndEdit(text, req.user._id);
    return res.json({
      status: true,
      text: mappedText
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.getTextForRead = async (req, res) => {
  try {
    const text = await Texts.findOne({ _id: req.params.id }).exec();
    let checkAccessResult = await checkAccess('read', text, req.user._id);
    if (!checkAccessResult.status) return res.json({ message: checkAccessResult.message, status: false });
    let mappedText = await textsMapperReadAndEdit(text, req.user._id);
    res.json({
      status: true,
      text: mappedText
    });
    updateReadingCounts(text);
    updateRecent(text, req.user._id);
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};
exports.getTextForReadWithAccess_link = async (req, res) => {
  try {
    const access_link = req.params.access_link;
    const text = await Texts.findOne({ access_link: access_link }).exec();
    let checkAccessResult = await checkAccess('read_with_access_link', text, req.user._id);
    if (!checkAccessResult.status) return res.json({ message: checkAccessResult.message, status: false });
    let mappedText = await textsMapperReadAndEdit(text, req.user._id);
    res.json({
      status: true,
      text: mappedText
    });
    updateAccess_link(text, req.user._id);
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.createText = async (req, res) => {
  try {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();

    const newText = await Texts.create({
      title: req.body.title,
      description: req.body.description,
      text: req.body.text,
      author: req.user._id,
      access_link: SHA256(current_date + random),
    });
    return res.json({
      status: true,
      text: newText
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.copyText = async (req, res) => {
  try {
    const text = await Texts.findOne({ _id: req.params.id }).exec();
    const author = await User.findOne({ _id: text.author }).exec();
    let checkAccessResult = await checkAccess('copy', text, req.user._id);
    if (!checkAccessResult.status) return res.json({ message: checkAccessResult.message, status: false });
    let current_date = (new Date()).valueOf().toString();
    let random = Math.random().toString();
    const newText = await Texts.create({
      title: text.title + " Копия",
      description: text.description + " Скопировано у пользователя: " + author.username,
      text: text.text,
      author: req.user._id,
      access_link: SHA256(current_date + random),
    });
    return res.json({
      status: true,
      text: newText
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.deleteText = async (req, res) => {
  try {
    let text = await Texts.findOne({ _id: req.params.id }).exec();
    let checkAccessResult = await checkAccess('delete', text, req.user._id);
    if (!checkAccessResult.status) return res.json({ message: checkAccessResult.message, status: false });
    text = await Texts.deleteOne({ _id: req.params.id }).exec();
    deleteCaskadeFromText(req.params.id);
    return res.json({
      status: true,
      text: text
    });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message, status: false });
  }
};

exports.updateText = async (req, res) => {
  try {
    let text = await Texts.findOne({ _id: req.params.id }).exec();
    let checkAccessResult = await checkAccess('update', text, req.user._id);
    if (!checkAccessResult.status) return res.json({ message: checkAccessResult.message, status: false });
    text = await Texts.updateOne({ _id: req.params.id }, {
      title: req.body.title,
      description: req.body.description,
      text: req.body.text
    }).exec();
    return res.json({
      status: true,
      text: text
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.updateTextAccessLevel = async (req, res) => {
  try {
    let text = await Texts.findOne({ _id: req.params.id }).exec();
    let checkAccessResult = await checkAccess('update', text, req.user._id);
    if (!checkAccessResult.status) return res.json({ message: checkAccessResult.message, status: false });
    console.log(`{ _id: ${req.params.id} }`)
    text = await Texts.updateOne({ _id: req.params.id }, {
      accessLevel: req.body.accessLevel
    }).exec();
    return res.json({
      status: true,
      text: text
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.updateAccess_link = async (req, res) => {
  try {
    let text = await Texts.findOne({ _id: req.params.id }).exec();
    let checkAccessResult = await checkAccess('update', text, req.user._id);
    if (!checkAccessResult.status) return res.json({ message: checkAccessResult.message, status: false });
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    let access_link = SHA256(current_date + random)
    const deleteAccessLinks = await Access_link.deleteMany({ texts: text._id }).exec();
    text = await Texts.updateOne({ _id: req.params.id }, {
      access_link: access_link
    }).exec();
    return res.json({
      status: true,
      access_link: access_link
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.deleteAccess_link = async (req, res) => {
  try {
    const access_link = await Access_link.deleteOne({ user: req.user._id, text: req.params.id }).exec();
    return res.json({
      status: true,
      access_link: access_link
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

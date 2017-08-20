var mongoose = require('mongoose');
var router = require('express').Router();
var Character = mongoose.model('Character');
var User = mongoose.model('User');
var auth = require('../auth');

router.param('character', function (req, res, next, slug) {
  Character.findOne({ slug: slug })
    .then(function (character) {
      if (!character) { return res.sendStatus(404); }

      req.character = character;

      return next();
    }).catch(next);
});

router.get('/characters', function (req, res, next) {
  Promise.resolve(req.payload ? Character.findById(req.payload.id) : null).then(function (character) {
    return req.character.populate().
      execPopulate().then(function (character) {
        return res.json({ character: character });
      });
  }).catch(next);
});

router.get('/:character', auth.optional, function (req, res, next) {
  Promise.all([
    req.payload ? User.findById(req.payload.id) : null,
    req.article.populate('creator').execPopulate()
  ]).then(function (results) {
    var user = results[0];

    return res.json({ article: req.character.toJSONFor(user) });
  }).catch(next);
});

router.post('/characters', function (req, res, next) {
  console.log("router gehaald");  
  var character = new Character();

  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    var character = new Character();

    character.race = req.body.character.race;
    character.subRace = req.body.character.subRace;
    character.class = req.body.character.class;
    character.name = req.body.character.name;
    character.level = req.body.character.level;
    character.creator = user;

    return character.save().then(function () {
      console.log(character.creator);
      return res.json({ character: character.toJSONFor(user) });
    }); 
  }).catch(next);
});

router.put('/:character', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (req.character.creator._id.toString() === req.payload.id.toString()) {
      if (typeof req.body.character.race !== 'undefined') {
        req.character.race = req.body.character.race;
      }

      if (typeof req.body.character.subRace !== 'undefined') {
        req.character.subRace = req.body.character.subRace;
      }

      if (typeof req.body.character.class !== 'undefined') {
        req.character.class = req.body.character.class;
      }

      if (typeof req.body.character.name !== 'undefined') {
        req.character.name = req.body.character.name;
      }

      if (typeof req.body.character.level !== 'undefined') {
        req.character.level = req.body.character.level;
      }

      req.character.save().then(function (character) {
        return res.json({ character: character.toJSONFor(user) });
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

module.exports = router;

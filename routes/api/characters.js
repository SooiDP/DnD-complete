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

router.get('/', function (req, res, next) {
  Character.find().sort({ name: 1 }).then(function (characters) {
    return res.json({ characters: characters });
  }).catch(next);
});

router.get('/:character', function (req, res, next) {
  return res.json({
      character: req.character.toJSON()
  });
});

router.post('/characters', auth.required, function (req, res, next) {
  console.log("router gehaald");
  var character = new Character();
  //User.findById(req.payload.slug).then(function (user) {
  // if (!user) { return res.sendStatus(401); }

  character.race = req.body.character.race;
  character.subRace = req.body.character.subRace;
  character.class = req.body.character.class;
  character.name = req.body.character.name;
  character.level = req.body.character.level;

  return character.save().then(function () {
    console.log("character.creator");
    //return res.json({ character: character.toJSONFor(user) });
    return res.json({
      character: character.toJSON()
    });
  });
  //}).catch(next);
});

router.put('/characters/:character', auth.required, function (req, res, next) {
  // User.findById(req.payload.id).then(function (user) {
  //if (req.character.creator._id.toString() === req.payload.id.toString()) {
  if (typeof req.body.race !== 'undefined') {
    req.character.race = req.body.character.race;
  }

  if (typeof req.body.subRace !== 'undefined') {
    req.character.subRace = req.body.character.subRace;
  }

  if (typeof req.body.class !== 'undefined') {
    req.character.class = req.body.character.class;
  }

  if (typeof req.body.name !== 'undefined') {
    req.character.name = req.body.character.name;
  }

  if (typeof req.body.level !== 'undefined') {
    req.character.level = req.body.character.level;
  }

  req.character.save().then(function (character) {
    return res.json({
      character: character.toJSON()
    });
    //     }).catch(next);
    //   } else {
    //    return res.sendStatus(403);
    //   }
  });
});

/*router.delete('/characters/:character', auth.required, function (req, res, next) {
  console.log("deleted test")
  return req.character.remove().then(deleted => {
    res.json({
      success: "character deleted",
      character: deleted.toJSON()
    });
  });
});*/


router.delete('/characters/:character', auth.required, function (req, res, next) {
  console.log('deleted')
  return req.character.remove().then(function () {
    return res.sendStatus(204);
  });
});

module.exports = router;

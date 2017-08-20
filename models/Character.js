var mongoose = require('mongoose');
var slug = require('slug');

var CharacterSchema = new mongoose.Schema({
  slug: {type: String, lowercase: true, unique: true},
  race: String,
  subRace: String,
  name: String,
  class: String,
  level: Number,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

CharacterSchema.methods.toJSONFor = function(user){
  return {
    slug: this.slug,
    race: this.race,
    subRace: this.subRace,
    name: this.name,
    class: this.class,
    level: this.level,
    creator: this.creator.toProfileJSONFor(user)
  };
};

CharacterSchema.methods.toJSON = function(){
  return {
    slug: this.slug,
    race: this.race,
    subRace: this.subRace,
    name: this.name,
    class: this.class,
    level: this.level
  };
};

CharacterSchema.pre('validate', function(next){
  if(!this.slug)  {
    this.slugify();
  }

  next();
});

CharacterSchema.methods.slugify = function() {
  console.log('slug');
  console.log(this.name);
  console.log("is name  broken");
  this.slug = slug(this.name) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
  console.log('ify');
};

mongoose.model('Character', CharacterSchema);

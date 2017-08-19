var mongoose = require('mongoose');

var CharacterSchema = new mongoose.Schema({
  race: String,
  subRace: String,
  name: String,
  class: String,
  level: Number
});

CharacterSchema.methods.toJSONFor = function(user){
  return {
    race: this.race,
    subRace: this.subRace,
    name: this.name,
    class: this.class,
    level: this.level
  };
};

mongoose.model('Character', CharacterSchema);

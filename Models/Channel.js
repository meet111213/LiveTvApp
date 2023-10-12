const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  name: String,
  category: String,
  logo: String,
  link: String,
});

const ChannelModel = mongoose.model('Channel', ChannelSchema);

module.exports = ChannelModel;
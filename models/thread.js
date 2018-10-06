const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ReplySchema = require('./reply');

const ThreadSchema = new Schema({
  text: { type: String, required: true },
  delete_password: { type: String, required: true },
  created_on: Date,
  bumped_on: Date,
  reported: Boolean,
  replies: [ReplySchema]
});

module.exports = mongoose.model('Thread', ThreadSchema);
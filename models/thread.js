const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
  text: { type: String, required: true },
  delete_password: { type: String, required: true },
  created_on: String,
  bumped_on: 
  likeIPs: [{ type: String }]
});

module.exports = mongoose.model('Thread', ThreadSchema);
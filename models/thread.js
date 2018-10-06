const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  text: { type: String, required: true },
  delete_password: { type: String, required: true },
  threadId: { type: Schema.Types.ObjectId, required: true }
});

const ThreadSchema = new Schema({
  text: { type: String, required: true },
  delete_password: { type: String, required: true },
  created_on: Date,
  bumped_on: Date,
  replies: [ReplySchema]
});

module.exports = mongoose.model('Thread', ThreadSchema);
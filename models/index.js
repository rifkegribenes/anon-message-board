const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ReplySchema = new Schema({
  text: { type: String, required: true },
  delete_password: { type: String, required: true },
  thread_id: { type: Schema.Types.ObjectId, required: true, ref: "Thread" },
  created_on: Date,
  reported: Boolean
});

const ThreadSchema = new Schema({
  text: { type: String, required: true },
  delete_password: { type: String, required: true },
  created_on: Date,
  bumped_on: Date,
  reported: Boolean,
  replies: [ReplySchema]
});

module.exports.Thread = mongoose.model('Thread', ThreadSchema);
module.exports.Reply = mongoose.model('Reply', ReplySchema);
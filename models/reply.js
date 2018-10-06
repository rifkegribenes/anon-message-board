const mongoose = require('mongoose');
const Schema = mongoose.Schema;

exports.ReplySchema = new Schema({
  text: { type: String, required: true },
  delete_password: { type: String, required: true },
  thread_id: { type: Schema.Types.ObjectId, required: true },
  created_on: Date,
  reported: Boolean
});
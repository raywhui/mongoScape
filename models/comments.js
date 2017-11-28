const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  comment: String
});

// This creates our model from the above schema, using mongoose's model method
const Comments = mongoose.model("Comment", NoteSchema);

// Export the Note model
module.exports = Comments;
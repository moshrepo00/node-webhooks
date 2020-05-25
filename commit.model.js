const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CommitSchema = new Schema({
	author: { type: String},
	message: { type: String}
});

// Export the model
module.exports = mongoose.model('Commit', CommitSchema);
//import the Schema constructor and Model function from Mongoose
//import the dateFormat function from utils\dateFormat.js
const { Schema, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

//created a schema for reaction
const reactionSchema = new Schema(
    {
    //Created a reactionId field of type ObjectId
    //with default set to a new ObjectId
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    // Created a reactionBody field of type String
    // with constraints of required and maxLength of 280 characters
    reactionBody: {
        type: String,
        required: 'Reaction body is required',
        maxLength: 280
    },
    // Created a username field of type String
    // with the constraints of required
    username: {
        type: String,
        required: 'Username is required'
    },
    // Created a createdAt field of type Date
    // with the constraints of default and get
    // Set the default value to the current timestamp
    // Used a getter method to format the timestamp on query
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    }
    },
    {
        // Set the `toJSON` schema option to use virtuals
        toJSON: {
            getters: true
        }
    }
);

// This will not be a model, but rather will be used as the `reaction` field's subdocument schema in the `Thought` model.
module.exports = reactionSchema;

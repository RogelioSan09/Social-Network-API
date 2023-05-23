//importing the Schema constructor and Model function from Mongoose
//importing the dateFormat function from utils\dateFormat.js
//importing the reactionSchema from models\Reaction.js
const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');
const reactionSchema = require('./Reaction');

//created a schema for the Thought model
const thoughtSchema = new Schema(
    {
        //created a thoughtText field of type String
        //with the following constraints of required, minLength, and maxLength
        thoughtText: {
            type: String,
            required: 'Thought text is required',
            minLength: 1,
            maxLength: 280
        },
        //created a createdAt field of type Date
        //with the following constraints of default and get
        //Set default value to the current timestamp
        //Use a getter method to format the timestamp on query
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dateFormat(createdAtVal)
        },
        //created a username field of type String
        //with the following constraints of required
        username: {
            type: String,
            required: 'Username is required'
        },
        //created a reactions field of type Array
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// Created the Thought model using the ThoughtSchema
const Thought = model('Thought', thoughtSchema);

// * Virtual called `reactionCount` that retrieves the length of the thought's `reactions` array field on query.
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
}
);

//exported the Thought model
module.exports = Thought;
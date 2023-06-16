//import the Schema constructor and Model function from Mongoose
const { Schema, model } = require('mongoose');

//created a schema for the User model
const userSchema = new Schema(
    {
        //created a username field of type String
        //with the following constraints of unique, required, and trimmed
        username: {
            type: String,
            unique: true,
            required: 'Username is required',
            trim: true
        },
        //created an email field of type String
        //with the following constraints of unique and required
        //and a custom match validator to ensure the email is in the correct format
        email: {
            type: String,
            required: 'Email is required',
            unique: true,
            match: [/.+@.+\..+/, 'Please enter a valid e-mail address'],
        },
        //created a thoughts field of type Array
        //with an array of `_id` values referencing the `Thought` model
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        //created a friends field of type Array
        //with an array of `_id` values referencing the `User` model (self-reference)
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
    },
    {
        // Set the `toJSON` schema option to use virtuals
        // The virtuals will be used to count the length of the friends array and thoughts array
        // Set the `getters` schema option to use the virtuals
        toJSON: {
            virtuals: true,
            getters: true
        },
        // Set the `id` as false, this allows the virtuals to be used in the data returned
        // The id of the user is not needed since the _id is already defined
        id: false,
    }
);

// Virtual called `friendCount` that retrieves the length of the user's `friends` array field on query.
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
}
);

// created the User model using the UserSchema
const User = model('User', userSchema);

// export the User model
module.exports = User;
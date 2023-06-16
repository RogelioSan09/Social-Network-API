const { User, Thought } = require('../models');

module.exports = {
    // get all users
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
        .then(user => res.json(user))
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    // get one user by id
    getUserById(req, res) {
        User.findOne({ _id: req.params.userId })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .then((user) => 
                // If no user is found, send 404
                !user 
                    ? res.status(404).json({ message: 'No user found with this id!' })
                    : res.json(user)
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // create a new user
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.sendStatus(500).json(err));
    },
    // update user by id
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user found with this id!' })
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    // delete user
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) => 
                !user 
                    ? res.status(404).json({ message: 'No user exists!' })
                    : Thought.deleteMany(
                        { user: req.params.userId }, // delete all thoughts associated with the user
                        { $pull : { thoughts: req.params.userId }},
                        { new: true },
                    )
            )
            .then(() => res.json({ message: 'User deleted!' }))
            .catch((err) => res.status(500).json(err));
    },

    // add friend
    // When testing in Insomnia Core, use the following JSON in the body of the POST request to add a friend to a user:
    // {
    //     "_Id": "5edff358a0fcb779aa7b118b"
    // }
    addFriend(req, res) {
        console.log('Adding a friend');
        console.log(req.body);
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.body }}, // add to set to prevent duplicates
            { new: true, runValidators: true }
        )
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user found with this id!' })
                : res.json(user)
        )
        .catch((err) => res.json(err));
    },
    
    removeFriend(req, res) {
        console.log('Removing a friend');
        User.findOneAndDelete({ _id: req.params.friendId })
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user found with this id!' })
                : User.findOneAndUpdate(
                    { _id: req.params.userId },
                    { $pull: { friends: req.params.friendId }}, // remove from set
                    { new: true }
                )
        )
        .then((user) =>
            !user
                ? res.status(404).json({ 
                    message: 'No user found with this id!' 
                })
                : res.json({ message: 'Friend removed!' })
        )
        .catch((err) => res.status(500).json(err));
    },
};

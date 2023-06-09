const { Thought, User } = require('../models');

module.exports = {
    // get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})    // find all thoughts
            .populate({
                path: 'reactions',  // populate the `reactions` field in the Thought model
                select: '-__v'  // exclude the __v field
            })
            .then((thought) => res.json(thought))   // return the data as json
            .catch((err) => {
                console.log(err);
                res.sendStatus(400);
            }   
        );
    },

    // get one thought by id
    getThoughtById(req, res) {   // destructure params out of the request body
        Thought.findOne({ _id: req.params.thoughtId }) // find one thought by its _id
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .then((thought) =>
                // If no thought is found, send 404
                !thought
                    ? res.status(404).json({ message: 'No thought found with this id!' })
                    : res.json(thought)
            )
            .catch((err) => {
                console.log(err);
                res.Status(500).json(err);
            });
    },

    // create a new thought
    // destructure body out of the request body
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                User.findOneAndUpdate(
                    { username: req.body.username },
                    { $push: { thoughts: thought._id } },
                    { new: true }
                )
                .then((user) => {
                    if (!user) {
                        return res.status(404).json({ message: 'No user found with this username!' });
                    }
                    res.json(thought);
                })
                .catch((err) => res.status(500).json(err));
            })
    },

    // update thought by id
    updateThought( req, res) {
        Thought.findOneAndUpdate(   // find one thought by its _id
            { _id: req.params.thoughtId },
            { $set: req.body }, // update the thought's `thoughtText` field
            { runValidators: true, new: true }
        )
        .then((thought) => 
            // If no thought is found, send 404
            !thought
                ? res.status(404).json({ message: 'No thought found with this id!' })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    // delete thought
    deleteThought(req, res) {  
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought found with this id!' })
                    : User.findOneAndUpdate(
                        { username: thought.username }, // find the user with the matching username
                        { $pull: { thoughts: req.params.thoughtId } }, // remove the thought from the user's `thoughts` array field  
                        { runValidators: true, new: true }
                    )    
            )
            .then((user) =>
            // If no user is found, send 404
            !user
                ? res.status(404).json({ 
                    message: 'No user found with this id!',
                 })
                 : res.json({ message: 'Thought successfully deleted!' })
            )
            .catch((err) => res.json(err));
    },

    // add reaction
    addReaction(req, res) {
        console.log('Adding a reaction');
        console.log(req.body);
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } }, // add the reaction to the thought's `reactions` array field
            { new: true, runValidators: true }
        )
        .then((thought) =>
            // If no thought is found, send 404
            !thought
                ? res.status(404).json({ message: 'No thought found with this id!' })
                : res.json(thought)
        )
        .catch((err) => res.json(err));
    },

    // remove reaction
    removeReaction(req, res) {
        console.log('Removing all reactions associated with thoughtId');
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            // remove the reaction to the thought's `reactions` array field
            { $pull: { reactions: {} } },
            { new: true}
        )
        .then((thought) =>
            // If no thought is found, send 404
            !thought
                ? res.status(404).json({ message: 'No thought found with this id!' })
                : res.json(thought)
        )
        .catch((err) => res.json(err));
    },
};

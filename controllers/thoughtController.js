const { Thought, User } = require('../models');

module.exports = {
    // get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})    // find all thoughts
            .populate({
                path: 'reactions',  // populate the `reactions` field in the Thought model
                select: '-__v'  // exclude the __v field
            })
            .select('-__v') // exclude the __v field
            .sort({ _id: -1 })  // sort in DESC order by the _id value
            .then((thought) => res.json(thought))   // return the data as json
            .catch((err) => {
                console.log(err);
                res.sendStatus(400);
            }   
        );
    },
    // get one thought by id
    getThoughtById({ params }, res) {   // destructure params out of the request body
        Thought.findOne({ _id: params.id }) // find one thought by its _id
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then((thought) =>
                // If no thought is found, send 404
                !thought
                    ? res.status(404).json({ message: 'No thought found with this id!' })
                    : res.json(thought)
        )
    },
    // create a new thought
    // destructure body out of the request body
    createThought({ body }, res) {  
        Thought.create(body)
            .then((thought) => {
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: thought._id } },   // add the thought's _id to the user's `thoughts` array field
                    { new: true, runValidators: true }
                );
            })
            .then((user) => 
                // If no user is found, send 404
                !user
                    ? res.status(404).json({ message: 'No user found with this id!' })
                    : res.json(user)
        )
        .catch((err) => res.json(err));
    },
    // update thought by id
    updateThought( req, res) {
        Thought.findOneAndUpdate(   // find one thought by its _id
            { _id: req.params.thoughtId },  // destructure params out of the request body
            { $set: req.body }, // update the thought's `thoughtText` field
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
    // delete thought
    deleteThought(req, res) {  
        Thought.findOneAndDelete({ _id: req.params.id })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought found with this id!' })
                    : User.findOneAndUpdate(
                        { username: thought.username },
                        { $pull: { thoughts: thought._id } },   // remove the thought's _id from the user's `thoughts` array field
                        { new: true }
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
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    // add reaction
    addReaction(req, res) {
        console.log('Adding a reaction');
        console.log(req.body);
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: req.body } }, // add the reaction to the thought's `reactions` array field
            { new: true, runValidators: true }
        )
        .then((thought) =>
            // If no thought is found, send 404
            !thought
                ? res.status(404).json({ message: 'No thought found with this id!' })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    // remove reaction
    removeReaction(req, res) {   // destructure params out of the request body
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } }, // remove the reaction from the thought's `reactions` array field
            { runValidators: true, new: true }
        )
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: 'No thought found with this id!' })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
};

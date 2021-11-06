const Thing = require('../models/Things');
const fs = require('fs');

exports.createThing = (req, res, next) => { //Création de l'objet
    const thingObject = JSON.parse(req.body.sauce);
    /*thingObject.dislikes = 0;
    thingObject.likes = 1;
    thingObject.usersLiked = [];
    thingObject.usersDisliked = [];*/
    delete thingObject._id;
    const thing = new Thing({
        ...thingObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        dislikes: 0,
        likes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    thing.save()
    .then(() => res.status(201).json({ message: "Sauce créée et enregistrée" }))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res, next) => { /*Renvoie un tableau de
    toutes les sauces de la base de données.*/
    Thing.find()
    .then((things) => res.status(200).json( things ))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneThing = (req, res, next) => { //Renvoie la sauce avec l’_id fourni.
    Thing.findOne({ _id: req.params.id })
    .then((thing) => { res.status(200).json(thing);})
    .catch(error => { res.status(404).json({ error });
    });
};

exports.likeSauces = (req, res, next) => {

    const userId = req.body.userId;
    const like = req.body.like;

    Thing.findOne({ _id: req.params.id })
        .then(thing => {
            switch (like) {
                case 1:
                    Thing.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: userId } })
                        .then(() => {res.status(200).json({ message: "Like !" });})
                        .catch(error => res.status(400).json({ error }));
                    break;

                case 0:
                    if (thing.usersLiked.includes(userId)) {
                        Thing.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: userId } })
                            .then(() => {res.status(200).json({ message: "Like retiré !" });})
                            .catch(error => res.status(400).json({ error }));
                    } else if (thing.usersDisliked.includes(userId)) {
                        Thing.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } })
                            .then(() => {res.status(200).json({ message: "Dislike retiré !" });})
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;

                case -1:
                    Thing.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: userId } })
                        .then(() => {res.status(200).json({ message: "Dislike !" });})
                        .catch(error => res.status(400).json({ error }));
                    break;
                default:
                    console.log("error");
            }
        })
        .catch(error => {
            res.status(404).json({ error });
        });
};

exports.modifyThing = (req, res, next) => { //Modification de l'objet
    const thingObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Thing.updateOne({ _id: req.params.id },
    { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Modified!' }))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => { //Suppression d'un objet
    Thing.findOne({ _id: req.params.id})
    .then(thing => {
        const filename = thing.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Thing.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Deleted!'}))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};
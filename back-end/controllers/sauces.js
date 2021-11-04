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
    .then(() => res.status(201).json({ message: "Sauce créée et enregistrées" }))
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

exports.likesSauces = (req, res, next) => {
    const like = req.body.like
    const userId = req.body.userId
    const thingId = req.params.id

    switch (like) {

        case 1 :
            Thing.updateOne(
            { _id: req.params.id },
            { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 }})
            .then(() => res.status(200).json({ message: "Vous avez mis un like sur la sauce." }))
            .catch((error) => res.status(400).json({ error }))
        break;

        case 0 :
            Thing.findOne({ _id: req.params.id }) 
            .then((thing) => {
                if(thing.usersLiked.includes(userId)) {
                    Thing.updateOne(
                    { _id: req.params.id },
                    { $push: { usersLiked: req.body.userId }, $inc: { likes: -1 }})
                    .then(() => res.status(200).json({ message: "Votre like a été supprimé" }))
                    .catch((error) => res.status(400).json({ error }))
                }

                if(thing.usersDisliked.includes(userId)) {
                    Thing.updateOne(
                    { _id: req.params.id },
                    { $push: { usersLiked: req.body.userId }, $inc: { dislikes: -1 }})
                    .then(() => res.status(200).json({ message: "Votre dislike a été supprimé" }))
                    .catch((error) => res.status(400).json({ error }))
                }
            })
            .catch((error) => res.status(400).json({ error }))
        break;

        case -1 :
            Thing.updateOne(
            { _id: req.params.id },
            { $push: { usersLiked: req.body.userId }, $inc: { dislikes: +1 }})
            .then(() => res.status(200).json({ message: "Vous avez mis un dislike sur la sauce." }))
            .catch((error) => res.status(400).json({ error }))
        break;
    }
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
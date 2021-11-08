const Sauce = require('../models/Sauces');
const fs = require('fs');

exports.createSauce = (req, res, next) => { //Création de l'objet
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        dislikes: 0,
        likes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save()
    .then(() => res.status(201).json({ message: "Sauce créée et enregistrée" }))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res, next) => { /*Renvoie un tableau de
    toutes les sauces de la base de données.*/
    Sauce.find()
    .then((sauces) => res.status(200).json( sauces ))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => { //Renvoie la sauce avec l’_id fourni.
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => { res.status(200).json(sauce);})
    .catch(error => { res.status(404).json({ error });
    });
};

exports.likeSauces = (req, res, next) => {

    const userId = req.body.userId;
    const like = req.body.like;

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (like) {
                case 1:
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: userId } })
                        .then(() => {res.status(200).json({ message: "Like !" });})
                        .catch(error => res.status(400).json({ error }));
                    break;

                case 0:
                    if (sauce.usersLiked.includes(userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: userId } })
                            .then(() => {res.status(200).json({ message: "Like retiré !" });})
                            .catch(error => res.status(400).json({ error }));
                    } else if (sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } })
                            .then(() => {res.status(200).json({ message: "Dislike retiré !" });})
                            .catch(error => res.status(400).json({ error }));
                    }
                    break;

                case -1:
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: userId } })
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

exports.modifySauce = (req, res, next) => { //Modification de l'objet
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id },
    { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Modified!' }))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => { //Suppression d'un objet
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Deleted!'}))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};
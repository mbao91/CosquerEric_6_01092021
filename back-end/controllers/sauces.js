const Thing = require('../models/Things');
const fs = require('fs');

exports.createThing = (req, res, next) => { //Création de l'objet
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    console.log(req.body);
    const thing = new Thing({
        ...thingObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    thing.save()
    .then((thing) => res.status(201).json({ thing }))
    .catch(error => res.status(400).json({ error }));
};

exports.createThing = (req, res, next) => { //Création des Like/Dislike
    delete req.body._id;
    console.log(req.body);
    const thing = new Thing({
        userId: String,
        like: Number
    });
    thing.save()
    .then((thing) => res.status(201).json({ thing }))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res, next) => { /*Renvoie un tableau de
    toutes les sauces de la base de données.*/
    //console.log('test', res);
    Thing.find()
    .then((things) => res.status(200).json({ things }))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneThing = (req, res, next) => { //Renvoie la sauce avec l’_id fourni.
    Thing.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
};

exports.modifyThing = (req, res, next) => { //Modification de l'objet
    const thingObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Thing.updateOne({ _id: req.params.id },
    { ...thingObject, _id: params.id })
    .then(() => res.status(200).json({ message: 'Modified!' }))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => { //Suppression d'un objet
    Thing.deleteOne({ _id: req.params.id})
    .then(thing => {
        const filename = thing.imageUrl.split('/image/')[1];
        fs.unlink(`images/${filename}`, () => {
            Thing.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Deleted!'}))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};

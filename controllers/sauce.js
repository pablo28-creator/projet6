const Sauce= require('../models/Sauce');
const fs = require('fs');
const jwt = require("jsonwebtoken");

exports.createSauce =(req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
    const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    
    });
    console.log(sauceObject)
    sauce.save()
      .then(() => res.status(201).json({ message: "Objet enregistré !"}))
      .catch(error => res.status(400).json({ error }));
    };
exports.modifySauce =(req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
  } : { ...req.body };
    Sauce.updateOne({ _id: req.params._id }, { ...sauceObject, _id: req.params._id })
      .then(() => res.status(200).json({ message: "Objet modifié !"}))
      .catch(error => res.status(400).json({ error }));
    };
exports.deleteSauce =(req, res, next) => {
  Sauce.findOne({ _id: req.params._id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
    Sauce.deleteOne({ _id: req.params._id })
      .then(() => res.status(200).json({ message: "Objet supprimé !"}))
      .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({error}));
};
exports.getOneSauce =(req, res, next) => {
    Sauce.findOne({ _id: req.params._id })
      .then(sauce=> res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  };
exports.getAllSauce =(req, res, next) => {
    Sauce.find()
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(400).json({ error }));
  };
exports.modifyLike =(req, res, next) => {
if(req.body.like === 1){ 
  Sauce.findOne({ _id: req.params._id })
    .then(sauce => {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
      const userId = decodedToken.userId;
      const foundLike = sauce.usersLiked.find(element => element == userId);
      const foundDislike = sauce.usersDisliked.find(element => element == userId);
        if(!foundLike && !foundDislike){
          sauce.usersLiked.push(userId)
          sauce.likes = sauce.likes + 1
          sauce.save()
        }
       })
       
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(400).json({ error })
       
      );
    }
else if( req.body.like ===  -1 ) {
  Sauce.findOne({ _id: req.params._id })
    .then(sauce => {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
      const userId = decodedToken.userId;
      const foundDislike = sauce.usersDisliked.find(element => element == userId);
      const foundLike = sauce.usersLiked.find(element => element == userId);
        if(!foundDislike && !foundLike){
          sauce.usersDisliked.push(userId)
          sauce.dislikes = sauce.dislikes + 1
          sauce.save()
          }
    
    })
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(400).json({ error })
  
  );
}
else {
  Sauce.findOne({ _id: req.params._id })
    .then(sauce => { 
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
      const userId = decodedToken.userId;
      const foundLike = sauce.usersLiked.find(element => element == userId);
      const foundDislike = sauce.usersDisliked.find(element => element == userId);

        if(foundLike){
          sauce.usersLiked = sauce.usersLiked.filter((user) => user !== userId)
          sauce.likes = sauce.likes - 1
        }
        else if(foundDislike ){
          sauce.usersDisliked = sauce.usersDisliked.filter((user) => user !== userId)
          sauce.dislikes = sauce.dislikes - 1
        }
      sauce.save()
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(400).json({ error }))});
}};

const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
const uniqueValidator = require("mongoose-unique-validator");

require('dotenv').config()

var encKey = process.env.KEY;
var sigKey = process.env.KEYS;

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey, encryptedFields: ['email'] });
userSchema.plugin(uniqueValidator);



module.exports = mongoose.model("User", userSchema); 

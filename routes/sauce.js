const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require('../middleware/multer-config');

const saucesCtl = require("../controllers/sauce");

  router.post("/", auth, multer, saucesCtl.createSauce)
  router.put("/:_id", auth, multer, saucesCtl.modifySauce);
  router.delete("/:_id", auth, saucesCtl.deleteSauce);
  router.get("/:_id", auth, saucesCtl.getOneSauce);
  router.get("/", auth, saucesCtl.getAllSauce );
  router.post("/:_id/like", auth, saucesCtl.modifyLike);

  module.exports = router;
  
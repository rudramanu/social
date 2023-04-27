const express = require("express");

const { MediaModel } = require("../models/media.model");
const { authenticate } = require("../middleware/authentication");

const mediaRouter = express.Router();

mediaRouter.get("/", async (req, res) => {
  console.log("dfgh", req.body);
  const medias = await MediaModel.find({ userID: req.body.userID });
  res.send(medias);
});

mediaRouter.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const new_media = new MediaModel(payload);
    await new_media.save();
    res.send("Created the notes");
  } catch (error) {
    res.send({ message: "something went wrong" });
  }
});

mediaRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const id = req.params.id;
  const media = await MediaModel.findOne({ _id: id });
  console.log("media", media);

  try {
    if (media.userID == req.body.userID) {
      await MediaModel.findByIdAndUpdate({ _id: id }, payload);
      res.send("Media updated");
    } else {
      res.send("Not authorize");
    }
  } catch (error) {
    console.log(error);
    res.send({ message: "something went wrong" });
  }
});

mediaRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const media = await MediaModel.findOne({ _id: id });
  //   console.log("media", media);
  // const userID_in_media = media.userID;
  // const userID_who_making_request = req.body.userID;
  try {
    if (media.userID == req.body.userID) {
      await MediaModel.findByIdAndRemove({ _id: id });
      res.send("Media deleted");
    } else {
      res.send("Not authorize");
    }
  } catch (error) {
    console.log(error);
    res.send({ message: "something went wrong" });
  }
});

module.exports = {
  mediaRouter,
};

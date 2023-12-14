var express = require("express");
var router = express.Router();
const { ObjectId } = require("mongodb");

module.exports = function (db) {
  const User = db.collection("users");

  router.get("/", async function (req, res, next) {
    try {
      const {
        page = 1,
        limit = 5,
        keyword = "",
        sortBy = "_id",
        sortMode = "desc",
      } = req.query;
      const params = {};
      const sort = {};
      sort[sortBy] = sortMode;
      const offset = (page - 1) * limit;

      params["$or"] = [
        { name: new RegExp(keyword, "i") },
        { phone: new RegExp(keyword, "i") },
      ];

      const totaldata = await User.count(params);
      const pages = Math.ceil(totaldata / limit);


      const users = await User.find(params)
        .sort(sort)
        .skip(offset)
        .limit(Number(limit))
        .toArray();
      res.json({ data: users, totaldata, pages, page: Number(page), limit: Number(limit), offset });
    } catch (err) {
      res.status(500).json({ err }); 
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const { name, phone } = req.body;
      const users = await User.insertOne({ name: name, phone: phone });
      const data = await User.find({
        _id: new ObjectId(users.insertedId),
      }).toArray();
      res.status(201).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const { name, phone } = req.body;
      const user = await User.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { name: name, phone: phone } },
        { returnDocument: "after" }
      );
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error });
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = await User.findOne({ _id: new ObjectId(id) });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error });
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = await User.findOneAndDelete({ _id: new ObjectId(id) });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error });
    }
  });

  return router;
};

const express = require("express");
const router = express.Router();
const Command = require("../Models/CommandModel");

// Add a new Commande to the database
router.post("/commands", async (req, res) => {
  const command = req.body;

  try {
    const newCommand = await Command.create(command);
    res.status(201).json(newCommand);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible d'ajouter cette commande" });
  }
});

// Get a Commande by its ID
router.get("/commands/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const command = await Command.findById(id);

    if (!command) {
      return res.status(404).json({ error: "Cette commande n'existe pas" });
    }

    res.json(command);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the commande" });
  }
});

// Update an existing Commande
router.put("/commands/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  try {
    const command = await Command.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!command) {
      return res.status(404).json({ error: "Cette commande n'existe pas" });
    }

    res.json(command);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the commande" });
  }
});

module.exports = router;

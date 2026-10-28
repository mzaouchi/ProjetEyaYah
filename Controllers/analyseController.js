const Analyse = require("../Models/Analyse");
exports.createAnalyse = async (req, res) => {
  try {
    const { Patient, NumeroDossier, TypeAnalyse, Tests } = req.body;
    const newAnalyse = newAnalyse({
      Patient,
      Biologiste: req.user._id,
      NumeroDossier,
      TypeAnalyse,
      Tests,
    });
    await newAnalyse.save();
    res
      .status(200)
      .json({ message: "Analyse ajoutée avec succès", newAnalyse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAnalyse = async (req, res) => {
  try {
    const analyse = await Analyse.find()
      .populate("Patient", "name email phone")
      .populate("Biologiste", "name");
    res.status(200).json(analyse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

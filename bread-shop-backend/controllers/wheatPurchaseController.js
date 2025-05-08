const WheatPurchase = require('../models/WheatPurchase');

// Create new wheat purchase record
const createWheatPurchase = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity) {
      return res.status(400).json({ message: 'Quantity is required.' });
    }
    const wheatPurchase = new WheatPurchase({
      userId: req.user._id,
      quantity,
      date: new Date()
    });
    await wheatPurchase.save();
    res.status(201).json(wheatPurchase);
  } catch (error) {
    res.status(500).json({ message: 'Error creating wheat purchase record', error: error.message });
  }
};
module.exports = { createWheatPurchase };
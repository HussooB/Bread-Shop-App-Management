const Production = require('../models/Production');

// Create new production record
const createProduction = async (req, res) => {
  try {
    const { breadType, quantity } = req.body;
    if (!breadType || !quantity) {
      return res.status(400).json({ message: 'Bread type and quantity are required.' });
    }
    const production = new Production({
      userId: req.user._id,
      breadType,
      quantity,
      date: new Date()
    });
    await production.save();
    res.status(201).json(production);
  } catch (error) {
    res.status(500).json({ message: 'Error creating production record', error: error.message });
  }
};

// Get today's production summary for dashboard
const getTodayProductionSummary = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const summary = await Production.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$breadType',
          total: { $sum: '$quantity' }
        }
      }
    ]);
    // Convert to { '6birr': 10, ... }
    const result = {};
    summary.forEach(item => { result[item._id] = item.total; });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching production summary', error: error.message });
  }
};

module.exports = {
  createProduction,
  getTodayProductionSummary,
  // ...other exports
};
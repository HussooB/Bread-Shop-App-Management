const Sale = require('../models/Sale');

// Create new sale record
const createSale = async (req, res) => {
  try {
    const { hotels, markets, shop, unitPrice } = req.body;
    if (hotels == null || markets == null || shop == null || unitPrice == null) {
      return res.status(400).json({ message: 'All sales fields are required.' });
    }
    const sale = new Sale({
      userId: req.user._id,
      hotels,
      markets,
      shop,
      unitPrice,
      date: new Date()
    });
    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Error creating sale record', error: error.message });
  }
};

// Get today's sales summary for dashboard
const getTodaySalesSummary = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const sales = await Sale.find({
      userId: req.user._id,
      date: { $gte: start, $lte: end }
    });

    // Sum up sales
    let hotels = 0, markets = 0, shop = 0, revenue = 0;
    sales.forEach(s => {
      hotels += s.hotels;
      markets += s.markets;
      shop += s.shop;
      revenue += (s.hotels + s.markets + s.shop) * s.unitPrice;
    });

    res.json({ hotels, markets, shop, revenue });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales summary', error: error.message });
  }
};

module.exports = {
  createSale,
  getTodaySalesSummary,
  // ...other exports
};
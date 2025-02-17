const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3010;

app.use(express.static('static'));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.put('/menu/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const updates = req.body;
      
      const updatedItem = await MenuItem.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      
      if (!updatedItem) {
          return res.status(404).json({ error: 'Menu item not found' });
      }

      res.json(updatedItem);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
});

app.delete('/menu/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const deletedItem = await MenuItem.findByIdAndDelete(id);

      if (!deletedItem) {
          return res.status(404).json({ error: 'Menu item not found' });
      }

      res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

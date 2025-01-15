import mongoose from 'mongoose';
import Item from '~/server/models/Item.js';  // Assuming you have an Item model

const bundleItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const bundleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [bundleItemSchema],
  price: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 }, // This will be calculated in the pre-save hook
  stock: { type: Number, default: 0 }, // This will be calculated in the pre-save hook
  description: { type: String, default: '', required: true}
});

// Pre-save hook to calculate stock and discount percentage
bundleSchema.pre('save', async function (next) {
  const bundle = this;

  let lowestStock = Infinity;
  let totalValueWithoutDiscount = 0;
  let totalBundleValue = bundle.price;

  for (const bundleItem of bundle.items) {
    const item = await Item.findById(bundleItem.itemId).exec();
    if (item) {
      const availableStock = Math.floor(item.stock / bundleItem.quantity);
      lowestStock = Math.min(lowestStock, availableStock);

      totalValueWithoutDiscount += item.price * bundleItem.quantity;
    } else {
      // Handle the case where an item does not exist
      next(new Error('One or more items in the bundle do not exist.'));
      return;
    }
  }

  bundle.stock = lowestStock;
  bundle.discountPercentage =
    ((totalValueWithoutDiscount - totalBundleValue) /
      totalValueWithoutDiscount) *
    100;

  next();
});

const Bundle = mongoose.model('Bundle', bundleSchema);

export default Bundle;

import mongoose from 'mongoose';
import Order from '~/server/models/Order.js'; // Assuming you have the Order model in the same directory

// Address Sub-Schema
const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  postalCode: String, 
  country: String,
}, { _id: false });

// Order Sub-Schema
const orderSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
}, { _id: false });

// Affiliate Schema
const affiliateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: addressSchema,
  website: { type: String },
  commissionPercentage: { type: Number, required: true, min: 0, max: 100 },
  totalEarnings: { type: Number, default: 0 },
  affiliateSince: { type: Date },
  uniqueCode: { type: String, required: true, unique: true },
  orders: [orderSchema],
  customMetadata: {
    type: Map,
    of: String,
  },
});

// Pre-save hook to calculate total earnings based on orders
affiliateSchema.pre('save', async function (next) {
  const affiliate = this;

  // Calculate total earnings based on the orders
  let totalEarnings = 0;

  for (const order of affiliate.orders) {
    const orderDetails = await Order.findById(order.orderId).exec();
    if (orderDetails) {
      // Calculate the commission earned on this order
      const commissionEarned = (orderDetails.totalCost * affiliate.commissionPercentage) / 100;
      totalEarnings += commissionEarned;
    }
  }

  affiliate.totalEarnings = totalEarnings;
  next();
});

// Pre-save hook to ensure unique code generation and record affiliateSince on creation
affiliateSchema.pre('save', function (next) {
  if (!this.uniqueCode) {
    this.uniqueCode = generateUniqueCode(); // Function to generate a unique code
  }

  // Set affiliateSince to the current date if it's not already set (i.e., on creation)
  if (!this.affiliateSince) {
    this.affiliateSince = new Date();
  }

  next();
});

// Function to generate a unique code
function generateUniqueCode() {
  return 'AFF-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

const Affiliate = mongoose.model('Affiliate', affiliateSchema);

export default Affiliate;

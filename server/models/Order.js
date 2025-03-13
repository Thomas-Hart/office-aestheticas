import mongoose from 'mongoose';

// Address Sub-Schema
const AddressSchema = new mongoose.Schema({
  streetAddress: { type: String, required: true },
  secondaryAddress: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  ZIPCode: { type: String, required: true },
  ZIPPlus4: String,
  urbanization: String,
  firstName: String,
  lastName: String,
  firm: String,
  phone: String,
  email: String,
  ignoreBadAddress: Boolean,
}, { _id: false }); // Prevents _id from being generated for the sub-schema

// Item Variant Reference Schema
const ItemVariantSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item', // Reference to the Item model
    required: true,
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ItemVariant', // Reference to the ItemVariant model, if applicable
  },
  variantDetails: {
    color: {
      name: String,
      hex: String,
    },
    size: String,
    material: String,
    style: String,
    capacity: String,
    flavor: String,
    scent: String,
    power: String,
    length: String,
    region: String,
    weight: Number, // in kilograms
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
  },
  image: String,
  name: String,
  price: { type: Number, required: true }, // Price of the variant at the time of order
  quantity: { type: Number, required: true, min: 1 }, // Quantity ordered
}, { _id: false });

// Order Schema
const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: false, // If guest checkout
  },
  invoiceNumber: { type: String, required: true },
  orderDate: { type: Date, default: Date.now }, // Use Date type for dates
  shippedDate: Date,
  expectedDeliveryDate: Date,
  deliveryDate: Date,
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  totalCost: { type: Number, required: true },
  itemizedList: {
    type: [ItemVariantSchema], // List of items with variants and quantities
    required: true,
  },
  salesTax: { type: Number },
  salesTaxRate: { type: Number },
  buyersBillingAddress: {
    type: AddressSchema,
    required: false
  },
  buyersShippingAddress: {
    type: AddressSchema,
  },
  sellersBusinessInformation: {
    businessName: { type: String },
    address: { type: AddressSchema },
    taxIDNum: { type: String },
  },
  paymentMethod: { type: String },
  trackingNumber: String,
  associatedEmail: { type: String,
    required: true,
   },
}, { timestamps: true });

// Pre-save hook to calculate totalCost dynamically
OrderSchema.pre('save', function (next) {
  if (!this.isModified('itemizedList')) return next();

  this.totalCost = this.itemizedList.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  next();
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;

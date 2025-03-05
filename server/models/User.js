import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const cartItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant', default: null },
  color: { type: String },
  size: { type: String },
  material: { type: String },
  style: { type: String },
  capacity: { type: String },
  flavor: { type: String },
  scent: { type: String },
  power: { type: String },
  length: { type: String },
  region: { type: String },
  quantity: { type: Number, required: true, min: 1 },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    phone: {
      type: String,
      default: '',
    },
    street: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    zip: {
      type: String,
      default: '',
    },
  },
  password: {
    type: String,
    required: false,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  shippingAddresses: [
    {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      isPrimary: { type: Boolean, default: false },
    },
  ],
  cart: {
    type: [cartItemSchema],
    default: [],
  },
  wishlist: [
    {
      _id: false, // Add this line
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
      },
      name: String,
      image: String,
    },
  ],
  recentlyViewedItems: [
    {
      _id: false, // Add this line
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
      },
      name: String,
      image: String,
    },
  ],
  paymentMethods: [
    {
      cardType: String,
      last4Digits: String,
      expirationDate: String,
      cardholderName: String,
      billingAddress: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
      },
    },
  ],
  accountSettings: {
    emailPreferences: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true },
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare given password with the hashed one in the database
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Clear model cache
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const User = mongoose.model('User', userSchema);

export default User;

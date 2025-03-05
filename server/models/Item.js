import mongoose from 'mongoose';

// Dimensions Sub-Schema
const dimensionsSchema = new mongoose.Schema({
  length: Number, // in centimeters
  width: Number,  // in centimeters
  height: Number, // in centimeters
}, { _id: false });

// Color Sub-Schema
const colorSchema = new mongoose.Schema({
  name: { type: String }, // Color name (e.g., 'Red')
  hex: { type: String } // Hex code (e.g., '#FF0000')
}, { _id: false }); // Prevents _id from being generated for the sub-schema

// Variant Sub-Schema
const variantSchema = new mongoose.Schema({
  color: colorSchema,    // Variant color (e.g., Red, Blue)
  size: String,     // Size (e.g., Small, Medium, Large)
  //material: String, // Material (e.g., Cotton, Polyester)
  //style: String,    // Style (e.g., Modern, Classic)
  //capacity: String, // Capacity/Volume (e.g., 500ml, 1L)
  //flavor: String,   // Flavor or scent (e.g., Vanilla, Mint)
  //scent: String,    // Scent (e.g., Air Sprays, Candles)
  //power: String,    // Power rating for electronics (e.g., 500W, 1000W)
  //length: String,   // Length variant (e.g., 1m, 2m for cables or ropes)
  //region: String,   // Region (e.g., US, EU for regional variants)
  
  price: { type: Number, required: true },   // Price for the variant
  oldPrice: { type: Number },                // Original price before discount
  savingsAmount: { type: Number },           // Calculated: oldPrice - price
  savingsPercentage: { type: String },       // Calculated: ((savingsAmount / oldPrice) * 100) + '%'

  image: String,    // Image specific to this variant
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  sku: { type: String, unique: true, sparse: true }, // Unique SKU for this variant
  
  weight: Number,   // Weight of the variant in kilograms
  dimensions: dimensionsSchema, // Dimensions (length, width, height) of the variant

});

// Subscription Options Sub-Schema
const subscriptionOptionsSchema = new mongoose.Schema({
  interval: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
  price: Number,
  discountPercentage: Number,
}, { _id: false });

// Gift Options Sub-Schema
const giftOptionsSchema = new mongoose.Schema({
  isGiftWrappable: { type: Boolean, default: false },
  availableGiftMessages: [String],
}, { _id: false });

// Affiliate Info Sub-Schema
const affiliateInfoSchema = new mongoose.Schema({
  affiliateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate' },
  commissionPercentage: Number,
}, { _id: false });

// Age Restriction Sub-Schema
const ageRestrictionSchema = new mongoose.Schema({
  minimumAge: Number,
  warningMessage: String,
}, { _id: false });

// Warranty Sub-Schema
const warrantySchema = new mongoose.Schema({
  durationInMonths: Number,
  warrantyDetails: String,
  provider: String,
}, { _id: false });

// Shipping Info Sub-Schema
const shippingInfoSchema = new mongoose.Schema({
  weight: Number, // in kilograms
  dimensions: dimensionsSchema,
  freeShippingEligible: { type: Boolean, default: false },
  availableRegions: [String],
  estimatedDeliveryTime: String, // e.g., "3-5 business days"
}, { _id: false });

// Product Video Sub-Schema
const productVideoSchema = new mongoose.Schema({
  url: String,
  description: String,
}, { _id: false });

// Main Item Schema
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number }, // Original price before discount
  savingsAmount: { type: Number }, // Calculated: oldPrice - price
  savingsPercentage: { type: String }, // Calculated: ((savingsAmount / oldPrice) * 100) + '%'
  preview: String,
  description: String,
  image: String,
  moreImages: [String],
  tags: [String],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  variants: [variantSchema],
  subscriptionOptions: [subscriptionOptionsSchema],
  giftOptions: giftOptionsSchema,
  affiliateInfo: [affiliateInfoSchema],
  ageRestriction: ageRestrictionSchema,
  warranty: warrantySchema,
  shippingInfo: shippingInfoSchema,
  frequentlyBoughtTogether: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  productVideos: [productVideoSchema],
  lifecycleStatus: { type: String, enum: ['Active', 'Discontinued', 'Coming Soon'], default: 'Active' },
  // salesChannels: [String], // e.g., ['online', 'retail', 'wholesale']
  reviewCount: {
    type: Number,
    default: 0
  },
  ratings: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

// Pre-save hook to calculate savings for the main item and each variant
itemSchema.pre('save', function (next) {
  // Calculate savings amount and percentage for the main item
  if (this.oldPrice && this.price) {
    this.savingsAmount = this.oldPrice - this.price;
    if (this.oldPrice > 0) {
      this.savingsPercentage = ((this.savingsAmount / this.oldPrice) * 100).toFixed(0) + '%';
    } else {
      this.savingsPercentage = '0%';
    }
  } else {
    this.savingsAmount = 0;
    this.savingsPercentage = '0%';
  }

  // Calculate savings for each variant
  if (this.variants && this.variants.length > 0) {
    this.variants.forEach((variant, index) => {
      if (variant.oldPrice && variant.price) {
        variant.savingsAmount = variant.oldPrice - variant.price;
        if (variant.oldPrice > 0) {
          variant.savingsPercentage = ((variant.savingsAmount / variant.oldPrice) * 100).toFixed(0) + '%';
        } else {
          variant.savingsPercentage = '0%';
        }
      } else {
        variant.savingsAmount = 0;
        variant.savingsPercentage = '0%';
      }

      // Generate SKU for the variant
      if (!variant.sku) {
        const attributes = [
          variant.color?.name || '',
          variant.size || '',
          // variant.material || '',
          // variant.style || '',
          // variant.capacity || '',
          // variant.flavor || '',
          // variant.scent || '',
          // variant.power || '',
          // variant.region || '',
        ].filter(Boolean).join('-');

        // Ensure SKU is unique for each variant
        variant.sku = `${this.name.replace(/\s+/g, '').toUpperCase()}-${attributes}-${index + 1}`;
      }
    });
  }

  // Calculate discount for each subscription option
  if (this.subscriptionOptions && this.subscriptionOptions.length > 0 && this.price) {
    this.subscriptionOptions.forEach(option => {
      if (option.price && this.price > 0) {
        const calculatedDiscount = ((this.price - option.price) / this.price) * 100;
        option.discountPercentage = calculatedDiscount.toFixed(0);
      } else {
        option.discountPercentage = '0';
      }
    });
  }

  next();
});

const Item = mongoose.model('Item', itemSchema);

export default Item;

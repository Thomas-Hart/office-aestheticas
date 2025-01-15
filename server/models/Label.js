import mongoose from 'mongoose';

// Define the Address schema
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
  ignoreBadAddress: Boolean
});

// Define the Package Description schema
const PackageDescriptionSchema = new mongoose.Schema({
  weightUOM: String,
  weight: { type: Number, required: true },
  dimensionsUOM: String,
  length: { type: Number, required: true },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  girth: Number,
  mailClass: { type: String, required: true },
  rateIndicator: { type: String, required: true },
  processingCategory: { type: String, required: true },
  destinationEntryFacilityType: { type: String, required: true },
  packageOptions: Object,
  customerReference: Array,
  extraServices: Array,
  mailingDate: Date, // ALSO REQUIRED BUT GOING TO SET IN PORTAL
  carrierRelease: Boolean,
  carrierPickup: Boolean,
  physicalSignatureRequired: Boolean
});

// Define the Label Schema
const LabelSchema = new mongoose.Schema({
  username: { type: String, required: true, index: true }, // Indexed for faster queries
  toAddress: { type: AddressSchema, required: true},
  fromAddress: { type: AddressSchema, required: true},
  packageDescription: { type: PackageDescriptionSchema, required: true}
});

// Create the Label model
const Label = mongoose.model('Label', LabelSchema);

export default Label;

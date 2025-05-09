import mongoose from 'mongoose';

// Job Application Schema
const JobApplicationSchema = new mongoose.Schema({
  jobTitle: { 
    type: String, 
    required: true 
  },
  company: { 
    type: String, 
    required: true 
  },
  appliedDate: { 
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    required: true,
    enum: ['Applied', 'Interview', 'Offer', 'Accepted', 'Rejected'],
    default: 'Applied'
  },
  jobLink: String,
  expectedSalary: Number,       // your target or listed salary
  offerAmount: Number,          // actual offer if extended
  notes: String                 // any additional notes or follow‑up dates
}, {
  timestamps: true              // adds createdAt & updatedAt
});

// (Optional) Pre-save hook: automatically set offerAmount to 0 if no offer
JobApplicationSchema.pre('save', function(next) {
  if (this.status !== 'Offer' && this.status !== 'Accepted') {
    this.offerAmount = undefined;
  }
  next();
});

const JobApplication = mongoose.model('JobApplication', JobApplicationSchema);

export default JobApplication;

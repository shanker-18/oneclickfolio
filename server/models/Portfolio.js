import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  urlSlug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    default: 'Professional Portfolio'
  },
  // Self.so's exact resume data structure
  header: {
    name: String,
    shortAbout: String,
    location: String,
    photoUrl: String,
    contacts: {
      website: String,
      email: String,
      phone: String,
      twitter: String,
      linkedin: String,
      github: String
    },
    skills: [String]
  },
  summary: String,
  workExperience: [{
    company: String,
    link: String,
    location: String,
    contract: String,
    title: String,
    start: String,
    end: String,
    description: String
  }],
  education: [{
    school: String,
    degree: String,
    start: String,
    end: String
  }],
  // Projects section
  projects: [{
    name: String,
    title: String,        // Alternative name field
    description: String,
    technologies: [String],
    liveUrl: String,
    githubUrl: String,
    demoUrl: String,
    startDate: String,
    endDate: String,
    duration: String,
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'planned', 'on-hold'],
      default: 'completed'
    }
  }],
  // Certificates section
  certificates: [{
    name: String,
    issuer: String,
    year: String,
    credentialId: String,
    link: String
  }],
  // Achievements and Awards section
  achievements: [{
    title: String,
    issuer: String,
    year: String,
    description: String
  }],
  // UI theme selection per portfolio
  themeKey: {
    type: String,
    default: 'indigoPurple' // maps to gradient/style in frontend
  },
  // Optional persona and dynamic extra sections to cover diverse resume types
  personaType: {
    type: String,
    enum: ['academic', 'student', 'freelancer', 'professional', 'other'],
    default: 'professional'
  },
  extraSections: [
    {
      key: String,           // e.g., 'publications', 'projects', 'awards'
      title: String,         // Display title
      // Items are flexible objects; we allow arbitrary fields for future-proofing
      items: [
        {
          type: Object,
          default: {}
        }
      ]
    }
  ],
  // Metadata
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
PortfolioSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Portfolio', PortfolioSchema);

import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  text: String,
});

const paragraphSchema = new mongoose.Schema({
  text: String,
});

const listItemSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const listSchema = new mongoose.Schema({
  title: String,
  items: [listItemSchema],
});

const imageSchema = new mongoose.Schema({
  url: String,
  caption: String,
});

const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
});

const pollOptionSchema = new mongoose.Schema({
  option: String,
  votes: {
    type: Number,
    default: 0,
  },
});

const pollSchema = new mongoose.Schema({
  question: String,
  options: [pollOptionSchema],
});

const videoSchema = new mongoose.Schema({
  url: String,
  caption: String,
});

const subheadingSchema = new mongoose.Schema({
  text: String,
});

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['paragraph', 'list', 'image', 'quiz', 'poll', 'video', 'subheading'],
    required: true,
  },
  paragraph: paragraphSchema,
  list: listSchema,
  image: imageSchema,
  quiz: quizSchema,
  poll: pollSchema,
  video: videoSchema,
  subheading: subheadingSchema,
});

const sectionSchema = new mongoose.Schema({
  title: String,
  content: [contentSchema],
});

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  image: String, // URL to the author's image
});

const commentSchema = new mongoose.Schema({
  name: String,
  comment: String,
  date: {
    type: Date,
    default: Date.now,
  },
  url: String
});

const blogSchema = new mongoose.Schema({
  mainTitle: String,
  metaTitle: String, // Meta title for SEO
  metaDescription: String, // Meta description for SEO
  date: {
    type: Date,
    default: Date.now,
  },
  author: authorSchema, // Refined author field
  intro: String,
  sections: [sectionSchema],
  references: [String],
  image: String,
  thumbnail: String,
  preview: String,
  tags: [String],
  structuredData: {
    type: Object, // Keeping structuredData as a plain object
    default: {},
  },
  updated: updateSchema,
  views: { type: Number, default: 0 },
  comments: [commentSchema], // Array of comments
});

// Pre-save hook to calculate word count and any other computed fields
blogSchema.pre('save', function (next) {
  let wordCount = this.intro ? this.intro.split(/\s+/).length : 0;

  // Calculate the word count for each section's content
  this.sections.forEach((section) => {
    section.content.forEach((contentItem) => {
      if (contentItem.type === 'paragraph') {
        wordCount += contentItem.paragraph.text.split(/\s+/).length;
      } else if (contentItem.type === 'list') {
        wordCount += contentItem.list.items.reduce((count, item) => {
          return count + item.title.split(/\s+/).length + item.description.split(/\s+/).length;
        }, 0);
      } else if (contentItem.type === 'subheading') {
        wordCount += contentItem.subheading.text.split(/\s+/).length;
      }
    });
  });

  // Calculate reading time based on average reading speed of 200 words per minute
  const readingTime = Math.ceil(wordCount / 200);

  // Update the word count and reading time in structured data
  if (!this.structuredData) {
    this.structuredData = {};
  }
  this.structuredData.wordCount = wordCount;
  this.structuredData.readingTime = `${readingTime} minute${readingTime > 1 ? 's' : ''}`;

  // Ensure Mongoose detects changes in the structuredData object
  this.markModified('structuredData');

  next();
});



const Blog = mongoose.model('Blog', blogSchema);

export default Blog;

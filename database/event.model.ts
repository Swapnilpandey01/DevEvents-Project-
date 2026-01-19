// import mongoose, { Schema, Document } from 'mongoose';

// // TypeScript interface for Event
// export interface IEvent extends Document {
//   title: string;
//   slug: string;
//   description: string;
//   overview: string;
//   image: string;
//   venue: string;
//   location: string;
//   date: string;
//   time: string;
//   mode: string;
//   audience: string;
//   agenda: string[];
//   organizer: string;
//   tags: string[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// // Utility to generate URL-friendly slug
// const toSlug = (title: string) =>
//   title
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/^-+|-+$/g, '');

// const EventSchema = new Schema<IEvent>({
//   title: { type: String, required: true, trim: true },
//   slug: { type: String, unique: true, trim: true, index: true },
//   description: { type: String, required: true, trim: true },
//   overview: { type: String, required: true, trim: true },
//   image: { type: String, required: true, trim: true },
//   venue: { type: String, required: true, trim: true },
//   location: { type: String, required: true, trim: true },
//   date: { type: String, required: true, trim: true },
//   time: { type: String, required: true, trim: true },
//   mode: { type: String, required: true, trim: true },
//   audience: { type: String, required: true, trim: true },
//   agenda: { type: [String], required: true },
//   organizer: { type: String, required: true, trim: true },
//   tags: { type: [String], required: true },
// }, {
//   timestamps: true,
//   strict: true,
// });

// // Pre-save hook: Generate slug, validate & normalize date/time
// EventSchema.pre<IEvent>("save", function (next) {
//   // Slug generation only if title changed
//   if (this.isModified("title")) {
//     this.slug = toSlug(this.title);
//   }

//   // Normalize date to ISO, ensure non-empty time
//   if (this.isModified("date")) {
//     const parsedDate = new Date(this.date);
//     if (isNaN(parsedDate.getTime())) {
//       return Promise.reject(new Error("Invalid date format. Use ISO or recognized format."));
//     }
//     this.date = parsedDate.toISOString().substring(0, 10); // store YYYY-MM-DD
//   }

//   if (!/^\d{2}:\d{2}/.test(this.time)) {
//     return Promise.reject(new Error("Invalid time format. Use HH:MM (24hr)."));
//   }

//   // Required field validation
//   const requiredFields = [
//     'title', 'description', 'overview', 'image', 'venue', 'location', 'date', 'time',
//     'mode', 'audience', 'agenda', 'organizer', 'tags'
//   ];
//   for (const field of requiredFields) {
//     if (!this.get(field) || (Array.isArray(this.get(field)) && this.get(field).length === 0)) {
//       return Promise.reject(new Error(`${field} is required.`));
//     }
//   }

//   return Promise.resolve();
// });

// export const Event =
//   mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);




import { Schema, model, models, Document } from 'mongoose';

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
      maxlength: [500, 'Overview cannot exceed 500 characters'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be either online, offline, or hybrid',
      },
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one agenda item is required',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one tag is required',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Pre-save hook for slug generation and data normalization
EventSchema.pre('save', async function () {
  const event = this as IEvent;

  // Generate slug only if title changed or document is new
  if (event.isModified('title') || event.isNew) {
    event.slug = generateSlug(event.title);
  }

  // Normalize date to ISO format if it's not already
  if (event.isModified('date')) {
    event.date = normalizeDate(event.date);
  }

  // Normalize time format (HH:MM)
  if (event.isModified('time')) {
    event.time = normalizeTime(event.time);
  }

  // success: simply completes

});

// Helper function to generate URL-friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to normalize date to ISO format
function normalizeDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
}

// Helper function to normalize time format
function normalizeTime(timeString: string): string {
  // Handle various time formats and convert to HH:MM (24-hour format)
  const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
  const match = timeString.trim().match(timeRegex);
  
  if (!match) {
    throw new Error('Invalid time format. Use HH:MM or HH:MM AM/PM');
  }
  
  let hours = parseInt(match[1]);
  const minutes = match[2];
  const period = match[4]?.toUpperCase();
  
  if (period) {
    // Convert 12-hour to 24-hour format
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
  }
  
  if (hours < 0 || hours > 23 || parseInt(minutes) < 0 || parseInt(minutes) > 59) {
    throw new Error('Invalid time values');
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

// Create unique index on slug for better performance
EventSchema.index({ slug: 1 }, { unique: true });

// Create compound index for common queries
EventSchema.index({ date: 1, mode: 1 });

const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;
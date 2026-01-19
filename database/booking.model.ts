// import mongoose, { Schema, Document, Types } from 'mongoose';
// import { Event } from './event.model';

// // TypeScript interface for Booking
// export interface IBooking extends Document {
//   eventId: Types.ObjectId;
//   email: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const BookingSchema = new Schema<IBooking>({
//   eventId: {
//     type: Schema.Types.ObjectId,
//     ref: 'Event',
//     required: true,
//     index: true, // Index for fast event lookups
//   },
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//   },
// }, {
//   timestamps: true,
//   strict: true,
// });

// // Pre-save hook: Validate event reference, check email format
// BookingSchema.pre<IBooking>('save', async function (next) {
//   // Validate eventId references existing Event
//   const eventExists = await Event.exists({ _id: this.eventId });
//   if (!eventExists) {
//     return Promise.reject(new Error('Referenced Event does not exist.'));
//   }

//   // Validate email format
//   const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
//   if (!emailRegex.test(this.email)) {
//     return Promise.reject(new Error('Invalid email format.'));
//   }
//   return Promise.resolve();
// });

// export const Booking =
//   mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);



import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          // RFC 5322 compliant email validation regex
          const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Pre-save hook to validate events exists before creating booking
BookingSchema.pre('save', async function () {
  const booking = this as IBooking;

  // Only validate eventId if it's new or modified
  if (booking.isModified('eventId') || booking.isNew) {
    try {
      const eventExists = await Event.findById(booking.eventId).select('_id');

      if (!eventExists) {
        const error = new Error(`Event with ID ${booking.eventId} does not exist`);
        error.name = 'ValidationError';
        throw error;
      }
    } catch {
      const validationError = new Error('Invalid events ID format or database error');
      validationError.name = 'ValidationError';
      throw validationError;
    }
  }

  // success: simply completes

});

// Create index on eventId for faster queries
BookingSchema.index({ eventId: 1 });

// Create compound index for common queries (events bookings by date)
BookingSchema.index({ eventId: 1, createdAt: -1 });

// Create index on email for user booking lookups
BookingSchema.index({ email: 1 });

// Enforce one booking per events per email
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true, name: 'uniq_event_email' });
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
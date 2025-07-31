
import mongoose from 'mongoose';

//const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI ="mongodb+srv://mustafaghouri64:Mustafa07!@cluster0.k71xwil.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

if (!MONGODB_URI) throw new Error('Please define MONGODB_URI in .env.local');

let cached = global.mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

if (process.env.NODE_ENV !== 'production') global.mongoose = cached;

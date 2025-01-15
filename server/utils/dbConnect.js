import mongoose from 'mongoose';
import { incrementConnectionCount, getConnectionCount } from './dbConnectionState';

export const connectDB = async () => {
  const config = useRuntimeConfig();
  const MONGODB_URI = config.DB_URI;

  // console.log("config.DB_URI: ", MONGODB_URI);
  // console.log("Mongoose connection state before: ", mongoose.connection.readyState);

  if (mongoose.connection.readyState === 1) {
    // console.log('Database already connected');
    incrementConnectionCount();
    return;
  }

  if (mongoose.connection.readyState === 2) {
    // console.log('Database connection is in progress');
    return new Promise((resolve, reject) => {
      mongoose.connection.once('connected', () => {
        // console.log('Database connected');
        incrementConnectionCount();
        resolve();
      });
      mongoose.connection.once('error', (err) => {
        console.error('Database connection error:', err);
        reject(err);
      });
    });
  }

  try {
    await mongoose.connect(MONGODB_URI);
    incrementConnectionCount();
    // console.log('Database connected');
  } catch (err) {
    console.error('Database connection error:', err);
    throw new Error('Database connection failed');
  }
};

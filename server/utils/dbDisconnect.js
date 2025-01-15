import mongoose from 'mongoose';
import { decrementConnectionCount, getConnectionCount } from './dbConnectionState';

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 1) {
    // console.log('Database is not connected. Cannot disconnect.');
    return;
  }

  if (getConnectionCount() > 1) {
    decrementConnectionCount();
    // console.log('Decreased connection count, not disconnecting yet.');
    return;
  }

  try {
    await mongoose.disconnect();
    decrementConnectionCount();
    // console.log('Database disconnected');
  } catch (err) {
    console.error('Database disconnection error:', err);
    throw new Error('Database disconnection failed');
  }
};

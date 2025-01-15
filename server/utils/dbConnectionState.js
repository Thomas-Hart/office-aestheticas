// server/utils/dbConnectionState.js
let connectionCount = 0;

export const incrementConnectionCount = () => {
  connectionCount += 1;
  // console.log('Connection count increased to:', connectionCount);
};

export const decrementConnectionCount = () => {
  if (connectionCount > 0) {
    connectionCount -= 1;
    // console.log('Connection count decreased to:', connectionCount);
  }
};

export const getConnectionCount = () => {
  return connectionCount;
};

#!/usr/bin/env node

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
  process.exit(1);
});

console.log('Starting test...');
try {
  require('./src/server.js');
  setTimeout(() => {
    console.log('Server loaded successfully');
    process.exit(0);
  }, 2000);
} catch (err) {
  console.error('CAUGHT ERROR:', err.message);
  console.error('STACK:', err.stack);
  process.exit(1);
}



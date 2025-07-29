import './utils/dotenv.ts';
import './utils/db.ts';
import app from './app.ts';

const server = app.listen(Number(process.env.PORT) || 3000, '0.0.0.0', () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', (err: Error) => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated! 💥');
  });
});

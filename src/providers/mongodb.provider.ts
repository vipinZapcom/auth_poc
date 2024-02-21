import mongoose from 'mongoose';

export async function createMongoDBConnection() {
  const mongoDbUri = String(process.env.MONGODB_URI);
  try {
    console.log('Connecting to mongoDb');
    const connection = await mongoose.connect(mongoDbUri);
    console.log('connected to mongoDb');
    return connection;
  } catch (error) {
    console.log('Failed connecting to mongoDb', error);
    return {
      error: error,
      isError: true,
      statusCode: 500,
      data: [],
    };
  }
}

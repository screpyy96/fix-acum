import mongoose from 'mongoose';

let cachedConnection = null;

const connectToDatabase = async () => {
    if (cachedConnection) {
        console.log("Using cached database connection");
        return cachedConnection;
    }

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }

    console.log("Attempting to connect to MongoDB...");
    const startTime = Date.now();

    try {
        const connection = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout după 5 secunde
            // Adaugă alte opțiuni de conexiune dacă sunt necesare
        });

        console.log(`Connected to MongoDB in ${Date.now() - startTime}ms`);
        console.log(`Connected to database: ${connection.connection.name}`);

        cachedConnection = connection;
        return connection;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

const disconnectFromDatabase = async () => {
    if (mongoose.connection.readyState !== 0) {
        console.log("Disconnecting from MongoDB...");
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
        cachedConnection = null;
    }
};

export { connectToDatabase, disconnectFromDatabase };





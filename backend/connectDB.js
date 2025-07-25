const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function connectDB() {
    try {
        // Ensuring to wait for the connection to complete
        await mongoose.connect(process.env.MONGODB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to database:', error.message);
        process.exit(1); // Exit the process if connection fails
    }
}

module.exports = connectDB;

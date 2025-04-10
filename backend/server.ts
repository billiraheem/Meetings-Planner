import app from './index';
import connectDB from './src/config/DB';

const PORT = process.env.PORT || 8000;

// Connect to database and start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});

import app from './src/server/server';
import connectDB from './src/config/DB';

const PORT = process.env.PORT || 8080;

// Connect to database and start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});

// import { server } from "./src/server/server";

// const PORT = process.env.PORT || 8080;
// server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
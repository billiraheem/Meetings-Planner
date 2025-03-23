import { server } from "./src/server/server";

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
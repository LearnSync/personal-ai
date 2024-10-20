import express, { type Request, type Response } from "express";

const app = express();
const port = 25989;

// Middleware to parse JSON bodies
app.use(express.json());

// Simple route for testing
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Bun + Express + TypeScript!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

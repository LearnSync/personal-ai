# AI Module - API Handler for Local First AI

This module manages all the AI-related services for `localfirst.ai`. It acts as the AI API handler, implemented as a Tauri Sidecar, using **Node.js**, **TypeScript**, and **Express**. This service facilitates communication between the application and AI models.

## Features

- Handles API requests and responses for AI-related services.
- Integrates with `CloseVector` database for storage and retrieval of vector data.
- Supports interactions with LLMs (Local Language Models) via RESTful API endpoints.

## Tech Stack

- **Language**: TypeScript
- **Framework**: Express (Node.js)
- **Database**: CloseVector (supports both web and node environments)
- **Platform**: Tauri Sidecar

## Setup Instructions

1. **Install Dependencies**:
   Ensure you have Node.js and bun installed.

   ```bash
   bun install
   ```

2. **Run the Project**:
   To start the API handler in a development environment:

   ```bash
   bun start
   ```

3. **Build for Production**:
   To compile the project for production:

   ```bash
   bun build
   ```

## Project Structure

- **/controllers**: Contains the core logic for the API, routes, and service handlers.
- **/database**: Interaction with `CloseVector` database for vector data storage.
- **/routes**: Defines the API endpoints for handling requests.
- **/services**: Manages external interactions with AI models and services.

## API Endpoints

The module exposes various endpoints to interact with the AI models. These are defined within the **/routes** directory.

## Contributing

1. Fork the repository.
2. Create a new feature branch: `git checkout -b my-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin my-feature`
5. Open a Pull Request.

## License

This project is licensed under the GNU v3 [License](../LICENSE).

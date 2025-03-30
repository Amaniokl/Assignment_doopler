# Assignment_doopler

## Overview

Provide a brief description of your project. Explain what it does, its main features, and any important context.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   MONGO_URI=your_mongodb_uri
   ```

## Usage

1. **Start the server:**

   ```bash
   npm start
   ```

2. **Access the application:**

   Open your browser and go to `http://localhost:PORT/api`, replacing `PORT` with the actual port number your server is running on or for using deployed server `https://assignment-doopler.onrender.com/api`.

## Configuration

- **Cloudinary**: Ensure your Cloudinary account is set up and the credentials are correctly added to the `.env` file.
- **MongoDB**: Ensure your MongoDB instance is running and accessible with the URI provided in the `.env` file.

## API Endpoints

### Image Upload

- **POST** `/upload`
  - **Description**: Uploads an image, compresses it, and stores it in Cloudinary.
  - **Request**: `multipart/form-data` with a file field named `image`.
  - **Response**: JSON with the uploaded image URL.

### Fetch Image

- **GET** `/images/:id`
  - **Description**: Fetches an image by its ID.
  - **Response**: JSON with the image URL.

### Delete Image

- **DELETE** `/images/:id`
  - **Description**: Deletes an image by its ID from both Cloudinary and the database.
  - **Response**: JSON with a success message.

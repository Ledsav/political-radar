### Description

**Political Radar** is a React frontend application designed to work with a Python-based backend for fact-checking political statements. This project provides a user-friendly interface for displaying and searching fact-checking data, including average scores for politicians and parties. The application leverages IndexedDB for local caching, ensuring fast and efficient data retrieval.

## Features

- Display average scores by politicians and parties.
- Search functionality for fact-checking items by author and party.
- Local caching using IndexedDB for improved performance.
- Responsive and interactive user interface.

## Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/your-username/political-radar.git
    cd political-radar
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Create a `.env` file** in the root directory and add your Firebase configuration:
    ```plaintext
    REACT_APP_FIREBASE_API_KEY=your-api-key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
    REACT_APP_FIREBASE_PROJECT_ID=your-project-id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    REACT_APP_FIREBASE_APP_ID=your-app-id
    REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
    ```

## Usage

1. **Start the development server**:
    ```sh
    npm start
    ```

2. **Open your browser** and navigate to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License.


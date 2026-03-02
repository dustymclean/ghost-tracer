# GhostTrace OSINT Analyzer

GhostTrace is an advanced Open Source Intelligence (OSINT) tool powered by Google's Gemini 2.5 Flash model. It aggregates public data to generate deep-dive reports, visualizes connections, and facilitates conversational analysis of entities.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1.  **Clone or Download** this repository to your local machine.
2.  Open your terminal and navigate to the project directory.
3.  Install the required dependencies:

    ```bash
    npm install
    ```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal).

### Configuration

You can configure your API Key in two ways:

1.  **Via UI (Recommended):**
    - Launch the app.
    - Click the **Settings (Gear Icon)** in the top-right corner.
    - Paste your API Key and click **Save**. The key is stored securely in your browser's LocalStorage.

2.  **Via Environment Variable:**
    - Create a `.env` file in the root directory.
    - Add your key: `API_KEY=your_actual_api_key_here`
    - Restart the server.

## 🛠️ Tech Stack

-   **Frontend:** React, TypeScript, Vite
-   **Styling:** Tailwind CSS
-   **AI Model:** Google Gemini 2.5 Flash (@google/genai)
-   **Visualization:** D3.js (Network Graphs)
-   **Icons:** Lucide React

## ⚠️ Disclaimer

This tool is designed for educational and authorized research purposes only. Always verify intelligence through primary sources.

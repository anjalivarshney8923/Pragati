# Pragati - Digital Village Portal

A comprehensive digital governance platform for rural citizens, featuring villager registration, complaint management, and fund tracking.

## Features

- Villager registration and authentication
- Complaint filing and tracking
- Village funds visualization (receipts vs payments)
- Multi-language support (English/Hindi)
- Face verification for secure access

## Tech Stack

- **Frontend**: React + Vite, Tailwind CSS, Recharts
- **Backend**: Java Spring Boot
- **AI Service**: Python Flask (face recognition, data processing)
- **Database**: (Add your database details)

## Getting Started

### Prerequisites

- Node.js (v18+)
- Java JDK (v11+)
- Python (v3.8+)
- pip

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pragati
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install AI Service Dependencies**
   ```bash
   cd ai-service
   pip install -r requirements.txt
   cd ..
   ```

4. **Install Backend Dependencies**
   ```bash
   cd backend
   # Add your Java build commands (e.g., mvn install)
   cd ..
   ```

### Running the Application

1. **Start the AI Service** (in one terminal)
   ```bash
   cd ai-service
   python app.py
   ```
   This starts the Flask server on http://localhost:5000

2. **Start the Backend** (in another terminal)
   ```bash
   cd backend
   # Add your Java run command (e.g., mvn spring-boot:run)
   ```

3. **Start the Frontend** (in another terminal)
   ```bash
   npm run dev
   ```
   This starts the React app on http://localhost:5173

### Accessing the Application

- Open http://localhost:5173 in your browser
- The AI service runs on http://localhost:5000
- Backend API endpoints (add details)

## Project Structure

```
pragati/
├── src/                    # React frontend
├── ai-service/            # Python Flask AI service
├── backend/               # Java Spring Boot backend
├── dataset/               # Village funds data
├── public/                # Static assets
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

(Add your license information)

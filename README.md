Chatbot
This repository contains code for a chatbot application, which is divided into frontend (user interface) and backend (Flask server for OpenAI API requests). The chatbot utilizes OpenAI's GPT-3.5 for natural language processing.

Getting Started
Before running the application, you'll need to set up your OpenAI API key. Create a .env file in both the embeddings and backend folders. In the .env file, add your OpenAI API key with the following format:

plaintext
Copy code
OPENAI_API_KEY=your_api_key_here
Frontend
To start the HTTP server for the frontend, follow these steps:

Open your terminal.
Navigate to the root folder of this repository.
Run the following command:
bash
Copy code
python3 -m http.server 8080
You can access the frontend at http://localhost:8080.

Backend
To start the backend server, use the following steps:

Open your terminal.
Navigate to the root folder of this repository.
Run the following command:
bash
Copy code
python3 -m flask --app .\demo_flask.py run
The backend server will start and be ready to handle OpenAI API requests from the frontend.

Embeddings
The embeddings folder contains captions of course videos. The file make_chunks.py is used to create the video_embedd.csv, which contains embeddings for the video captions. These embeddings are loaded in the search_embedd.py file. You can use search_embedd.py to make queries to GPT-3.5 with context related to the videos

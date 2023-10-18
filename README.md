# Chatbot

The code is divided into frontend (user interface) and backend (Flask server for OpenAI API requests). 

### Setup
1. Set up your OPENAI_API_KEY in a .env file. 
   Copy this file into the `embeddings` and `backend` folders. 
   This file should contain one line: OPENAI_API_KEY=your_api_key_here
   
3. Start the HTTP server for the frontend with the following command:
```bash
 python3 -m http.server 8080
```

Access it through http://localhost:8080

3. Start the backend server with the following command:
```bash
 python3 -m flask --app .\demo_flask.py run
```

### Embeddings
The `embeddings` folder contains some captions of the course videos. The file `make_chunks.py` creates the `video_embedd.csv`, the file containing the embeddings for the captions, which is then loaded in the `search_embedd.py` file. 


![flow](https://github.com/gonfc211/TFG_chatbot/assets/61994178/71dec550-f8c2-474a-b569-ebfd0887e0c0)

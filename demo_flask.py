import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from sys import stderr
import json
import demo_bot


app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return 'Index Page'

@app.route('/sendMessage', methods=['POST'])
def sendMessage():

    user_input = request.get_json()['body']

    print("user input: {}\n".format(user_input), file=stderr)

    demo_bot.context.append({'role':'user', 'content':f"{user_input}"})

    bot_response = demo_bot.get_completion_from_messages(demo_bot.context)

    suggested_questions = suggest_questions(user_input)

    data = {'info': 'received user message', 'user_input': user_input,'bot_response': bot_response, 'suggested_questions': suggested_questions}

    print("bot response: {}\n".format(data), file=stderr)

    demo_bot.context.append({'role':'assistant', 'content':f"{bot_response}"})

    print("FULL CONTEXT: {}\n".format(demo_bot.context), file=stderr)

    return jsonify(data)

@app.route('/sendAudio', methods=['POST'])
def sendAudio():
    
    user_audio_bytes = request.data

    print("user audio:" ,type(user_audio_bytes), file=stderr)

    with open(os.getcwd()+'/audio_whisper/file.wav', 'wb') as f:
        f.write(user_audio_bytes)
   
    audio_file = open(os.getcwd()+'/audio_whisper/file.wav', 'rb')
    
    user_input = demo_bot.get_transcritpion_from_message(audio_file)

    print("user input: {}\n".format(user_input), file=stderr)

    data = {'info': 'received user voice', 'user_input': user_input}

    return jsonify(data)


def suggest_questions(last_question):
    

    suggested_questions = demo_bot.get_completion_from_messages([{'role': 'user', 'content': 'Sugiere 3 preguntas que un usuario podria hacer a partir de: '+last_question +'\nResponde solamente con las preguntas en formato json de la forma {\"pregunta1\": \"...\", ...}'}])

    
    print('type: {}'.format(type(suggested_questions)), file=stderr)
    try:
       
        questions = json.loads(suggested_questions)
        print('suggested: '+suggested_questions)
    except Exception as ex:
        print(ex, file=stderr)
        questions = {'error': 'no questions suggested'}
        print('suggested: '+suggested_questions)

    return questions
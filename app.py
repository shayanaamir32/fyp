import json
import numpy as np
import pickle
from langdetect import detect, LangDetectException
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app,cors_allowed_origins="*",logger=True,engineio_logger=True)

with open('intent_classifier.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

with open('label_map.pkl', 'rb') as label_file:
    label_map = pickle.load(label_file)

reverse_label_map = {idx: label for label, idx in label_map.items()}

with open('data.json') as f:
    data = json.load(f)
    
intent_responses = {
    intent['intent']: intent['responses']
    for intent in data['intents']
}

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('query')
    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    predicted_label = model.predict([user_input])[0]
    intent = reverse_label_map[predicted_label]
    response = np.random.choice(intent_responses[intent])
    return jsonify({"response": response})


@socketio.on("connect")
def handle_connect():
    emit("connection_status", {"status": "connected"})

@socketio.on("disconnect")
def handle_disconnect():
    emit("connection_status", {"status": "disconnected"})

@socketio.on('chat')
def handle_chat_socket(json_payload):
    """ Socket for chatbot"""
    
    user_input = json_payload.get('query')
    print("user input" , user_input)    
    if not user_input:
        emit('bot_response', {'error': 'No input provided'})
        return
    predicted_label = model.predict([user_input])[0]
    intent = reverse_label_map[predicted_label]

    response = np.random.choice(intent_responses[intent])
    emit('bot_response', {'response': response})

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)

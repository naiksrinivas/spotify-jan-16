from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from config import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI

app = Flask(__name__)
CORS(app)

# Spotify API endpoints
AUTH_URL = 'https://accounts.spotify.com/authorize'
TOKEN_URL = 'https://accounts.spotify.com/api/token'

@app.route('/login')
def login():
    scope = 'playlist-read-private playlist-read-collaborative'
    auth_url = f'{AUTH_URL}?client_id={CLIENT_ID}&response_type=code&redirect_uri={REDIRECT_URI}&scope={scope}'
    return jsonify({"auth_url": auth_url})

@app.route('/callback')
def callback():
    code = request.args.get('code')
    
    auth_options = {
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'grant_type': 'authorization_code'
    }
    
    response = requests.post(
        TOKEN_URL,
        auth=(CLIENT_ID, CLIENT_SECRET),
        data=auth_options
    )
    
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(port=5000) 
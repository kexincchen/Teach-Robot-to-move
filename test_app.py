from flask import Flask
app = Flask(__name__)
@app.route('/')
def index():
    return "Welcome to my Flask app!"

def test_index():
    client = app.test_client()
    response = client.get('/')
    
    assert response.status_code == 200
    assert b"Welcome to my Flask app!" in response.data
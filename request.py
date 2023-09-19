import requests

# URL of your Flask server
url = 'http://127.0.0.1:5000/processing/generate-command'  # replace 'your_endpoint' with the appropriate route on your Flask server

# Data you want to send
data = {
    'input_text': 'hello'

}

# Send POST request
response = requests.post(url, json=data)

# Print response
print(response.status_code)  # Should print 200 for success
print(response.text)  # Response content

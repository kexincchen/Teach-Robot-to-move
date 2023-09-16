# COMP30022-IT-Project
## Overview
This project focuses on harnessing the power of Speech-to-Text (STT) technology to offer an interactive web-based application centered around voice interactions.

## Setup

### Local Environment
1. Download the `python` if there does not already exist
2. `cd COMP30022-IT-Project`
3. `pip install -r requirements.txt` (or `pip3 install -r requirements.txt`)

### Database Configuration
1. Go to the MongoDB website and sign in with your account
2. Create a new cluster with the server that is close to your location (e.g. Sydney)
3. Create a new Database named `Robot` and a new Collection named `User`
4. Add a new data item to the collection. Here is an example: 
```json
{"username": "admin", 
 "password": "1234567"}
```
Make sure that the length of username is smaller than 20, and the length of password is greater than 6 and less than 20.

### Google Cloud Key json file
1. Enter the website: https://cloud.google.com/speech-to-textLogin. 
2. Login your google account and click "Try it free". Register your Google Cloud account.
3. Click "Go to console" and create a Google Cloud Project 
4. Enter the "APIs and services/Library" in the navigation menu drop-down menu in the top-left corner. Search for "Cloud Speech-to-Text API " and enable the API.
5. Enter the "APIs and services/Credentials". Click the "Create Credential" and create a service account.
6. Click the created account in "Service account", then enter the "KEYS" tab. Add a new json key (A json file would be downloaded).
7. Move the json file into the project root directory. In app.py, Substitute "path/of/the/json" with your json file path.
```angular2html
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'path/of/the/json'
```


## How to run?

### Run without database (a basic web without admin authentication)
Simply run by typing `python main.py` in the command line (or `python3 main.py`)

### Run with database 
1. Create a new file named `config.py` and fill it with your database configuration
The template is: 
```python
# MongoDB-URL Template: 
# mongodb+srv://<username>:<password>@<connection name>.xxxxxxxx.mongodb.net
# which can be seen in the 'connection' tab on the mongodb server
MONGO_URI ="<MongoDB-URI>/Robot"
MONGO_DBNAME = "Robot"

SECRET_KEY = "<Your secret key>"  
```
2. Start running: `python app.py` (or `python3 app.py`) (or `flask run`) 


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
3. Create a new database called "Robot"
3. Add collections ("API","Command","User")  into the "Robot" database. You do not need to insert any data into the collections, but make sure the names of the three collection are correct.

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

### OpenAI API KEY

1. Create a new file in the root named `.env`
2. Fill in the environment

```
OPENAI_API_KEY = <Your OpenAI API Key>
```

## How to run this project on your local machine?

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

2. Start running: `flask run` (or `python3 app.py`)

## How to use our API

1. Open the [request.py](https://github.com/kexincchen/COMP30022-IT-Project/blob/main/request.py)
2. Replace the audio file with your own
3. Run `python request.py`

from flask import Flask, request, jsonify
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import os
import tempfile
from app import app

# Google Drive setup
SCOPES = ['https://www.googleapis.com/auth/drive']
SERVICE_ACCOUNT_FILE = 'credentials.json'
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)
drive_service = build('drive', 'v3', credentials=credentials)

# @app.route('/upload-resume', methods=['POST'])



def upload_resume(request):
    # file = 
    # if 'file'  not in request.files:
    #     return jsonify({'error': 'No file uploaded'}), 400

    file = request.files.get('resume') or request.files.get('file')

    # Save to temp location
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        file.save(tmp.name)
        tmp_path = tmp.name

    # Upload to Google Drive
    file_metadata = {'name': file.filename}
    media = MediaFileUpload(tmp_path, mimetype='application/pdf')
    uploaded_file = drive_service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id, webViewLink'
    ).execute()

    # Optional: Make file public
    drive_service.permissions().create(
        fileId=uploaded_file['id'],
        body={'type': 'anyone', 'role': 'reader'}
    ).execute()

    os.remove(tmp_path)
    print('file_id', uploaded_file['id'], 'view_link',  uploaded_file['webViewLink'])
    return uploaded_file['webViewLink']

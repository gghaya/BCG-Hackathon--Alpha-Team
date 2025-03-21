#!/bin/bash
python -m venv venv
./venv/Scripts/activate
Get-Content script.sql | docker exec -i postgres_db psql -U user -d resume_db


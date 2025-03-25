from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/api/jobs", methods=["POST"])
def create_job():
    print("✅ /api/jobs was hit!")
    return jsonify({"message": "Job received successfully!"})

if __name__ == "__main__":
    app.run(debug=True)

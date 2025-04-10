from app import create_app

app = create_app()

@app.route("/")
def index():
    return {
        "message": "👋 Welcome to the Group Savings App API!",
        "status": "Running",
        "docs": "Refer to /api/* endpoints for available services."
    }

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

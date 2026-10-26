import pandas as pd
import numpy as np

from flask import Flask, request, jsonify #for API
app = Flask(__name__)


#checking if the API is live
@app.get("/health")
def health():
    return jsonify({"status": "healthy"}), 200


@app.post("/api/v1/analyze")
def analyze_transaction():
    transaction = request.get_json()

    if not transaction:
        return jsonify({"error": "Transaction data is required"}), 400

    amount = transaction.get("amount")
    if amount is None:
        return jsonify({"error": "Transaction amount is required"}), 400

    try:
        amount = float(amount)
    except (ValueError, TypeError):
        return jsonify({"error": "Amount must be numeric"}), 400

    
    data = pd.DataFrame({"amount": [amount]})
    average_amount = float(data["amount"].mean())
    risk_score = int(np.clip(average_amount / 10, 0, 100))

  
    return jsonify({
        "id":transaction["flexcubeID"],
        "IBAN":transaction["IBAN"],
        "risk_score": risk_score,
        "status": "REVIEW" if risk_score > 80 else "APPROVED",
        "processed_by": "python-data-service"
    }), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8001, debug=False)

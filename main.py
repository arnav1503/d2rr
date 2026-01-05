import os
import sys

# Add .pythonlibs to path if it exists
lib_path = os.path.join(os.getcwd(), '.pythonlibs')
if os.path.exists(lib_path):
    for root, dirs, files in os.walk(lib_path):
        if 'site-packages' in dirs:
            sys.path.append(os.path.join(root, 'site-packages'))

from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__, static_folder='dist/public')
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Model
class Calculation(db.Model):
    __tablename__ = 'calculations'
    id = db.Column(db.Integer, primary_key=True)
    expression = db.Column(db.Text, nullable=False)
    result = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'expression': self.expression,
            'result': self.result,
            'createdAt': self.created_at.isoformat()
        }

# API Routes
@app.route('/api/calculations', methods=['GET'])
def get_calculations():
    history = Calculation.query.order_by(Calculation.created_at.desc()).limit(50).all()
    return jsonify([c.to_dict() for c in history])

@app.route('/api/calculations', methods=['POST'])
def create_calculation():
    data = request.json
    if not data or 'expression' not in data or 'result' not in data:
        return jsonify({'message': 'Invalid input'}), 400
    
    calc = Calculation(expression=data['expression'], result=data['result'])
    db.session.add(calc)
    db.session.commit()
    return jsonify(calc.to_dict()), 201

@app.route('/api/calculations', methods=['DELETE'])
def clear_calculations():
    Calculation.query.delete()
    db.session.commit()
    return '', 204

# Serve Frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    # Try to use port 5000, if busy it might fail but that is managed by the workflow
    app.run(host='0.0.0.0', port=5000)

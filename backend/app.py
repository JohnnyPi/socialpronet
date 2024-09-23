from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Dummy data (replace with database in production)
users = [
    {"id": 1, "username": "prosocialUser", "email": "user@example.com", "password": "password123"},
]

posts = [
    {"id": 1, "userId": 1, "title": "First Post", "content": "This is the first post content."},
    {"id": 2, "userId": 1, "title": "Second Post", "content": "This is the second post content."},
]

@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify(users)

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = next((user for user in users if user['id'] == user_id), None)
    if user:
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404

@app.route('/api/posts', methods=['GET'])
def get_posts():
    return jsonify(posts)

@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.json
    new_post = {
        "id": len(posts) + 1,
        "userId": data['userId'],
        "title": data['title'],
        "content": data['content']
    }
    posts.append(new_post)
    return jsonify(new_post), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = next((user for user in users if user['username'] == data['username']), None)
    if user and user['password'] == data['password']:
        return jsonify({"message": "Login successful", "userId": user['id']})
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if any(user['username'] == data['username'] for user in users):
        return jsonify({"error": "Username already exists"}), 400
    new_user = {
        "id": len(users) + 1,
        "username": data['username'],
        "email": data['email'],
        "password": data['password']
    }
    users.append(new_user)
    return jsonify({"message": "Registration successful", "userId": new_user['id']}), 201

if __name__ == '__main__':
    app.run(debug=True)
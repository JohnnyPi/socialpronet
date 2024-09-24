import traceback

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from werkzeug.exceptions import HTTPException
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
import os

def create_tables():
    with app.app_context():
        db.create_all()
app = Flask(__name__)
CORS(app)

# Configuration
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')  # Change this!
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://username:password@localhost/dbname')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
jwt = JWTManager(app)
db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('posts', lazy=True))

class MentorshipRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='open')
    mentee_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    mentor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    mentee = db.relationship('User', foreign_keys=[mentee_id], backref=db.backref('mentee_requests', lazy=True))
    mentor = db.relationship('User', foreign_keys=[mentor_id], backref=db.backref('mentor_requests', lazy=True))

class Problem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('problems', lazy=True))
    solutions = db.relationship('Solution', backref='problem', lazy=True)

class Solution(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    problem_id = db.Column(db.Integer, db.ForeignKey('problem.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('solutions', lazy=True))

# Routes
@app.route('/api/problems', methods=['POST'])
@jwt_required()
def create_problem():
    data = request.json
    current_user_id = get_jwt_identity()
    new_problem = Problem(
        title=data['title'],
        description=data['description'],
        user_id=current_user_id
    )
    db.session.add(new_problem)
    db.session.commit()
    return jsonify({
        'id': new_problem.id,
        'title': new_problem.title,
        'description': new_problem.description,
        'user_id': new_problem.user_id
    }), 201

@app.route('/api/problems', methods=['GET'])
def get_problems():
    problems = Problem.query.all()
    return jsonify([
        {
            'id': problem.id,
            'title': problem.title,
            'description': problem.description,
            'user_id': problem.user_id,
            'username': problem.user.username
        } for problem in problems
    ]), 200

@app.route('/api/problems/<int:problem_id>/solutions', methods=['POST'])
@jwt_required()
def add_solution(problem_id):
    data = request.json
    current_user_id = get_jwt_identity()
    new_solution = Solution(
        content=data['content'],
        user_id=current_user_id,
        problem_id=problem_id
    )
    db.session.add(new_solution)
    db.session.commit()
    return jsonify({
        'id': new_solution.id,
        'content': new_solution.content,
        'user_id': new_solution.user_id,
        'problem_id': new_solution.problem_id
    }), 201

@app.route('/api/problems/<int:problem_id>/solutions', methods=['GET'])
def get_solutions(problem_id):
    solutions = Solution.query.filter_by(problem_id=problem_id).all()
    return jsonify([
        {
            'id': solution.id,
            'content': solution.content,
            'user_id': solution.user_id,
            'username': solution.user.username
        } for solution in solutions
    ]), 200

@app.route('/api/mentorship/request', methods=['POST'])
@jwt_required()
def create_mentorship_request():
    data = request.json
    current_user_id = get_jwt_identity()
    new_request = MentorshipRequest(
        title=data['title'],
        description=data['description'],
        mentee_id=current_user_id
    )
    db.session.add(new_request)
    db.session.commit()
    return jsonify({
        'id': new_request.id,
        'title': new_request.title,
        'description': new_request.description,
        'status': new_request.status
    }), 201

@app.route('/api/mentorship/requests', methods=['GET'])
@jwt_required()
def get_mentorship_requests():
    requests = MentorshipRequest.query.filter_by(status='open').all()
    return jsonify([
        {
            'id': req.id,
            'title': req.title,
            'description': req.description,
            'mentee_id': req.mentee_id,
            'mentee_username': req.mentee.username
        } for req in requests
    ]), 200

@app.route('/api/mentorship/accept/<int:request_id>', methods=['POST'])
@jwt_required()
def accept_mentorship_request(request_id):
    current_user_id = get_jwt_identity()
    request = MentorshipRequest.query.get(request_id)
    if not request:
        return jsonify({"error": "Request not found"}), 404
    if request.status != 'open':
        return jsonify({"error": "Request is not open"}), 400
    request.mentor_id = current_user_id
    request.status = 'accepted'
    db.session.commit()
    return jsonify({"message": "Mentorship request accepted"}), 200


@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        if not data:
            return jsonify(error="No data provided"), 400

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not all([username, email, password]):
            return jsonify(error="Missing required fields"), 400

        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return jsonify(error="Username already exists"), 400
        if User.query.filter_by(email=email).first():
            return jsonify(error="Email already exists"), 400

        # Create new user
        new_user = User(username=username, email=email)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify(message="Registration successful"), 201
    except Exception as e:
        app.logger.exception('An error occurred during registration')
        db.session.rollback()
        return jsonify(error="An unexpected error occurred"), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(id=user.id, username=user.username, email=user.email), 200

@app.route('/api/posts', methods=['GET'])
def get_posts():
    posts = Post.query.all()
    return jsonify([
        {
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'user_id': post.user_id,
            'username': post.user.username
        } for post in posts
    ]), 200

@app.route('/api/posts', methods=['POST'])
@jwt_required()
def create_post():
    data = request.json
    current_user_id = get_jwt_identity()
    new_post = Post(title=data['title'], content=data['content'], user_id=current_user_id)
    db.session.add(new_post)
    db.session.commit()
    return jsonify({
        'id': new_post.id,
        'title': new_post.title,
        'content': new_post.content,
        'user_id': new_post.user_id,
        'username': new_post.user.username
    }), 201

@app.errorhandler(Exception)
def handle_error(e):
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    app.logger.error(f'An error occurred: {str(e)}')
    app.logger.error(traceback.format_exc())
    return jsonify(error=str(e)), code

create_tables()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
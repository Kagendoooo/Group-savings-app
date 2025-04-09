from flask import Flask
from flask_cors import CORS
from .extensions import db, migrate, jwt
from .config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Register blueprints
    from .routes import auth_bp, users_bp, groups_bp, transactions_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(groups_bp, url_prefix='/api/groups')
    app.register_blueprint(transactions_bp, url_prefix='/api')
    
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()
    
    @app.route('/api/health')
    def health_check():
        return {"status": "healthy"}
    
    return app

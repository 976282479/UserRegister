from flask import Flask
from flask_cors import CORS
from .routes import api
from .database import init_db

def create_app():
    app = Flask(__name__)
    
    # 配置CORS
    CORS(app)
    
    # 注册蓝图
    app.register_blueprint(api, url_prefix='/api')
    
    # 初始化数据库
    with app.app_context():
        init_db()
    
    return app
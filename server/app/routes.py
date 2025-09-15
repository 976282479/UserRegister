from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from .database import get_db
from .models import User
from .validators import validate_user_data

api = Blueprint('api', __name__)

@api.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})

@api.route('/users', methods=['POST'])
def create_user():
    db = None
    try:
        data = request.get_json()
        
        # 验证数据
        errors = validate_user_data(data)
        if errors:
            return jsonify({'error': '数据验证失败', 'details': errors}), 400
        
        # 创建用户
        db = next(get_db())
        user = User(
            username=data['username'].strip(),
            age=int(data['age'])
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        return jsonify({
            'message': '用户创建成功',
            'user': user.to_dict()
        }), 201
        
    except IntegrityError:
        if db:
            db.rollback()
        return jsonify({'error': '用户名已存在'}), 409
    except Exception as e:
        if db:
            db.rollback()
        return jsonify({'error': '服务器内部错误'}), 500
    finally:
        if db:
            db.close()

@api.route('/users', methods=['GET'])
def get_users():
    db = None
    try:
        db = next(get_db())
        
        # 获取查询参数
        search = request.args.get('search', '').strip()
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 10)), 100)
        
        # 构建查询
        query = db.query(User)
        if search:
            query = query.filter(User.username.contains(search))
        
        # 分页
        total = query.count()
        users = query.offset((page - 1) * per_page).limit(per_page).all()
        
        return jsonify({
            'users': [user.to_dict() for user in users],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'pages': (total + per_page - 1) // per_page
            }
        })
        
    except Exception as e:
        return jsonify({'error': '服务器内部错误'}), 500
    finally:
        if db:
            db.close()

@api.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    db = None
    try:
        db = next(get_db())
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            return jsonify({'error': '用户不存在'}), 404
        
        return jsonify({'user': user.to_dict()})
        
    except Exception as e:
        return jsonify({'error': '服务器内部错误'}), 500
    finally:
        if db:
            db.close()
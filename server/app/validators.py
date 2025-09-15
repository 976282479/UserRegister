import re

def validate_user_data(data):
    errors = []
    
    # 检查必需字段
    if 'username' not in data or not data['username']:
        errors.append('用户名不能为空')
    
    if 'age' not in data or data['age'] is None:
        errors.append('年龄不能为空')
    
    # 验证用户名
    if 'username' in data and data['username']:
        username = data['username'].strip()
        if len(username) < 2 or len(username) > 20:
            errors.append('用户名长度必须在2-20个字符之间')
        
        if not re.match(r'^[a-zA-Z0-9_\u4e00-\u9fa5]+$', username):
            errors.append('用户名只能包含字母、数字、下划线和中文字符')
    
    # 验证年龄
    if 'age' in data and data['age'] is not None:
        try:
            age = int(data['age'])
            if age < 1 or age > 150:
                errors.append('年龄必须在1-150之间')
        except (ValueError, TypeError):
            errors.append('年龄必须是有效的数字')
    
    return errors
# 用户登记系统

一个基于 React + Flask 的最小但完整的用户登记功能系统。

## 功能特性

- 用户注册：提交用户名与年龄
- 数据校验：前后端双重校验
- 用户列表：查看已登记用户
- 搜索功能：按用户名关键字搜索
- 分页显示：支持分页浏览用户列表

## 技术栈

- **前端**: React + Vite + Axios
- **后端**: Flask + SQLAlchemy
- **数据库**: SQLite

## 项目结构

```
UserRegister/
├── client/                 # 前端项目
│   ├── src/
│   │   ├── App.jsx        # 主应用组件
│   │   ├── App.css        # 样式文件
│   │   └── main.jsx       # 入口文件
│   ├── package.json       # 前端依赖
│   └── vite.config.js     # Vite 配置
├── server/                # 后端项目
│   ├── app/
│   │   ├── __init__.py    # Flask 应用初始化
│   │   ├── models.py      # 数据模型
│   │   ├── routes.py      # API 路由
│   │   ├── validators.py  # 数据验证
│   │   └── database.py    # 数据库配置
│   ├── requirements.txt   # 后端依赖
│   └── run.py            # 启动文件
└── README.md             # 项目说明
```

## 环境要求

### 操作系统
- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 18.04+, CentOS 7+, 或其他主流发行版)

### 软件依赖
- **Node.js 16+**
  - 官方下载地址：https://nodejs.org/
  - 建议安装 LTS 版本
- **Python 3.9-3.11**（建议版本，系统需预先安装）
  - 官方下载地址：https://www.python.org/downloads/
  - 注意：Python 3.12+ 存在兼容性问题，建议使用 3.9-3.11 版本
- **npm 或 yarn**（随 Node.js 自动安装）

## 安装步骤

### 1. 克隆项目

```bash
git clone https://github.com/976282479/UserRegister
cd UserRegister
```

### 2. 后端环境配置

```bash
# 进入后端目录
cd server

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 安装依赖### 4. 环境变量配置（可选）

#### 后端环境变量
```bash
cd server
cp .env.example .env
# 根据需要修改 .env 文件中的配置
```

#### 前端环境变量
```bash
cd client  
cp .env.example .env
# 根据需要修改 .env 文件中的配置
```

**注意**: 环境变量文件为可选配置，项目使用默认配置即可正常运行。

```bash
pip install -r requirements.txt
```

### 3. 前端环境配置

```bash
# 进入前端目录
cd client

# 安装依赖
npm install
```

## 数据库初始化

数据库会在首次运行后端时自动创建，无需手动初始化。

数据表结构：
- **users** 表
  - `id`: 整型，自增主键
  - `username`: 字符串，唯一，长度2-20
  - `age`: 整型，范围1-150
  - `created_at`: 时间戳，UTC时间

## 启动应用

### 启动后端服务

```bash
cd server
# 确保虚拟环境已激活
python run.py
```

后端服务将在 `http://localhost:5000` 启动

### 启动前端服务

```bash
cd client
npm run dev
```

前端服务将在 `http://localhost:5173` 启动

## API 接口

### 1. 创建用户
- **POST** `/api/users`
- **请求体**:
  ```json
  {
    "username": "string",
    "age": "number"
  }
  ```
- **响应**: 201 创建成功，409 用户名冲突，400 参数错误

### 2. 获取用户列表
- **GET** `/api/users?search=keyword&page=1&per_page=10`
- **响应**: 用户列表和分页信息

### 3. 获取单个用户
- **GET** `/api/users/{user_id}`
- **响应**: 用户详细信息，404 用户不存在

## 本地测试方法

### 使用 curl 测试 API

```bash
# 创建用户
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","age":25}'

# 获取用户列表
curl http://localhost:5000/api/users

# 搜索用户
curl "http://localhost:5000/api/users?search=test"

# 获取单个用户
curl http://localhost:5000/api/users/1
```

### 使用 Postman 测试

1. 导入以下请求到 Postman：
   - POST `http://localhost:5000/api/users`
   - GET `http://localhost:5000/api/users`
   - GET `http://localhost:5000/api/users/1`

2. 设置请求头 `Content-Type: application/json`

3. 在 POST 请求中添加 JSON 请求体

## 错误处理

系统采用统一的错误返回格式：

```json
{
  "error": "错误类型",
  "message": "错误描述",
  "details": {}
}
```

HTTP 状态码说明：
- `200`: 请求成功
- `201`: 创建成功
- `400`: 参数错误
- `404`: 资源不存在
- `409`: 数据冲突（如用户名重复）
- `500`: 服务器内部错误

## 开发说明

- 前端使用 React Hooks 进行状态管理
- 后端使用 Flask Blueprint 组织路由
- 数据库使用 SQLAlchemy ORM
- 前后端通过 CORS 进行跨域通信
- 支持实时表单验证和错误提示

## 注意事项

1. 确保前后端服务都已启动
2. 数据库文件 `users.db` 会自动创建在 `server` 目录下
3. 前端默认连接后端地址为 `http://localhost:5000`
4. 如需修改端口，请同时更新前端配置文件中的 API_BASE_URL
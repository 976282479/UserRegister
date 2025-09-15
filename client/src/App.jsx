import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE_URL = 'http://localhost:5000/api'

function App() {
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({ username: '', age: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 获取用户列表
  const fetchUsers = async (search = '') => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/users`, {
        params: { search }
      })
      setUsers(response.data.users)
    } catch (err) {
      setError('获取用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 创建用户
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      setLoading(true)
      await axios.post(`${API_BASE_URL}/users`, formData)
      setSuccess('用户创建成功！')
      setFormData({ username: '', age: '' })
      fetchUsers(searchTerm)
    } catch (err) {
      if (err.response?.data?.details) {
        setError(err.response.data.details.join(', '))
      } else {
        setError(err.response?.data?.error || '创建用户失败')
      }
    } finally {
      setLoading(false)
    }
  }

  // 搜索用户
  const handleSearch = (e) => {
    e.preventDefault()
    fetchUsers(searchTerm)
  }

  // 页面加载时获取用户列表
  useEffect(() => {
    fetchUsers()
  }, [])

  // 自动清除成功消息
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('')
      }, 3000) // 3秒后自动清除
      
      return () => clearTimeout(timer) // 清理定时器
    }
  }, [success])

  // 自动清除错误消息
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 5000) // 5秒后自动清除（错误消息显示时间稍长）
      
      return () => clearTimeout(timer) // 清理定时器
    }
  }, [error])

  return (
    <div className="App">
      <header className="App-header">
        <h1>用户登记系统</h1>
        
        {/* 用户登记表单 */}
        <div className="form-section">
          <h2>用户登记</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>用户名:</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="请输入用户名"
                required
              />
            </div>
            <div className="form-group">
              <label>年龄:</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                placeholder="请输入年龄"
                min="1"
                max="150"
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? '提交中...' : '提交'}
            </button>
          </form>
          
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </div>

        {/* 用户搜索 */}
        <div className="search-section">
          <h2>用户列表</h2>
          <form onSubmit={handleSearch}>
            <div className="form-group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索用户名"
              />
              <button type="submit">搜索</button>
            </div>
          </form>
        </div>

        {/* 用户列表 */}
        <div className="users-section">
          {loading && <div>加载中...</div>}
          {users.length === 0 && !loading && <div>暂无用户数据</div>}
          {users.length > 0 && (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>用户名</th>
                  <th>年龄</th>
                  <th>创建时间</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.age}</td>
                    <td>{new Date(user.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </header>
    </div>
  )
}

export default App
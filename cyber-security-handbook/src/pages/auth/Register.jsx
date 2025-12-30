import { useState } from 'react'
import { Container, Paper, TextField, Button, Typography, Box, Link, Stack, Alert, CircularProgress } from '@mui/material'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { register } from '../../services/authService'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!')
      setLoading(false)
      return
    }

    try {
      const { confirmPassword, ...registerData } = formData
      const result = await register(registerData)
      
      if (result.success) {
        setSuccess('Đăng ký thành công! Đang chuyển hướng...')
        
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 8 }}>
      <Container maxWidth="sm">
        <Paper 
          elevation={24}
          sx={{ 
            p: 5, 
            bgcolor: '#1e293b',
            borderTop: '4px solid #10b981',
            borderRadius: 2
          }}
        >
          <Box 
            sx={{ 
              bgcolor: 'rgba(16, 185, 129, 0.1)', 
              p: 2, 
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}
          >
            <PersonAddOutlinedIcon sx={{ color: '#10b981', fontSize: 32 }} />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', mb: 5, color: '#e2e8f0' }}>
            Tạo Tài Khoản
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Tên người dùng"
                name="username"
                type="text"
                variant="outlined"
                required
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e2e8f0',
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#10b981' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' }
                  },
                  '& .MuiInputLabel-root': { color: '#94a3b8' }
                }}
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e2e8f0',
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#10b981' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' }
                  },
                  '& .MuiInputLabel-root': { color: '#94a3b8' }
                }}
              />

              <TextField
                fullWidth
                label="Mật khẩu"
                name="password"
                type="password"
                variant="outlined"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e2e8f0',
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#10b981' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' }
                  },
                  '& .MuiInputLabel-root': { color: '#94a3b8' }
                }}
              />

              <TextField
                fullWidth
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type="password"
                variant="outlined"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e2e8f0',
                    '& fieldset': { borderColor: '#475569' },
                    '&:hover fieldset': { borderColor: '#10b981' },
                    '&.Mui-focused fieldset': { borderColor: '#10b981' }
                  },
                  '& .MuiInputLabel-root': { color: '#94a3b8' }
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  bgcolor: '#10b981',
                  fontWeight: 700,
                  fontSize: '1rem',
                  mt: 2,
                  '&:hover': { bgcolor: '#059669' },
                  '&:disabled': { bgcolor: '#475569' }
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'ĐĂNG KÝ NGAY'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography sx={{ color: '#94a3b8' }}>
              Đã có tài khoản?{' '}
              <RouterLink
                to="/login"
                style={{
                  color: '#10b981',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Đăng nhập ngay
              </RouterLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
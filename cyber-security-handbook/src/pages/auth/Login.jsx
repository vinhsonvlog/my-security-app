import { useState } from 'react'
import { Container, Paper, TextField, Button, Typography, Box, Link, Stack, Alert, CircularProgress } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { login } from '../../services/authService'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      const result = await login(formData)
      
      if (result.success) {
        setSuccess('Đăng nhập thành công!')
        
        setTimeout(() => {
          if (result.data.role === 'admin') {
            navigate('/dashboard')
          } else {
            navigate('/')
          }
        }, 1000)
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 10 }}>
      <Container maxWidth="xs">
        <Paper 
          elevation={24}
          sx={{ 
            p: 5, 
            bgcolor: '#1e293b',
            borderTop: '4px solid #06b6d4',
            borderRadius: 2
          }}
        >
          <Box 
            sx={{ 
              bgcolor: 'rgba(6, 182, 212, 0.1)', 
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
            <LockOutlinedIcon sx={{ color: '#06b6d4', fontSize: 32 }} />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', mb: 4, color: '#e2e8f0' }}>
            Đăng Nhập
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
                    '&:hover fieldset': { borderColor: '#06b6d4' },
                    '&.Mui-focused fieldset': { borderColor: '#06b6d4' }
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
                    '&:hover fieldset': { borderColor: '#06b6d4' },
                    '&.Mui-focused fieldset': { borderColor: '#06b6d4' }
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
                  bgcolor: '#06b6d4',
                  fontWeight: 700,
                  fontSize: '1rem',
                  '&:hover': { bgcolor: '#0891b2' },
                  '&:disabled': { bgcolor: '#475569' }
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'ĐĂNG NHẬP'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link component={RouterLink} to="/forgot-password" sx={{ color: '#06b6d4', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Quên mật khẩu?
            </Link>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>Chưa có TK?</Typography>
              <Link component={RouterLink} to="/register" sx={{ color: '#06b6d4', fontWeight: 700, textDecoration: 'none' }}>
                Đăng ký
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login
import { useState } from 'react'
import { Container, Typography, TextField, Button, Paper, Alert, Box, CircularProgress, Link } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link as RouterLink } from 'react-router-dom'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setMessage(null)

    setTimeout(() => {
      setMessage({
        type: 'success',
        text: 'Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư của bạn.'
      })
      setLoading(false)
    }, 2000)
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={24}
          sx={{ 
            p: 6,
            bgcolor: '#1e293b',
            borderRadius: 4,
            border: '1px solid #334155',
            boxShadow: '0 8px 32px rgba(6, 182, 212, 0.2)',
            animation: 'bounce-in 0.6s ease-out'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 900,
                mb: 2,
                background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              🔐 Quên Mật Khẩu
            </Typography>
            
            <Typography variant="body1" sx={{ color: '#94a3b8' }}>
              Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: <EmailIcon sx={{ color: '#64748b', mr: 1 }} />
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#0f172a',
                  borderRadius: 2,
                  '& fieldset': { borderColor: '#475569' },
                  '&:hover fieldset': { borderColor: '#06b6d4' },
                  '&.Mui-focused fieldset': { borderColor: '#06b6d4' }
                },
                '& .MuiInputLabel-root': { color: '#94a3b8' },
                '& .MuiInputBase-input': { color: '#e2e8f0' }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 2,
                borderRadius: 2,
                bgcolor: '#06b6d4',
                fontWeight: 800,
                fontSize: '1rem',
                '&:hover': { 
                  bgcolor: '#0891b2', 
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)'
                },
                '&:disabled': { bgcolor: '#475569' },
                transition: 'all 0.2s'
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Gửi Email Khôi Phục'}
            </Button>
          </Box>

          {message && (
            <Alert
              severity={message.type}
              variant="filled"
              sx={{
                mt: 3,
                textAlign: 'left',
                fontSize: '1rem',
                py: 2,
                borderRadius: 2,
                boxShadow: message.type === 'success' 
                  ? '0 4px 20px rgba(16, 185, 129, 0.4)'
                  : '0 4px 20px rgba(239, 68, 68, 0.4)'
              }}
            >
              {message.text}
            </Alert>
          )}

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Link 
              component={RouterLink} 
              to="/login" 
              sx={{ 
                color: '#06b6d4', 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                fontWeight: 600,
                '&:hover': { color: '#0891b2' }
              }}
            >
              <ArrowBackIcon sx={{ mr: 1, fontSize: 18 }} />
              Quay lại Đăng nhập
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default ForgotPassword
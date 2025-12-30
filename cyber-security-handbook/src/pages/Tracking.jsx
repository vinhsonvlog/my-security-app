import { Container, TextField, Button, Paper, Stepper, Step, StepLabel, Typography, Box, Alert, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { getReportStatus } from '../services/reportService'

const Tracking = () => {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleTrack = async () => {
    if (!code) return
    
    setLoading(true)
    setError(null)
    setStatus(null)

    try {
      const result = await getReportStatus(code)
      if (result.success) {
        setStatus(result.data)
      } else {
        setError('Không tìm thấy báo cáo với mã này')
      }
    } catch (err) {
      setError(err.message || 'Không thể lấy thông tin báo cáo')
    } finally {
      setLoading(false)
    }
  }

  const getStepIndex = (statusValue) => {
    const statusMap = {
      'pending': 0,
      'processing': 1,
      'approved': 3,
      'rejected': 3
    }
    return statusMap[statusValue] || 0
  }

  const steps = ['Đã tiếp nhận', 'Đang xác minh', 'Đang xử lý', 'Hoàn tất']

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 12 }}>
      <Container maxWidth="md">
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, textAlign: 'center', color: '#e2e8f0' }}>
          🔍 Theo dõi xử lý sự cố
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 8, justifyContent: 'center' }}>
          <TextField
            placeholder="Nhập mã báo cáo"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
            disabled={loading}
            sx={{
              bgcolor: '#1e293b',
              width: '100%',
              maxWidth: 400,
              '& .MuiOutlinedInput-root': {
                color: '#e2e8f0',
                '& fieldset': { borderColor: '#475569' },
                '&:hover fieldset': { borderColor: '#06b6d4' }
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleTrack}
            disabled={loading || !code}
            sx={{
              bgcolor: '#06b6d4',
              px: 4,
              fontWeight: 700,
              '&:hover': { bgcolor: '#0891b2' },
              '&:disabled': { bgcolor: '#475569' }
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'KIỂM TRA'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {status && (
          <Paper 
            elevation={24}
            sx={{ 
              p: 6,
              bgcolor: '#1e293b',
              animation: 'fadeIn 0.5s'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, textAlign: 'center', color: '#e2e8f0' }}>
              Mã báo cáo: <span style={{ color: '#06b6d4' }}>{code}</span>
            </Typography>
            
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                Trạng thái hiện tại
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700, 
                  color: status.status === 'approved' ? '#10b981' : 
                         status.status === 'rejected' ? '#ef4444' :
                         status.status === 'processing' ? '#f59e0b' : '#06b6d4'
                }}
              >
                {status.status === 'pending' ? 'Đang chờ xử lý' :
                 status.status === 'processing' ? 'Đang xác minh' :
                 status.status === 'approved' ? 'Đã phê duyệt' :
                 status.status === 'rejected' ? 'Đã từ chối' : status.status}
              </Typography>
            </Box>

            <Stepper 
              activeStep={getStepIndex(status.status)} 
              alternativeLabel
              sx={{
                mb: 4,
                '& .MuiStepLabel-label': { color: '#94a3b8', fontWeight: 600 },
                '& .MuiStepLabel-label.Mui-active': { color: '#06b6d4' },
                '& .MuiStepLabel-label.Mui-completed': { color: '#10b981' },
                '& .MuiStepIcon-root': { color: '#475569' },
                '& .MuiStepIcon-root.Mui-active': { color: '#06b6d4' },
                '& .MuiStepIcon-root.Mui-completed': { color: '#10b981' }
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mt: 4, p: 3, bgcolor: '#0f172a', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                Ngày gửi báo cáo
              </Typography>
              <Typography variant="body1" sx={{ color: '#e2e8f0', mb: 2 }}>
                {new Date(status.submittedAt).toLocaleString('vi-VN')}
              </Typography>

              {status.reviewedAt && (
                <>
                  <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                    Ngày xét duyệt
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#e2e8f0', mb: 2 }}>
                    {new Date(status.reviewedAt).toLocaleString('vi-VN')}
                  </Typography>
                </>
              )}

              {status.adminNotes && (
                <>
                  <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                    Ghi chú từ quản trị viên
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#e2e8f0' }}>
                    {status.adminNotes}
                  </Typography>
                </>
              )}
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  )
}

export default Tracking
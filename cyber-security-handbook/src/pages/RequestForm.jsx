import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Container, Paper, TextField, Typography, Button, Stack, Box, Alert, 
  CircularProgress, FormControl, InputLabel, Select, MenuItem, 
  FormControlLabel, Checkbox, Grid, Card, CardContent, Divider
} from '@mui/material'
import ReportIcon from '@mui/icons-material/Report'
import SendIcon from '@mui/icons-material/Send'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ShieldIcon from '@mui/icons-material/Shield'
import { submitReport, createReport } from '../services/reportService'
import { isAuthenticated } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import FloatingParticles from '../components/FloatingParticles'
import PageTransition from '../components/PageTransition'

const RequestForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    url: '',
    reason: '',
    scamType: 'phishing',
    reporterName: '',
    reporterEmail: '',
    reporterPhone: '',
    isAnonymous: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [reportId, setReportId] = useState(null)

  const scamTypes = [
    { value: 'phishing', label: 'Lừa đảo thông tin (Phishing)' },
    { value: 'fake-shop', label: 'Website bán hàng giả' },
    { value: 'investment-scam', label: 'Lừa đảo đầu tư' },
    { value: 'tech-support', label: 'Giả mạo hỗ trợ kỹ thuật' },
    { value: 'lottery-scam', label: 'Lừa đảo trúng thưởng' },
    { value: 'romance-scam', label: 'Lừa đảo tình cảm' },
    { value: 'malware', label: 'Phần mềm độc hại' },
    { value: 'crypto-scam', label: 'Lừa đảo tiền ảo' },
    { value: 'job-scam', label: 'Lừa đảo việc làm' },
    { value: 'other', label: 'Khác' }
  ]

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }, [])//setFormData, setError

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setLoading(true)
    setError('')
    setSuccess('')
    setReportId(null)

    try {
      let result
      
      // Use createReport (public API) for anonymous or non-authenticated users
      if (formData.isAnonymous || !isAuthenticated()) {
        const reportData = {
          url: formData.url,
          reason: formData.reason,
          scamType: formData.scamType,
          reporterInfo: {
            isAnonymous: formData.isAnonymous
          }
        }
        
        // Only include contact info if not anonymous
        if (!formData.isAnonymous) {
          if (formData.reporterName) reportData.reporterInfo.name = formData.reporterName
          if (formData.reporterEmail) reportData.reporterInfo.email = formData.reporterEmail
          if (formData.reporterPhone) reportData.reporterInfo.phone = formData.reporterPhone
        }
        
        result = await createReport(reportData)
      } else {
        // Use submitReport (authenticated API) for logged-in users
        result = await submitReport({
          url: formData.url,
          reason: formData.reason
        })
      }
      
      if (result.success) {
        const reportIdValue = result.data?.reportId || result.data?.report?._id
        setReportId(reportIdValue)
        setSuccess(result.message || 'Báo cáo đã được gửi thành công! Chúng tôi sẽ xem xét trong thời gian sớm nhất.')
        
        if (result.data.virusTotalCheck) {
          const vtCheck = result.data.virusTotalCheck
          if (!vtCheck.safe && vtCheck.message) {
            setSuccess(prev => prev + `\n\nKết quả quét: ${vtCheck.message}`)
          }
        }

        // Reset form
        setFormData({ 
          url: '', 
          reason: '', 
          scamType: 'phishing',
          reporterName: '',
          reporterEmail: '',
          reporterPhone: '',
          isAnonymous: false
        })
      }
    } catch (err) {
      setError(err.message || 'Gửi báo cáo thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <PageTransition>
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 8, position: 'relative', overflow: 'hidden' }}>
        <FloatingParticles count={25} />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <ReportIcon sx={{ fontSize: 56, color: '#f59e0b' }} />
              </motion.div>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#fff', textAlign: 'center' }}>
                Báo Cáo <span style={{ color: '#f59e0b' }}>Lừa Đảo</span>
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ color: '#94a3b8', mb: 4, lineHeight: 1.8, textAlign: 'center' }}>
              Giúp cộng đồng an toàn hơn bằng cách báo cáo các website, link lừa đảo bạn phát hiện được.
            </Typography>
          </motion.div>

          {/* Feature Cards - Fixed width matching form */}
          <Box sx={{ maxWidth: '100%', mx: 'auto', mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  bgcolor: 'rgba(16, 185, 129, 0.1)', 
                  border: '1px solid rgba(16, 185, 129, 0.3)', 
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)' }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <CheckCircleIcon sx={{ color: '#10b981', fontSize: 40, mb: 1.5 }} />
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                      Xác minh nhanh
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      Xử lý trong 24 giờ
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  bgcolor: 'rgba(59, 130, 246, 0.1)', 
                  border: '1px solid rgba(59, 130, 246, 0.3)', 
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)' }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <ShieldIcon sx={{ color: '#3b82f6', fontSize: 40, mb: 1.5 }} />
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                      Bảo vệ cộng đồng
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      Giúp hàng nghìn người
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Card sx={{ 
                  bgcolor: 'rgba(245, 158, 11, 0.1)', 
                  border: '1px solid rgba(245, 158, 11, 0.3)', 
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)' }
                }}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <WarningAmberIcon sx={{ color: '#f59e0b', fontSize: 40, mb: 1.5 }} />
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                      Hoàn toàn ẩn danh
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      Không cần thông tin
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper 
              elevation={24}
              sx={{ 
                p: { xs: 3, md: 5 }, 
                bgcolor: 'rgba(30, 41, 59, 0.8)', 
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(148, 163, 184, 0.1)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#e2e8f0' }}>
                Gửi báo cáo của bạn
              </Typography>
              <Divider sx={{ mb: 4, bgcolor: 'rgba(148, 163, 184, 0.2)' }} />

                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                      {error}
                    </Alert>
                  )}

                  {success && (
                    <Alert 
                      severity="success" 
                      icon={<CheckCircleIcon />}
                      sx={{ mb: 3, whiteSpace: 'pre-line' }}
                      onClose={() => setSuccess('')}
                    >
                      {success}
                      {reportId && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            Mã báo cáo: <code style={{ color: '#10b981', fontWeight: 800 }}>{reportId}</code>
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                            Theo dõi trạng thái báo cáo tại{' '}
                            <Button 
                              size="small" 
                              onClick={() => navigate('/tracking')}
                              sx={{ 
                                p: 0, 
                                minWidth: 'auto', 
                                textTransform: 'none',
                                color: '#3b82f6',
                                fontWeight: 700,
                                '&:hover': { textDecoration: 'underline' }
                              }}
                            >
                              trang Tra cứu
                            </Button>
                          </Typography>
                        </Box>
                      )}
                    </Alert>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="URL hoặc Link nghi ngờ *"
                        name="url"
                        type="url"
                        variant="outlined"
                        required
                        value={formData.url}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="https://example-scam.com"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#e2e8f0',
                            '& fieldset': { borderColor: '#475569' },
                            '&:hover fieldset': { borderColor: '#f59e0b' },
                            '&.Mui-focused fieldset': { borderColor: '#f59e0b' }
                          },
                          '& .MuiInputLabel-root': { color: '#94a3b8' }
                        }}
                      />

                      <FormControl fullWidth>
                        <InputLabel sx={{ color: '#94a3b8' }}>Loại lừa đảo *</InputLabel>
                        <Select
                          name="scamType"
                          value={formData.scamType}
                          onChange={handleChange}
                          disabled={loading}
                          label="Loại lừa đảo *"
                          sx={{
                            color: '#e2e8f0',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#f59e0b' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f59e0b' },
                            '& .MuiSvgIcon-root': { color: '#94a3b8' }
                          }}
                        >
                          {scamTypes.map(type => (
                            <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Lý do báo cáo *"
                        name="reason"
                        variant="outlined"
                        required
                        placeholder="VD: Link này giả mạo ngân hàng, yêu cầu nhập mật khẩu và OTP..."
                        value={formData.reason}
                        onChange={handleChange}
                        disabled={loading}
                        inputProps={{ minLength: 10, maxLength: 2000 }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#e2e8f0',
                            '& fieldset': { borderColor: '#475569' },
                            '&:hover fieldset': { borderColor: '#f59e0b' },
                            '&.Mui-focused fieldset': { borderColor: '#f59e0b' }
                          },
                          '& .MuiInputLabel-root': { color: '#94a3b8' }
                        }}
                      />

                      <FormControlLabel
                        control={
                          <Checkbox
                            name="isAnonymous"
                            checked={formData.isAnonymous}
                            onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                            sx={{ 
                              color: '#94a3b8',
                              '&.Mui-checked': { color: '#f59e0b' }
                            }}
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                            Báo cáo ẩn danh (không lưu thông tin cá nhân)
                          </Typography>
                        }
                      />

                      {!formData.isAnonymous && (
                        <Box sx={{ p: 3, bgcolor: 'rgba(15, 23, 42, 0.6)', borderRadius: 2, border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                          <Typography variant="subtitle2" sx={{ color: '#10b981', mb: 2, fontWeight: 700 }}>
                            📧 Thông tin liên hệ (không bắt buộc)
                          </Typography>
                          <Stack spacing={2}>
                            <TextField
                              fullWidth
                              label="Tên của bạn"
                              name="reporterName"
                              variant="outlined"
                              value={formData.reporterName}
                              onChange={handleChange}
                              disabled={loading}
                              inputProps={{ maxLength: 100 }}
                              size="small"
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
                              name="reporterEmail"
                              type="email"
                              variant="outlined"
                              value={formData.reporterEmail}
                              onChange={handleChange}
                              disabled={loading}
                              size="small"
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
                              label="Số điện thoại"
                              name="reporterPhone"
                              variant="outlined"
                              value={formData.reporterPhone}
                              onChange={handleChange}
                              disabled={loading}
                              size="small"
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
                          </Stack>
                        </Box>
                      )}
                    
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          size="large"
                          disabled={loading}
                          startIcon={loading ? null : <SendIcon />}
                          sx={{
                            py: 1.8,
                            bgcolor: '#f59e0b',
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            borderRadius: 2,
                            '&:hover': { 
                              bgcolor: '#d97706',
                              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)'
                            },
                            '&:disabled': {
                              bgcolor: '#475569'
                            }
                          }}
                        >
                          {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'GỬI BÁO CÁO NGAY'}
                        </Button>
                      </motion.div>

                      <Box sx={{ p: 2, bgcolor: 'rgba(59, 130, 246, 0.1)', borderRadius: 1, border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', lineHeight: 1.6 }}>
                          💡 <strong>Lưu ý:</strong> Báo cáo sẽ được xem xét trong 24h. Nếu cung cấp thông tin liên hệ, bạn sẽ nhận được thông báo kết quả qua email.
                        </Typography>
                      </Box>
                    </Stack>
                  </form>
                </Paper>
              </motion.div>
        </Container>
      </Box>
    </PageTransition>
  )
}

export default RequestForm
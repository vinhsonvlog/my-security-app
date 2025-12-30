import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Container, Typography, Button, Paper, Box, 
  CircularProgress, Grid, Card, CardContent, Chip, Alert,
  Fade, Grow, Divider, List, ListItem, ListItemIcon, ListItemText,
  InputBase, IconButton, Link, Stack
} from '@mui/material'

// Icons
import SearchIcon from '@mui/icons-material/Search'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import ShieldIcon from '@mui/icons-material/Shield'
import WarningIcon from '@mui/icons-material/Warning'
import VisibilityIcon from '@mui/icons-material/Visibility'
import LanguageIcon from '@mui/icons-material/Language'
import MenuIcon from '@mui/icons-material/Menu'
import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import TwitterIcon from '@mui/icons-material/Twitter'
import ExtensionIcon from '@mui/icons-material/Extension'
import QuizIcon from '@mui/icons-material/Quiz'
import EmailIcon from '@mui/icons-material/Email'
import GppGoodIcon from '@mui/icons-material/GppGood'
import BugReportIcon from '@mui/icons-material/BugReport'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

// Services
import { checkUrlSafety } from '../services/virusTotalApi'
import { searchUrl } from '../services/searchService'

const UrlChecker = () => {
  // --- STATE ---
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [blacklistResult, setBlacklistResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [urlError, setUrlError] = useState('')
  const resultsRef = useRef(null)

  // --- LOGIC ---
  const validateUrl = (urlString) => {
    if (!urlString.trim()) return 'Vui lòng nhập URL, IP hoặc tên miền!'
    return ''
  }

  useEffect(() => {
    if ((result || blacklistResult) && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [result, blacklistResult])

  const handleCheck = async () => {
    const validationError = validateUrl(url)
    if (validationError) {
      setUrlError(validationError)
      return
    }
    setLoading(true)
    setResult(null)
    setBlacklistResult(null)
    setError('')
    setUrlError('')

    try {
      const [virusTotalData, blacklistData] = await Promise.all([
        checkUrlSafety(url),
        searchUrl(url).catch(() => null)
      ])
      setResult(virusTotalData)
      setBlacklistResult(blacklistData)
    } catch (err) {
      console.error('URL check error:', err)
      setError('Không thể kiểm tra URL. Vui lòng thử lại sau!')
    } finally {
      setLoading(false)
    }
  }

  const handleUrlChange = useCallback((e) => {
    setUrl(e.target.value)
    if (urlError) setUrlError('')
    if (error) setError('')
  }, [urlError, error])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') handleCheck()
  }, [url])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('vi-VN')
    } catch {
      return 'N/A'
    }
  }

  // --- DATA ---
  const actionButtons = [
    { label: 'Trắc nghiệm AI', icon: <QuizIcon />, color: '#10b981', path: '/quiz' },
    { label: 'Báo cáo lừa đảo', icon: <BugReportIcon />, color: '#3b82f6', path: '/report' },
    { label: 'Tra cứu báo cáo', icon: <SearchIcon />, color: '#f59e0b', path: '/tracking' },
    { label: 'Tin tức Newsfeed', icon: <TrendingUpIcon />, color: '#ef4444', path: '/newsfeed' },
  ]

  const stats = [
    { number: '1.2M+', label: 'URL đã kiểm tra', color: '#06b6d4' },
    { number: '580K+', label: 'Người dùng tin tưởng', color: '#10b981' },
    { number: '45K+', label: 'Trang lừa đảo phát hiện', color: '#ef4444' },
    { number: '99.8%', label: 'Độ chính xác', color: '#8b5cf6' }
  ]

  const tips = [
    { text: 'Kiểm tra kỹ tên miền (domain) có chính xác không', safe: true },
    { text: 'Xem có chứng chỉ SSL (https://) hay không', safe: true },
    { text: 'Không click vào link lạ qua email/SMS', safe: false },
    { text: 'Không chuyển tiền trước khi xác minh', safe: false }
  ]

  // --- RENDER ---
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#0f172a',
      color: '#fff',
      fontFamily: '"Inter", "Roboto", sans-serif',
      overflowX: 'hidden'
    }}>

      <Box sx={{ 
        position: 'relative', 
        pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 10 },
        background: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)'
      }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Fade in timeout={800}>
            <Box>
              <Typography variant="h2" sx={{ 
                fontWeight: 900, mb: 1, 
                fontSize: { xs: '2rem', md: '3.5rem' },
                letterSpacing: '-1px'
              }}>
                BẠN CÓ ĐANG LƯỚT
              </Typography>
              <Typography variant="h2" sx={{ 
                fontWeight: 900, mb: 6, 
                fontSize: { xs: '2rem', md: '3.5rem' },
                background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-1px'
              }}>
                MẠNG AN TOÀN?
              </Typography>
            </Box>
          </Fade>

          {/* Search Bar */}
          <Grow in timeout={1000}>
            <Box sx={{ maxWidth: '700px', mx: 'auto', position: 'relative', mb: 3 }}>
              <Paper component="form" sx={{ 
                p: '4px', display: 'flex', alignItems: 'center', 
                borderRadius: 3, border: '4px solid rgba(255,255,255,0.1)',
                bgcolor: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                transition: 'all 0.3s',
                '&:focus-within': { borderColor: '#10b981', transform: 'scale(1.02)' }
              }}>
                <InputBase
                  sx={{ ml: 2, flex: 1, fontSize: '1.1rem', color: '#334155', py: 1.5, fontWeight: 500 }}
                  placeholder="Nhập đường dẫn hoặc IP hoặc tên miền để kiểm tra..."
                  value={url}
                  onChange={handleUrlChange}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                <Button 
                  variant="contained" 
                  onClick={handleCheck}
                  disabled={loading}
                  sx={{ 
                    bgcolor: '#10b981', borderRadius: 2.5, minWidth: '60px', height: '54px',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#059669' }
                  }}
                >
                  {loading ? <SearchIcon size={24} color="inherit" /> : <SearchIcon fontSize="large" />}
                </Button>
              </Paper>
              {(urlError || error) && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  {urlError || error}
                </Alert>
              )}
            </Box>
          </Grow>

          {/* Social Links */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 6, color: '#94a3b8' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ cursor: 'pointer', '&:hover': { color: '#1877f2' } }}>
               <FacebookIcon /> <Typography variant="body2">Facebook</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ cursor: 'pointer', '&:hover': { color: '#1da1f2' } }}>
               <TwitterIcon /> <Typography variant="body2">Twitter</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ cursor: 'pointer', '&:hover': { color: '#ff0000' } }}>
               <YouTubeIcon /> <Typography variant="body2">YouTube</Typography>
            </Stack>
          </Box>

          {/* Feature Buttons */}
          <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: '1000px', mx: 'auto' }}>
            {actionButtons.map((btn, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Button 
                  fullWidth
                  variant="contained"
                  startIcon={btn.icon}
                  onClick={() => navigate(btn.path)}
                  sx={{ 
                    bgcolor: 'rgba(30, 41, 59, 0.6)', 
                    color: '#fff',
                    py: 1.8, px: 2,
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      bgcolor: btn.color,
                      borderColor: btn.color,
                      transform: 'translateY(-4px)',
                      boxShadow: `0 10px 25px -5px ${btn.color}80`
                    }
                  }}
                >
                  {btn.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 3. RESULT SECTION */}
      <Container maxWidth="md" sx={{ mb: resultsRef.current ? 8 : 0 }}>
        <Box ref={resultsRef}>
          {(result || blacklistResult) && (
            <Grow in>
              <Paper sx={{ 
                p: { xs: 3, md: 5 }, borderRadius: 4, 
                bgcolor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)', mb: 6,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                   {blacklistResult?.isSafe && result?.safe ? (
                     <CheckCircleIcon sx={{ fontSize: 80, color: '#10b981', mb: 2, filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.5))' }} />
                   ) : (
                     <WarningIcon sx={{ fontSize: 80, color: '#ef4444', mb: 2, filter: 'drop-shadow(0 0 10px rgba(239,68,68,0.5))' }} />
                   )}
                   <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
                      {blacklistResult?.isSafe && result?.safe ? 'AN TOÀN TUYỆT ĐỐI' : 'PHÁT HIỆN NGUY HIỂM!'}
                   </Typography>
                   <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                      {blacklistResult?.message || result?.message}
                   </Typography>
                </Box>
                
                <Grid container spacing={3}>
                   <Grid item xs={12} md={6}>
                      <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(15, 23, 42, 0.6)', height: '100%', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography variant="overline" sx={{ color: '#06b6d4', fontWeight: 700, letterSpacing: 1 }}>CƠ SỞ DỮ LIỆU</Typography>
                        <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                        <Typography variant="h6" color={blacklistResult?.isSafe ? '#10b981' : '#ef4444'} sx={{ fontWeight: 700 }}>
                           {blacklistResult?.isSafe ? 'Sạch (Clean)' : 'Nằm trong danh sách đen!'}
                        </Typography>
                        {!blacklistResult?.isSafe && (
                           <Box sx={{ mt: 2 }}>
                             <Chip label={`Loại: ${blacklistResult?.data?.scamType || 'N/A'}`} color="error" variant="outlined" sx={{ mr: 1 }} />
                             <Typography variant="caption" display="block" sx={{ mt: 1, color: '#94a3b8' }}>
                               Ngày: {formatDate(blacklistResult?.data?.addedDate)}
                             </Typography>
                           </Box>
                        )}
                      </Box>
                   </Grid>
                   <Grid item xs={12} md={6}>
                      <Box sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(15, 23, 42, 0.6)', height: '100%', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography variant="overline" sx={{ color: '#06b6d4', fontWeight: 700, letterSpacing: 1 }}>PHÂN TÍCH AI (VIRUSTOTAL)</Typography>
                        <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                           <Grid item xs={6}>
                              <Typography variant="body2" sx={{ color: '#94a3b8' }}>Độc hại</Typography>
                              <Typography variant="h5" color="#ef4444" fontWeight="800">{result?.analysis?.malicious || 0}</Typography>
                           </Grid>
                           <Grid item xs={6}>
                              <Typography variant="body2" sx={{ color: '#94a3b8' }}>Đáng ngờ</Typography>
                              <Typography variant="h5" color="#f59e0b" fontWeight="800">{result?.analysis?.suspicious || 0}</Typography>
                           </Grid>
                        </Grid>
                      </Box>
                   </Grid>
                </Grid>
              </Paper>
            </Grow>
          )}
        </Box>
      </Container>

      {/* 4. STATS SECTION */}
      <Box sx={{ py: 10, bgcolor: 'rgba(15, 23, 42, 0.5)', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: '10%', right: '5%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.05)', filter: 'blur(50px)' }} />
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography variant="overline" sx={{ color: '#10b981', fontWeight: 700, letterSpacing: 2 }}>
                THỐNG KÊ
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, lineHeight: 1.2 }}>
                NHỮNG CON SỐ <br />
                <span style={{ color: '#ef4444' }}>BIẾT NÓI...</span>
              </Typography>
              <Typography sx={{ color: '#94a3b8', mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}>
                Tiện ích Sotayantoan sẽ tự động cảnh báo khi bạn truy cập các trang web nguy hiểm, lừa đảo, phần mềm độc hại, giả mạo, có nội dung xấu độc!
              </Typography>
              <Button 
                variant="contained" size="large" endIcon={<TrendingUpIcon />}
                sx={{ 
                  bgcolor: '#10b981', px: 4, py: 1.5, borderRadius: 2, fontWeight: 700,
                  '&:hover': { bgcolor: '#059669' }
                }}
              >
                Tìm hiểu thêm
              </Button>
            </Grid>
            <Grid item xs={12} md={7}>
              <Grid container spacing={3}>
                {stats.map((stat, index) => (
                   <Grid item xs={6} key={index}>
                     <Card sx={{ 
                       bgcolor: 'rgba(30, 41, 59, 0.4)', 
                       backdropFilter: 'blur(10px)',
                       border: '1px solid rgba(255,255,255,0.05)',
                       borderRadius: 4, p: 2,
                       borderLeft: `4px solid ${stat.color}`,
                       transition: 'all 0.3s',
                       '&:hover': { transform: 'translateY(-5px)', bgcolor: 'rgba(30, 41, 59, 0.8)' }
                     }}>
                       <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', mb: 1 }}>{stat.number}</Typography>
                       <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>{stat.label}</Typography>
                     </Card>
                   </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 5. TIPS SECTION */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
           <Grid item xs={12} md={6}>
             <Paper sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckIcon sx={{ color: '#10b981', fontSize: 32, mr: 1 }} />
                  <Typography variant="h5" fontWeight="800" color="rgba(13, 255, 0, 1)">NÊN LÀM</Typography>
                </Box>
                <List>
                   {tips.filter(t => t.safe).map((tip, idx) => (
                      <ListItem key={idx} alignItems="flex-start" sx={{ px: 0 }}>
                         <ListItemIcon sx={{ minWidth: 36 }}><CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} /></ListItemIcon>
                         <ListItemText primary={tip.text} primaryTypographyProps={{ color: '#e2e8f0', fontWeight: 500 }} />
                      </ListItem>
                   ))}
                </List>
             </Paper>
           </Grid>
           <Grid item xs={12} md={6}>
             <Paper sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CloseIcon sx={{ color: '#ef4444', fontSize: 32, mr: 1 }} />
                  <Typography variant="h5" fontWeight="800" color="#ff0000ff">KHÔNG NÊN</Typography>
                </Box>
                <List>
                   {tips.filter(t => !t.safe).map((tip, idx) => (
                      <ListItem key={idx} alignItems="flex-start" sx={{ px: 0 }}>
                         <ListItemIcon sx={{ minWidth: 36 }}><ErrorIcon sx={{ color: '#ef4444', fontSize: 20 }} /></ListItemIcon>
                         <ListItemText primary={tip.text} primaryTypographyProps={{ color: '#e2e8f0', fontWeight: 500 }} />
                      </ListItem>
                   ))}
                </List>
             </Paper>
           </Grid>
        </Grid>
      </Container>

      {/* 6. FOOTER */}
      <Box sx={{ bgcolor: '#064e3b', pt: 8, pb: 4, mt: 8 }}>
        <Container maxWidth="lg">
          

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                 <ShieldIcon sx={{ fontSize: 32, color: '#fff' }} />
                 <Typography variant="h5" sx={{ fontWeight: 800 }}>Sotayantoan</Typography>
               </Box>
               <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>Lập trình bởi: Nhóm 20</Typography>
               </Grid>
            
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
               <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 1, mb: 2 }}>
                 <IconButton size="small" sx={{ bgcolor: '#1877f2', color: '#fff', '&:hover': {bgcolor: '#1464c4'} }}><FacebookIcon /></IconButton>
                 <IconButton size="small" sx={{ bgcolor: '#ff0000', color: '#fff', '&:hover': {bgcolor: '#cc0000'} }}><YouTubeIcon /></IconButton>
                 <IconButton size="small" sx={{ bgcolor: '#1da1f2', color: '#fff', '&:hover': {bgcolor: '#0c85d0'} }}><TwitterIcon /></IconButton>
               </Box>
               
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default UrlChecker
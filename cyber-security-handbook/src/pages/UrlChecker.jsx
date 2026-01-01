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
                fontWeight: 900,
                mb: 1, 
                fontSize: { xs: '2.5rem', md: '4rem' },
                letterSpacing: '-2px',
                color: '#f1f5f9',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}>
                BẠN CÓ ĐANG LƯỚT
              </Typography>
              <Typography variant="h2" sx={{ 
                fontWeight: 900,
                mb: 6, 
                fontSize: { xs: '2.5rem', md: '4rem' },
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-2px',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '\"\"',
                  position: 'absolute',
                  bottom: -10,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: 'linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6)',
                  borderRadius: '3px',
                  opacity: 0.6
                }
              }}>
                MẠNG AN TOÀN?
              </Typography>
            </Box>
          </Fade>

          {/* Search Bar */}
          <Grow in timeout={1000}>
            <Box sx={{ maxWidth: '800px', mx: 'auto', position: 'relative', mb: 4 }}>
              <Paper elevation={0} component="form" sx={{ 
                p: '6px',
                display: 'flex',
                alignItems: 'center', 
                borderRadius: 4,
                border: '3px solid transparent',
                background: 'linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, #10b981, #06b6d4, #8b5cf6) border-box',
                boxShadow: '0 25px 60px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                '&:focus-within': { 
                  transform: 'translateY(-4px) scale(1.01)',
                  boxShadow: '0 30px 70px -10px rgba(16, 185, 129, 0.4), 0 0 0 4px rgba(16, 185, 129, 0.1)'
                }
              }}>
                <Box sx={{ 
                  ml: 2,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <LanguageIcon sx={{ color: '#10b981', fontSize: 28 }} />
                </Box>
                <InputBase
                  sx={{ 
                    ml: 2, 
                    flex: 1, 
                    fontSize: '1.15rem', 
                    color: '#1e293b', 
                    py: 2,
                    fontWeight: 600,
                    '&::placeholder': {
                      color: '#94a3b8',
                      opacity: 1
                    }
                  }}
                  placeholder="Nhập URL, tên miền hoặc địa chỉ IP để kiểm tra an toàn..."
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
                    background: loading 
                      ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                      : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: 2.5,
                    minWidth: '140px',
                    height: '56px',
                    mr: 0.5,
                    boxShadow: '0 8px 20px -4px rgba(16, 185, 129, 0.5)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    transition: 'all 0.3s',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 28px -4px rgba(16, 185, 129, 0.6)'
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                    }
                  }}
                >
                  {loading ? (
                    <><CircularProgress size={24} sx={{ color: '#fff', mr: 1 }} /> Đang quét...</>
                  ) : (
                    <><SearchIcon sx={{ mr: 1 }} /> Kiểm tra</>
                  )}
                </Button>
              </Paper>
              {(urlError || error) && (
                <Fade in>
                  <Alert 
                    severity="error" 
                    icon={<ErrorIcon />}
                    sx={{ 
                      mt: 3,
                      borderRadius: 3,
                      bgcolor: 'rgba(239, 68, 68, 0.1)',
                      color: '#fca5a5',
                      border: '2px solid rgba(239, 68, 68, 0.3)',
                      backdropFilter: 'blur(10px)',
                      fontWeight: 600,
                      '& .MuiAlert-icon': {
                        color: '#ef4444'
                      }
                    }}
                  >
                    {urlError || error}
                  </Alert>
                </Fade>
              )}
            </Box>
          </Grow>

          {/* Social Links */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 3, 
            mb: 8,
            flexWrap: 'wrap'
          }}>
            
          </Box>

          {/* Feature Buttons */}
          <Grid container spacing={2.5} justifyContent="center" sx={{ maxWidth: '1100px', mx: 'auto' }}>
            {actionButtons.map((btn, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in timeout={1200 + (index * 100)}>
                  <Button 
                    fullWidth
                    variant="contained"
                    startIcon={btn.icon}
                    onClick={() => navigate(btn.path)}
                    sx={{ 
                      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                      color: '#fff',
                      py: 2.5,
                      px: 3,
                      borderRadius: 4,
                      border: '2px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.3)',
                      '&::before': {
                        content: '\"\"',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, ${btn.color}22 0%, ${btn.color}11 100%)`,
                        opacity: 0,
                        transition: 'opacity 0.3s'
                      },
                      '&:hover': {
                        background: `linear-gradient(135deg, ${btn.color} 0%, ${btn.color}dd 100%)`,
                        borderColor: btn.color,
                        transform: 'translateY(-6px) scale(1.02)',
                        boxShadow: `0 20px 40px -8px ${btn.color}60`,
                        '&::before': {
                          opacity: 1
                        }
                      },
                      '& .MuiButton-startIcon': {
                        marginRight: 1.5,
                        fontSize: '1.5rem'
                      }
                    }}
                  >
                    {btn.label}
                  </Button>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 3. RESULT SECTION */}
      <Container maxWidth="md" sx={{ mb: resultsRef.current ? 8 : 0 }}>
        <Box ref={resultsRef}>
          {(result || blacklistResult) && (
            <Fade in timeout={800}>
              <Paper elevation={0} sx={{ 
                p: { xs: 4, md: 6 }, 
                borderRadius: 6, 
                background: blacklistResult?.isSafe && result?.safe 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
                border: blacklistResult?.isSafe && result?.safe
                  ? '2px solid rgba(16, 185, 129, 0.3)'
                  : '2px solid rgba(239, 68, 68, 0.3)',
                backdropFilter: 'blur(30px)', 
                mb: 6,
                boxShadow: blacklistResult?.isSafe && result?.safe
                  ? '0 20px 60px -10px rgba(16, 185, 129, 0.4)'
                  : '0 20px 60px -10px rgba(239, 68, 68, 0.4)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: blacklistResult?.isSafe && result?.safe
                    ? 'linear-gradient(90deg, #10b981, #06b6d4, #10b981)'
                    : 'linear-gradient(90deg, #ef4444, #f59e0b, #ef4444)',
                  backgroundSize: '200% 100%',
                  animation: 'gradient 3s ease infinite'
                },
                '@keyframes gradient': {
                  '0%, 100%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '100% 50%' }
                }
              }}>
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                   {blacklistResult?.isSafe && result?.safe ? (
                     <>
                       <Box sx={{ 
                         display: 'inline-flex',
                         p: 3,
                         borderRadius: '50%',
                         bgcolor: 'rgba(16, 185, 129, 0.2)',
                         mb: 3,
                         animation: 'pulse 2s ease-in-out infinite',
                         '@keyframes pulse': {
                           '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                           '50%': { transform: 'scale(1.05)', opacity: 0.8 }
                         }
                       }}>
                         <CheckCircleIcon sx={{ 
                           fontSize: 72, 
                           color: '#10b981', 
                           filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.6))'
                         }} />
                       </Box>
                       {result?.trusted && (
                         <Box sx={{ mb: 3 }}>
                           <Chip 
                             icon={<ShieldIcon sx={{ fontSize: '1.2rem !important' }} />} 
                             label="TRANG WEB ĐÁNG TIN CẬY" 
                             sx={{ 
                               background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                               color: '#fff', 
                               fontWeight: 800,
                               fontSize: '1rem',
                               px: 3,
                               py: 3,
                               height: 'auto',
                               borderRadius: 3,
                               boxShadow: '0 8px 20px -4px rgba(16, 185, 129, 0.5)',
                               border: '2px solid rgba(255, 255, 255, 0.2)',
                               '& .MuiChip-icon': {
                                 color: '#fff'
                               }
                             }} 
                           />
                         </Box>
                       )}
                     </>
                   ) : (
                     <Box sx={{ 
                       display: 'inline-flex',
                       p: 3,
                       borderRadius: '50%',
                       bgcolor: 'rgba(239, 68, 68, 0.2)',
                       mb: 3,
                       animation: 'shake 0.5s ease-in-out',
                       '@keyframes shake': {
                         '0%, 100%': { transform: 'translateX(0)' },
                         '25%': { transform: 'translateX(-10px)' },
                         '75%': { transform: 'translateX(10px)' }
                       }
                     }}>
                       <WarningIcon sx={{ 
                         fontSize: 72, 
                         color: '#ef4444', 
                         filter: 'drop-shadow(0 0 20px rgba(239,68,68,0.6))'
                       }} />
                     </Box>
                   )}
                   <Typography variant="h3" sx={{ 
                     fontWeight: 900, 
                     mb: 2, 
                     letterSpacing: -1,
                     background: blacklistResult?.isSafe && result?.safe
                       ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'
                       : 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent',
                     textShadow: 'none'
                   }}>
                      {blacklistResult?.isSafe && result?.safe ? 'AN TOÀN TUYỆT ĐỐI' : 'PHÁT HIỆN NGUY HIỂM!'}
                   </Typography>
                   <Typography variant="h6" sx={{ 
                     color: '#cbd5e1',
                     fontWeight: 500,
                     maxWidth: '600px',
                     mx: 'auto',
                     lineHeight: 1.6
                   }}>
                      {blacklistResult?.message || result?.message}
                   </Typography>
                </Box>
                
                <Grid container spacing={3}>
                   <Grid item xs={12} md={6}>
                      <Card elevation={0} sx={{ 
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 4,
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 30px -8px rgba(6, 182, 212, 0.3)',
                          borderColor: 'rgba(6, 182, 212, 0.4)'
                        }
                      }}>
                        <CardContent sx={{ p: 4 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Box sx={{
                              p: 1.5,
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <ShieldIcon sx={{ color: '#fff', fontSize: 28 }} />
                            </Box>
                            <Typography variant="h6" sx={{ 
                              color: '#06b6d4', 
                              fontWeight: 800, 
                              letterSpacing: 0.5,
                              textTransform: 'uppercase'
                            }}>
                              Cơ sở dữ liệu
                            </Typography>
                          </Box>
                          
                          <Box sx={{ 
                            p: 3, 
                            borderRadius: 3,
                            bgcolor: blacklistResult?.isSafe ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            border: `2px solid ${blacklistResult?.isSafe ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                            textAlign: 'center'
                          }}>
                            <Typography variant="h4" sx={{ 
                              fontWeight: 900,
                              color: blacklistResult?.isSafe ? '#10b981' : '#ef4444',
                              mb: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 1
                            }}>
                              {blacklistResult?.isSafe ? (
                                <><CheckCircleIcon sx={{ fontSize: 32 }} /> Sạch</>
                              ) : (
                                <><ErrorIcon sx={{ fontSize: 32 }} /> Nguy hiểm!</>
                              )}
                            </Typography>
                            {!blacklistResult?.isSafe && blacklistResult?.data && (
                               <Box sx={{ mt: 2 }}>
                                 <Chip 
                                   label={`${blacklistResult?.data?.scamType || 'N/A'}`} 
                                   color="error" 
                                   sx={{ 
                                     fontWeight: 700,
                                     fontSize: '0.85rem',
                                     mb: 1
                                   }} 
                                 />
                                 <Typography variant="caption" display="block" sx={{ color: '#94a3b8' }}>
                                   Phát hiện: {formatDate(blacklistResult?.data?.addedDate)}
                                 </Typography>
                               </Box>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                   </Grid>
                   
                   <Grid item xs={12} md={6}>
                      <Card elevation={0} sx={{ 
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 4,
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 30px -8px rgba(139, 92, 246, 0.3)',
                          borderColor: 'rgba(139, 92, 246, 0.4)'
                        }
                      }}>
                        <CardContent sx={{ p: 4 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Box sx={{
                              p: 1.5,
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <VisibilityIcon sx={{ color: '#fff', fontSize: 28 }} />
                            </Box>
                            <Box>
                              <Typography variant="h6" sx={{ 
                                color: '#8b5cf6', 
                                fontWeight: 800, 
                                letterSpacing: 0.5,
                                textTransform: 'uppercase'
                              }}>
                                Phân tích bảo mật
                              </Typography>
                              <Typography variant="caption" sx={{ 
                                color: '#a78bfa', 
                                fontSize: '0.75rem',
                                display: 'block'
                              }}>
                                Dựa trên VirusTotal & Blacklist Database
                              </Typography>
                            </Box>
                          </Box>
                          
                          {result?.aiAnalysis?.success ? (
                            <Box>
                              {/* AI Trust Score */}
                              <Box sx={{ 
                                p: 3, 
                                borderRadius: 3,
                                background: `linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)`,
                                border: '2px solid rgba(139, 92, 246, 0.3)',
                                textAlign: 'center',
                                mb: 2
                              }}>
                                <Typography variant="caption" sx={{ color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                                  Điểm tin cậy
                                </Typography>
                                <Typography variant="h2" sx={{ 
                                  color: '#8b5cf6', 
                                  fontWeight: 900,
                                  my: 1,
                                  textShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                                }}>
                                  {result.aiAnalysis.trustScore || 0}/100
                                </Typography>
                                <Chip 
                                  label={result.aiAnalysis.riskLevel?.toUpperCase() || 'UNKNOWN'}
                                  size="small"
                                  sx={{ 
                                    bgcolor: result.aiAnalysis.riskLevel === 'safe' ? '#10b981' : 
                                            result.aiAnalysis.riskLevel === 'low' ? '#3b82f6' :
                                            result.aiAnalysis.riskLevel === 'medium' ? '#f59e0b' : '#ef4444',
                                    color: '#fff',
                                    fontWeight: 700
                                  }}
                                />
                              </Box>
                              
                              {/* AI Analysis Text */}
                              <Box sx={{ 
                                p: 2.5, 
                                borderRadius: 3,
                                bgcolor: 'rgba(139, 92, 246, 0.05)',
                                border: '1px solid rgba(139, 92, 246, 0.2)'
                              }}>
                                <Typography variant="body2" sx={{ color: '#e2e8f0', lineHeight: 1.6 }}>
                                  {result.aiAnalysis.analysis}
                                </Typography>
                              </Box>
                            </Box>
                          ) : (
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Box sx={{ 
                                  p: 2.5, 
                                  borderRadius: 3,
                                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                                  border: '2px solid rgba(239, 68, 68, 0.2)',
                                  textAlign: 'center',
                                  transition: 'all 0.3s',
                                  '&:hover': {
                                    borderColor: 'rgba(239, 68, 68, 0.5)',
                                    transform: 'scale(1.05)'
                                  }
                                }}>
                                  <ErrorIcon sx={{ color: '#ef4444', fontSize: 28, mb: 1 }} />
                                  <Typography variant="h3" sx={{ 
                                    color: '#ef4444', 
                                    fontWeight: 900,
                                    mb: 0.5,
                                    textShadow: '0 0 20px rgba(239, 68, 68, 0.3)'
                                  }}>
                                    {result?.details?.malicious || result?.analysis?.malicious || 0}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Độc hại
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box sx={{ 
                                  p: 2.5, 
                                  borderRadius: 3,
                                  bgcolor: 'rgba(245, 158, 11, 0.1)',
                                  border: '2px solid rgba(245, 158, 11, 0.2)',
                                  textAlign: 'center',
                                  transition: 'all 0.3s',
                                  '&:hover': {
                                    borderColor: 'rgba(245, 158, 11, 0.5)',
                                    transform: 'scale(1.05)'
                                  }
                                }}>
                                  <WarningIcon sx={{ color: '#f59e0b', fontSize: 28, mb: 1 }} />
                                  <Typography variant="h3" sx={{ 
                                    color: '#f59e0b', 
                                    fontWeight: 900,
                                    mb: 0.5,
                                    textShadow: '0 0 20px rgba(245, 158, 11, 0.3)'
                                  }}>
                                    {result?.details?.suspicious || result?.analysis?.suspicious || 0}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Đáng ngờ
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          )}
                        </CardContent>
                      </Card>
                   </Grid>
                </Grid>
              </Paper>
            </Fade>
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
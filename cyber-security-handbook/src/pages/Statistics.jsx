import { useState, useEffect } from 'react'
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Paper,
  CircularProgress,
  Alert
} from '@mui/material'
import { motion } from 'framer-motion'
import AssessmentIcon from '@mui/icons-material/Assessment'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ReportIcon from '@mui/icons-material/Report'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import PendingIcon from '@mui/icons-material/Pending'
import { getStatistics, getTrendingScams, getReportStats } from '../services/statsService'
import { getScamTypeLabel, getDangerLevelColor } from '../utils/validation'
import FloatingParticles from '../components/FloatingParticles'
import PageTransition from '../components/PageTransition'
import { isAdmin } from '../services/authService'
import { useNavigate } from 'react-router-dom'

const Statistics = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [trending, setTrending] = useState([])
  const [reportStats, setReportStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/')
      return
    }
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [statsResult, trendingResult, reportStatsResult] = await Promise.all([
        getStatistics(),
        getTrendingScams(7),
        getReportStats()
      ])
      
      if (statsResult.success) setStats(statsResult.data)
      if (trendingResult.success) setTrending(trendingResult.data)
      if (reportStatsResult.success) setReportStats(reportStatsResult.data)
    } catch (err) {
      setError(err.message || 'Không thể tải thống kê')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: '#0f172a', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <CircularProgress sx={{ color: '#06b6d4' }} />
      </Box>
    )
  }

  return (
    <PageTransition>
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 8, position: 'relative', overflow: 'hidden' }}>
        <FloatingParticles count={30} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <AssessmentIcon sx={{ fontSize: 64, color: '#06b6d4', mb: 2 }} />
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 900, 
                  color: '#e2e8f0',
                  mb: 2
                }}
              >
                THỐNG KÊ HỆ THỐNG
              </Typography>
              <Typography variant="h6" sx={{ color: '#94a3b8' }}>
                Tổng quan về các mối đe dọa và báo cáo
              </Typography>
            </motion.div>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {/* Overview Stats */}
          {stats && stats.overview && (
            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card sx={{ 
                    bgcolor: 'rgba(239, 68, 68, 0.1)', 
                    border: '2px solid #ef4444',
                    height: '100%'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <WarningIcon sx={{ fontSize: 48, color: '#ef4444', mb: 2 }} />
                      <Typography variant="h3" sx={{ fontWeight: 900, color: '#ef4444' }}>
                        {stats.overview.totalBlacklist}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#94a3b8', mt: 1 }}>
                        Tổng Blacklist
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card sx={{ 
                    bgcolor: 'rgba(6, 182, 212, 0.1)', 
                    border: '2px solid #06b6d4',
                    height: '100%'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <ReportIcon sx={{ fontSize: 48, color: '#06b6d4', mb: 2 }} />
                      <Typography variant="h3" sx={{ fontWeight: 900, color: '#06b6d4' }}>
                        {stats.overview.totalReports}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#94a3b8', mt: 1 }}>
                        Tổng Báo Cáo
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card sx={{ 
                    bgcolor: 'rgba(245, 158, 11, 0.1)', 
                    border: '2px solid #f59e0b',
                    height: '100%'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <PendingIcon sx={{ fontSize: 48, color: '#f59e0b', mb: 2 }} />
                      <Typography variant="h3" sx={{ fontWeight: 900, color: '#f59e0b' }}>
                        {stats.overview.pendingReports}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#94a3b8', mt: 1 }}>
                        Đang Chờ Duyệt
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card sx={{ 
                    bgcolor: 'rgba(16, 185, 129, 0.1)', 
                    border: '2px solid #10b981',
                    height: '100%'
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                      <CheckCircleIcon sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
                      <Typography variant="h3" sx={{ fontWeight: 900, color: '#10b981' }}>
                        {stats.overview.approvedReports}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#94a3b8', mt: 1 }}>
                        Đã Phê Duyệt
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          )}

          {/* Scams by Type */}
          {stats && stats.scamsByType && stats.scamsByType.length > 0 && (
            <Paper sx={{ p: 4, bgcolor: '#1e293b', mb: 6 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#e2e8f0', mb: 3 }}>
                Phân Loại Lừa Đảo
              </Typography>
              <Grid container spacing={2}>
                {stats.scamsByType.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: '#0f172a', 
                      borderRadius: 2,
                      border: '1px solid #475569'
                    }}>
                      <Typography variant="body1" sx={{ color: '#94a3b8', mb: 1 }}>
                        {getScamTypeLabel(item.type)}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#06b6d4' }}>
                        {item.count}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          {/* Trending Scams */}
          {trending && trending.length > 0 && (
            <Paper sx={{ p: 4, bgcolor: '#1e293b', mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUpIcon sx={{ fontSize: 32, color: '#f59e0b', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#e2e8f0' }}>
                  Scam Đang Hot (7 ngày qua)
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {trending.map((scam, index) => (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: '#0f172a', 
                      borderRadius: 2,
                      border: '1px solid #475569',
                      '&:hover': {
                        borderColor: '#06b6d4',
                        boxShadow: '0 4px 12px rgba(6, 182, 212, 0.2)'
                      },
                      transition: 'all 0.3s'
                    }}>
                      <Typography variant="body2" sx={{ color: '#06b6d4', mb: 1, wordBreak: 'break-all' }}>
                        {scam.url}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            px: 1.5, 
                            py: 0.5, 
                            bgcolor: 'rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            borderRadius: 1,
                            fontWeight: 600
                          }}
                        >
                          {getScamTypeLabel(scam.scamType)}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            px: 1.5, 
                            py: 0.5, 
                            bgcolor: `${getDangerLevelColor(scam.dangerLevel)}33`,
                            color: getDangerLevelColor(scam.dangerLevel),
                            borderRadius: 1,
                            fontWeight: 600
                          }}
                        >
                          {scam.dangerLevel}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          {scam.reportCount} báo cáo
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </Container>
      </Box>
    </PageTransition>
  )
}

export default Statistics

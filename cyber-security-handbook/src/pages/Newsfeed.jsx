import { useState, useEffect } from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Button
} from '@mui/material'
import { motion } from 'framer-motion'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { getRecentScams, getScamsByType, getScamsByDangerLevel } from '../services/newsfeedService'
import { getScamTypeLabel, getDangerLevelColor } from '../utils/validation'
import FloatingParticles from '../components/FloatingParticles'
import PageTransition from '../components/PageTransition'

const Newsfeed = () => {
  const [scams, setScams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('recent') // recent, type, danger
  const [selectedType, setSelectedType] = useState('')
  const [selectedDanger, setSelectedDanger] = useState('')

  useEffect(() => {
    loadScams()
  }, [filter, selectedType, selectedDanger])

  const loadScams = async () => {
    setLoading(true)
    setError('')
    
    try {
      let result
      
      if (filter === 'recent') {
        result = await getRecentScams(20)
      } else if (filter === 'type' && selectedType) {
        result = await getScamsByType(selectedType, 20)
      } else if (filter === 'danger' && selectedDanger) {
        result = await getScamsByDangerLevel(selectedDanger, 20)
      } else {
        result = await getRecentScams(20)
      }
      
      if (result.success) {
        setScams(result.data)
      } else {
        setError(result.message || 'Không thể tải newsfeed')
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const scamTypes = [
    'phishing',
    'fake-shop',
    'investment-scam',
    'social-engineering',
    'malware',
    'lottery-scam',
    'romance-scam',
    'job-scam',
    'fake-support',
    'other'
  ]

  const dangerLevels = ['low', 'medium', 'high', 'critical']

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
              <NewspaperIcon sx={{ fontSize: 64, color: '#06b6d4', mb: 2 }} />
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 900, 
                  color: '#e2e8f0',
                  mb: 2
                }}
              >
                NEWSFEED CẢNH BÁO
              </Typography>
              <Typography variant="h6" sx={{ color: '#94a3b8' }}>
                Các mối đe dọa lừa đảo mới nhất
              </Typography>
            </motion.div>
          </Box>

          {/* Filters */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Button
                variant={filter === 'recent' ? 'contained' : 'outlined'}
                onClick={() => setFilter('recent')}
                sx={{
                  bgcolor: filter === 'recent' ? '#06b6d4' : 'transparent',
                  color: filter === 'recent' ? '#0f172a' : '#06b6d4',
                  borderColor: '#06b6d4',
                  '&:hover': {
                    bgcolor: filter === 'recent' ? '#0891b2' : 'rgba(6, 182, 212, 0.1)'
                  }
                }}
              >
                Mới Nhất
              </Button>
              <Button
                variant={filter === 'type' ? 'contained' : 'outlined'}
                onClick={() => setFilter('type')}
                sx={{
                  bgcolor: filter === 'type' ? '#06b6d4' : 'transparent',
                  color: filter === 'type' ? '#0f172a' : '#06b6d4',
                  borderColor: '#06b6d4',
                  '&:hover': {
                    bgcolor: filter === 'type' ? '#0891b2' : 'rgba(6, 182, 212, 0.1)'
                  }
                }}
              >
                Theo Loại
              </Button>
              <Button
                variant={filter === 'danger' ? 'contained' : 'outlined'}
                onClick={() => setFilter('danger')}
                sx={{
                  bgcolor: filter === 'danger' ? '#06b6d4' : 'transparent',
                  color: filter === 'danger' ? '#0f172a' : '#06b6d4',
                  borderColor: '#06b6d4',
                  '&:hover': {
                    bgcolor: filter === 'danger' ? '#0891b2' : 'rgba(6, 182, 212, 0.1)'
                  }
                }}
              >
                Theo Mức Độ
              </Button>
            </Stack>

            {/* Type Filter */}
            {filter === 'type' && (
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {scamTypes.map(type => (
                  <Chip
                    key={type}
                    label={getScamTypeLabel(type)}
                    onClick={() => setSelectedType(type)}
                    sx={{
                      bgcolor: selectedType === type ? '#ef4444' : '#1e293b',
                      color: selectedType === type ? '#fff' : '#94a3b8',
                      '&:hover': {
                        bgcolor: selectedType === type ? '#dc2626' : '#334155'
                      }
                    }}
                  />
                ))}
              </Stack>
            )}

            {/* Danger Level Filter */}
            {filter === 'danger' && (
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {dangerLevels.map(level => (
                  <Chip
                    key={level}
                    label={level.toUpperCase()}
                    onClick={() => setSelectedDanger(level)}
                    sx={{
                      bgcolor: selectedDanger === level ? getDangerLevelColor(level) : '#1e293b',
                      color: selectedDanger === level ? '#fff' : '#94a3b8',
                      '&:hover': {
                        bgcolor: selectedDanger === level ? getDangerLevelColor(level) : '#334155'
                      }
                    }}
                  />
                ))}
              </Stack>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {/* Loading */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#06b6d4' }} />
            </Box>
          )}

          {/* Scam Cards */}
          {!loading && scams.length > 0 && (
            <Stack spacing={3}>
              {scams.map((scam, index) => (
                <motion.div
                  key={scam._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card sx={{ 
                    bgcolor: '#1e293b', 
                    border: '1px solid #475569',
                    '&:hover': {
                      borderColor: '#06b6d4',
                      boxShadow: '0 4px 20px rgba(6, 182, 212, 0.3)',
                      transform: 'translateY(-4px)'
                    },
                    transition: 'all 0.3s'
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      {/* URL */}
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#06b6d4', 
                          mb: 2,
                          wordBreak: 'break-all',
                          fontWeight: 600
                        }}
                      >
                        {scam.url}
                      </Typography>

                      {/* Tags */}
                      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                        <Chip
                          icon={<WarningAmberIcon />}
                          label={getScamTypeLabel(scam.scamType)}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            fontWeight: 600
                          }}
                        />
                        <Chip
                          label={scam.dangerLevel.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: `${getDangerLevelColor(scam.dangerLevel)}33`,
                            color: getDangerLevelColor(scam.dangerLevel),
                            fontWeight: 600
                          }}
                        />
                        <Chip
                          label={`${scam.reportCount} báo cáo`}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(6, 182, 212, 0.2)',
                            color: '#06b6d4'
                          }}
                        />
                      </Stack>

                      {/* Description */}
                      {scam.description && (
                        <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 2 }}>
                          {scam.description}
                        </Typography>
                      )}

                      {/* Footer */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, color: '#64748b' }} />
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {formatDate(scam.createdAt)}
                          </Typography>
                        </Box>
                        {scam.isActive && (
                          <Chip
                            label="Đang Hoạt Động"
                            size="small"
                            sx={{
                              bgcolor: 'rgba(239, 68, 68, 0.2)',
                              color: '#ef4444',
                              fontSize: '0.7rem'
                            }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Stack>
          )}

          {/* No Results */}
          {!loading && scams.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ color: '#94a3b8' }}>
                Không có dữ liệu
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </PageTransition>
  )
}

export default Newsfeed

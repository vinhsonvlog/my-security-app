import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Container, Grid, Card, CardContent, Typography, Button, Chip, Box, CircularProgress } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import { getAllEvents } from '../services/eventService'
import FloatingParticles from '../components/FloatingParticles'
import PageTransition from '../components/PageTransition'

const Projects = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const result = await getAllEvents()
      setEvents(result.data || [])
    } catch (err) {
      console.error('Error loading events:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang diễn ra': return 'success'
      case 'Sắp tới': return 'primary'
      case 'Đã kết thúc': return 'default'
      default: return 'primary'
    }
  }

  const handleViewDetail = (eventId) => {
    navigate(`/projects/${eventId}`)
  }

  return (
    <PageTransition>
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 8, position: 'relative', overflow: 'hidden' }}>
        <FloatingParticles count={30} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <EventIcon sx={{ fontSize: 48, color: '#06b6d4' }} />
              </motion.div>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#e2e8f0' }}>
                Sự kiện & Dự án
              </Typography>
            </Box>
          </motion.div>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#06b6d4' }} />
            </Box>
          ) : events.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ color: '#94a3b8' }}>
                Chưa có sự kiện nào
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              <AnimatePresence mode="wait">
                {events.map((event, index) => (
                  <Grid item xs={12} md={6} key={event._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 50, rotateX: -15 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ 
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: [0.25, 0.4, 0.25, 1]
                      }}
                      whileHover={{ 
                        y: -8,
                        transition: { duration: 0.2 }
                      }}
                      style={{ height: '100%' }}
                    >
                      <Card 
                        sx={{ 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          bgcolor: 'rgba(30, 41, 59, 0.8)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(148, 163, 184, 0.1)',
                          transition: 'all 0.3s',
                          '&:hover': {
                            boxShadow: '0 20px 40px rgba(6, 182, 212, 0.4)',
                            border: '1px solid rgba(6, 182, 212, 0.3)'
                          }
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1, p: 4 }}>
                          <Chip 
                            label={event.status} 
                            color={getStatusColor(event.status)}
                            sx={{ mb: 2, fontWeight: 700 }}
                          />
                          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#e2e8f0' }}>
                            {event.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#94a3b8',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {event.description}
                          </Typography>
                          {event.startDate && (
                            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#64748b' }}>
                              📅 {new Date(event.startDate).toLocaleDateString('vi-VN')}
                            </Typography>
                          )}
                        </CardContent>
                        <Box sx={{ p: 3, borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button 
                              variant="contained" 
                              fullWidth
                              onClick={() => handleViewDetail(event._id)}
                              sx={{
                                bgcolor: '#06b6d4',
                                fontWeight: 700,
                                '&:hover': { 
                                  bgcolor: '#0891b2',
                                  boxShadow: '0 8px 16px rgba(6, 182, 212, 0.3)'
                                }
                              }}
                            >
                              Xem chi tiết →
                            </Button>
                          </motion.div>
                        </Box>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </Container>
      </Box>
    </PageTransition>
  )
}

export default Projects
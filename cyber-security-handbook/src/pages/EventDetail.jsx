import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { getEventById } from '../services/eventService';
import FloatingParticles from '../components/FloatingParticles';
import PageTransition from '../components/PageTransition';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await getEventById(id);
      setEvent(result.data);
    } catch (err) {
      setError(err.message || 'Không thể tải sự kiện');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang diễn ra': return 'success'
      case 'Sắp tới': return 'primary'
      case 'Đã kết thúc': return 'default'
      default: return 'primary'
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <FloatingParticles count={20} />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <CircularProgress sx={{ color: '#06b6d4' }} size={60} />
          </motion.div>
        </Box>
      </PageTransition>
    );
  }

  if (error || !event) {
    return (
      <PageTransition>
        <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 8, position: 'relative' }}>
          <FloatingParticles count={15} />
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Alert 
                severity="error" 
                sx={{ 
                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                {error || 'Không tìm thấy sự kiện'}
              </Alert>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ marginTop: '2rem' }}
              >
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/projects')}
                  sx={{
                    color: '#06b6d4',
                    fontWeight: 600,
                    '&:hover': { bgcolor: 'rgba(6, 182, 212, 0.1)' }
                  }}
                >
                  Quay lại danh sách
                </Button>
              </motion.div>
            </motion.div>
          </Container>
        </Box>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 8, position: 'relative', overflow: 'hidden' }}>
        <FloatingParticles count={25} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: '2rem' }}
          >
            <motion.div
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/projects')}
                sx={{
                  color: '#06b6d4',
                  fontWeight: 600,
                  '&:hover': { 
                    bgcolor: 'rgba(6, 182, 212, 0.1)',
                    boxShadow: '0 4px 12px rgba(6, 182, 212, 0.2)'
                  },
                  transition: 'all 0.3s'
                }}
              >
                Quay lại danh sách
              </Button>
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, rotateX: -20 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 5,
                bgcolor: 'rgba(30, 41, 59, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(148, 163, 184, 0.1)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* Status Chip */}
              <Box sx={{ mb: 3 }}>
                <Chip
                  label={event.status}
                  color={getStatusColor(event.status)}
                  sx={{ 
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    px: 1
                  }}
                />
              </Box>

              {/* Title */}
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 3, 
                  color: '#e2e8f0',
                  lineHeight: 1.2
                }}
              >
                {event.title}
              </Typography>

              {/* Meta Info */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                {event.createdBy && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ color: '#06b6d4', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      {event.createdBy.username}
                    </Typography>
                  </Box>
                )}

                {event.startDate && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventIcon sx={{ color: '#06b6d4', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      {new Date(event.startDate).toLocaleDateString('vi-VN')}
                      {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString('vi-VN')}`}
                    </Typography>
                  </Box>
                )}

                {event.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon sx={{ color: '#06b6d4', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      {event.location}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon sx={{ color: '#06b6d4', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    {new Date(event.createdAt).toLocaleDateString('vi-VN')}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 4, borderColor: 'rgba(148, 163, 184, 0.2)' }} />

              {/* Description */}
              {event.description && (
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 2, 
                      color: '#06b6d4'
                    }}
                  >
                    Mô tả ngắn
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#cbd5e1',
                      lineHeight: 1.8,
                      fontSize: '1.1rem'
                    }}
                  >
                    {event.description}
                  </Typography>
                </Box>
              )}

              {/* Image */}
              {event.imageUrl && (
                <Box sx={{ my: 4 }}>
                  <Box
                    component="img"
                    src={event.imageUrl}
                    alt={event.title}
                    sx={{
                      width: '100%',
                      borderRadius: 2,
                      maxHeight: 600,
                      objectFit: 'cover',
                      border: '2px solid rgba(6, 182, 212, 0.2)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                    }}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </Box>
              )}

              {/* Content */}
              <Box sx={{ mt: 4 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 2, 
                    color: '#06b6d4'
                  }}
                >
                  Nội dung chi tiết
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#cbd5e1',
                    lineHeight: 1.8,
                    fontSize: '1.05rem',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {event.content}
                </Typography>
              </Box>

              {/* Footer */}
              <Divider sx={{ my: 4, borderColor: 'rgba(148, 163, 184, 0.2)' }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Đăng ngày {new Date(event.createdAt).toLocaleDateString('vi-VN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/projects')}
                    sx={{
                      bgcolor: '#06b6d4',
                      fontWeight: 700,
                      '&:hover': { 
                        bgcolor: '#0891b2',
                        boxShadow: '0 8px 16px rgba(6, 182, 212, 0.3)'
                      }
                    }}
                  >
                    Quay lại
                  </Button>
                </motion.div>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </PageTransition>
  );
};

export default EventDetail;

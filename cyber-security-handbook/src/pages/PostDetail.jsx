import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getPostById } from '../services/postService';
import FloatingParticles from '../components/FloatingParticles';
import PageTransition from '../components/PageTransition';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await getPostById(id);
      setPost(result.data);
    } catch (err) {
      setError(err.message || 'Không thể tải bài viết');
    } finally {
      setLoading(false);
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

  if (error || !post) {
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
              <Alert severity="error" sx={{ mb: 3 }}>
                {error || 'Không tìm thấy bài viết'}
              </Alert>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/community')}
                  variant="contained"
                  sx={{ 
                    bgcolor: '#06b6d4',
                    '&:hover': { bgcolor: '#0891b2' }
                  }}
                >
                  Quay lại cộng đồng
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
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/community')}
              sx={{
                color: '#94a3b8',
                mb: 4,
                '&:hover': {
                  color: '#06b6d4',
                  bgcolor: 'rgba(6, 182, 212, 0.1)'
                }
              }}
            >
              Quay lại cộng đồng
            </Button>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ 
              duration: 0.7,
              ease: [0.25, 0.4, 0.25, 1]
            }}
          >
            <Paper
              elevation={24}
              sx={{
                bgcolor: 'rgba(30, 41, 59, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
              }}
            >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              p: 4,
              borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Chip
                icon={<CheckCircleIcon />}
                label="Đã duyệt"
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  px: 1,
                  '& .MuiChip-icon': {
                    color: '#10b981'
                  }
                }}
              />
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: '#e2e8f0',
                mb: 3,
                lineHeight: 1.3,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {post.title}
            </Typography>

            {/* Author Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: '#06b6d4',
                    width: 56,
                    height: 56,
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
                  }}
                >
                  {post.username?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <PersonIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#e2e8f0' }}>
                      {post.username}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: '#64748b' }} />
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {new Date(post.approvedAt || post.createdAt).toLocaleString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ p: 4 }}>
            <Box
              sx={{
                bgcolor: '#0f172a',
                p: 4,
                borderRadius: 2,
                borderLeft: '4px solid #06b6d4',
                mb: 4
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#06b6d4',
                  fontWeight: 700,
                  mb: 2,
                  fontSize: '1.1rem'
                }}
              >
                📋 Nội dung chi tiết
              </Typography>
              <Divider sx={{ bgcolor: 'rgba(148, 163, 184, 0.1)', mb: 3 }} />
              <Typography
                variant="body1"
                sx={{
                  color: '#cbd5e1',
                  lineHeight: 1.9,
                  fontSize: '1.05rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {post.content}
              </Typography>
            </Box>

            {/* Image */}
            {post.imageUrl && (
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#06b6d4',
                    fontWeight: 700,
                    mb: 2,
                    fontSize: '1.1rem'
                  }}
                >
                  🖼️ Hình ảnh đính kèm
                </Typography>
                <Box
                  component="img"
                  src={post.imageUrl}
                  alt={post.title}
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    border: '2px solid rgba(6, 182, 212, 0.2)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              bgcolor: '#0f172a',
              p: 3,
              borderTop: '1px solid rgba(148, 163, 184, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Bài viết này đã được admin xác minh và phê duyệt
            </Typography>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/community')}
                sx={{
                  bgcolor: '#06b6d4',
                  px: 3,
                  py: 1,
                  fontWeight: 700,
                  '&:hover': {
                    bgcolor: '#0891b2',
                    boxShadow: '0 8px 16px rgba(6, 182, 212, 0.3)'
                  },
                  transition: 'all 0.3s'
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

export default PostDetail;

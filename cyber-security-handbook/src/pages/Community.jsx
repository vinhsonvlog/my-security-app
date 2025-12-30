import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Alert, 
  CircularProgress,
  Chip,
  IconButton,
  Pagination,
  InputAdornment
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import WarningIcon from '@mui/icons-material/Warning'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import ImageIcon from '@mui/icons-material/Image'
import SearchIcon from '@mui/icons-material/Search'
import { getApprovedPosts, createPost } from '../services/postService'
import { isAuthenticated } from '../services/authService'
import FloatingParticles from '../components/FloatingParticles'
import PageTransition from '../components/PageTransition'

const Community = () => {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ title: '', content: '', imageUrl: '' })
  const [submitting, setSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Pagination & Search states
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const postsPerPage = 10

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    try {
      const result = await getApprovedPosts()
      setPosts(result.data || [])
    } catch (err) {
      console.error('Error loading posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDialogOpen = () => {
    setDialogOpen(true)
    setError('')
    setSuccess('')
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setFormData({ title: '', content: '', imageUrl: '' })
    setImageFile(null)
    setImagePreview('')
    setError('')
    setSuccess('')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước ảnh không được vượt quá 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file ảnh')
        return
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        setImagePreview(base64String)
        setFormData(prev => ({ ...prev, imageUrl: base64String }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData(prev => ({ ...prev, imageUrl: '' }))
  }

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const result = await createPost(formData)
      setSuccess(result.message || 'Bài viết đã được gửi và đang chờ admin duyệt!')
      
      setTimeout(() => {
        handleDialogClose()
      }, 2000)
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      post.title?.toLowerCase().includes(query) ||
      post.content?.toLowerCase().includes(query) ||
      post.username?.toLowerCase().includes(query)
    )
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handlePostClick = (postId) => {
    navigate(`/community/${postId}`)
  }

  return (
    <PageTransition>
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 8, position: 'relative', overflow: 'hidden' }}>
        <FloatingParticles count={30} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                  <NotificationsActiveIcon sx={{ fontSize: 48, color: '#06b6d4' }} />
                </motion.div>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#e2e8f0' }}>
                  Cộng đồng cảnh báo
                </Typography>
              </Box>
          
          {isAuthenticated() && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleDialogOpen}
                sx={{
                  bgcolor: '#06b6d4',
                  color: '#fff',
                  fontWeight: 700,
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#0891b2',
                    boxShadow: '0 8px 16px rgba(6, 182, 212, 0.3)'
                  },
                  transition: 'all 0.3s'
                }}
              >
                Đăng bài cảnh báo
              </Button>
            </motion.div>
          )}
        </Box>
      </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box sx={{ mb: 4 }}>
            <TextField
            fullWidth
            placeholder="Tìm kiếm bài viết theo tiêu đề, nội dung hoặc tên người đăng..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#06b6d4' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#1e293b',
                color: '#e2e8f0',
                '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                '&:hover fieldset': { borderColor: '#06b6d4' },
                '&.Mui-focused fieldset': { borderColor: '#06b6d4' }
              }
            }}
          />
          {searchQuery && (
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
              Tìm thấy {filteredPosts.length} kết quả
            </Typography>
          )}
        </Box>
        </motion.div>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#06b6d4' }} />
          </Box>
        ) : filteredPosts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <WarningIcon sx={{ fontSize: 64, color: '#475569', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#94a3b8' }}>
              {searchQuery ? 'Không tìm thấy bài viết nào' : 'Chưa có bài viết nào'}
            </Typography>
            {isAuthenticated() && !searchQuery && (
              <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                Hãy là người đầu tiên đăng bài cảnh báo!
              </Typography>
            )}
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              <AnimatePresence mode="wait">
                {currentPosts.map((post, index) => (
                  <Grid item xs={12} md={6} key={post._id}>
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
                        onClick={() => handlePostClick(post._id)}
                        sx={{ 
                          bgcolor: 'rgba(30, 41, 59, 0.8)',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s',
                          cursor: 'pointer',
                          height: '100%',
                          border: '1px solid rgba(148, 163, 184, 0.1)',
                          '&:hover': { 
                            boxShadow: '0 20px 40px rgba(6, 182, 212, 0.4)',
                            border: '1px solid rgba(6, 182, 212, 0.3)'
                          }
                        }}
                      >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#06b6d4', fontWeight: 700 }}>
                          {post.username?.[0]?.toUpperCase() || 'U'}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#e2e8f0' }}>
                            {post.username}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {new Date(post.approvedAt || post.createdAt).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Box>
                        <Chip 
                          label="Đã duyệt" 
                          size="small" 
                          sx={{ 
                            bgcolor: 'rgba(16, 185, 129, 0.1)', 
                            color: '#10b981',
                            fontWeight: 600
                          }} 
                        />
                      </Box>
                      <Typography variant="h6" sx={{ mb: 2, color: '#06b6d4', fontWeight: 700 }}>
                        {post.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#94a3b8', 
                          lineHeight: 1.8, 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {post.content}
                      </Typography>
                      {post.imageUrl && (
                        <Box 
                          component="img" 
                          src={post.imageUrl} 
                          alt={post.title}
                          sx={{ 
                            width: '100%', 
                            borderRadius: 2, 
                            mt: 2,
                            maxHeight: 400,
                            objectFit: 'cover'
                          }}
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination 
                  count={totalPages} 
                  page={currentPage} 
                  onChange={handlePageChange}
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#94a3b8',
                      borderColor: 'rgba(148, 163, 184, 0.3)',
                      '&:hover': {
                        bgcolor: 'rgba(6, 182, 212, 0.1)',
                        borderColor: '#06b6d4'
                      },
                      '&.Mui-selected': {
                        bgcolor: '#06b6d4',
                        color: '#fff',
                        '&:hover': {
                          bgcolor: '#0891b2'
                        }
                      }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}

        {/* Dialog tạo bài viết */}
        <Dialog 
          open={dialogOpen} 
          onClose={handleDialogClose} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#1e293b',
              color: '#e2e8f0'
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: '#0f172a', 
            color: '#06b6d4', 
            fontWeight: 700,
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
          }}>
            Đăng bài cảnh báo mới
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Alert severity="info" sx={{ mb: 3 }}>
              Bài viết của bạn sẽ được admin xem xét trước khi hiển thị công khai
            </Alert>

            <TextField
              fullWidth
              label="Tiêu đề"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              placeholder="Ví dụ: Cảnh báo lừa đảo qua Zalo..."
              inputProps={{ maxLength: 200 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#e2e8f0',
                  '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                  '&:hover fieldset': { borderColor: '#06b6d4' },
                  '&.Mui-focused fieldset': { borderColor: '#06b6d4' }
                },
                '& .MuiInputLabel-root': { color: '#94a3b8' }
              }}
            />

            <TextField
              fullWidth
              label="Nội dung"
              name="content"
              value={formData.content}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              multiline
              rows={6}
              placeholder="Mô tả chi tiết về vấn đề bảo mật hoặc cảnh báo lừa đảo..."
              inputProps={{ maxLength: 2000 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#e2e8f0',
                  '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                  '&:hover fieldset': { borderColor: '#06b6d4' },
                  '&.Mui-focused fieldset': { borderColor: '#06b6d4' }
                },
                '& .MuiInputLabel-root': { color: '#94a3b8' }
              }}
            />

            <Typography variant="caption" sx={{ color: '#64748b', mt: 1, display: 'block' }}>
              {formData.content.length}/2000 ký tự
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ImageIcon sx={{ fontSize: 20 }} />
                Thêm hình ảnh (tùy chọn)
              </Typography>
              
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
                sx={{
                  color: '#06b6d4',
                  borderColor: 'rgba(6, 182, 212, 0.5)',
                  '&:hover': {
                    borderColor: '#06b6d4',
                    bgcolor: 'rgba(6, 182, 212, 0.1)'
                  }
                }}
              >
                Chọn ảnh từ thiết bị
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              
              <Typography variant="caption" sx={{ color: '#64748b', ml: 2, display: 'inline' }}>
                (Tối đa 5MB)
              </Typography>
            </Box>

            {imagePreview && (
              <Box sx={{ mt: 2, position: 'relative' }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', mb: 1, display: 'block' }}>
                  Xem trước hình ảnh:
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Box 
                    component="img" 
                    src={imagePreview} 
                    alt="Preview"
                    sx={{ 
                      maxWidth: '100%', 
                      maxHeight: 300, 
                      borderRadius: 2,
                      border: '2px solid rgba(6, 182, 212, 0.3)'
                    }}
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0, 0, 0, 0.6)',
                      color: '#fff',
                      '&:hover': {
                        bgcolor: 'rgba(239, 68, 68, 0.8)'
                      }
                    }}
                    size="small"
                  >
                    ✕
                  </IconButton>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: '#0f172a' }}>
            <Button 
              onClick={handleDialogClose} 
              sx={{ color: '#94a3b8' }}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={submitting}
              sx={{
                bgcolor: '#06b6d4',
                '&:hover': { bgcolor: '#0891b2' }
              }}
            >
              {submitting ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Gửi bài'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  </PageTransition>
  )
}

export default Community
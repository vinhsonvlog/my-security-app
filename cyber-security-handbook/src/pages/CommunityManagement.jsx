import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import PeopleIcon from '@mui/icons-material/People'
import { getPendingPosts, approvePost, rejectPost, getApprovedPostsAdmin, getRejectedPosts, deletePost } from '../services/postService'
import FloatingParticles from '../components/FloatingParticles'
import PageTransition from '../components/PageTransition'

const CommunityManagement = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedPost, setSelectedPost] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState('') // 'approve' or 'reject'
  const [adminNote, setAdminNote] = useState('')
  const [tabValue, setTabValue] = useState(0) // 0: Pending, 1: Approved, 2: Rejected

  useEffect(() => {
    loadPosts()
  }, [tabValue])

  const loadPosts = async () => {
    setLoading(true)
    setError('')
    
    try {
      let result
      if (tabValue === 0) {
        result = await getPendingPosts()
      } else if (tabValue === 1) {
        result = await getApprovedPostsAdmin()
      } else {
        result = await getRejectedPosts()
      }
      
      setPosts(result.data || [])
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách bài viết')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (post, type) => {
    setSelectedPost(post)
    setDialogType(type)
    setDialogOpen(true)
    setAdminNote('')
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedPost(null)
    setAdminNote('')
  }

  const handleApprove = async () => {
    try {
      await approvePost(selectedPost._id, adminNote)
      setSuccess('Bài viết đã được phê duyệt!')
      handleCloseDialog()
      loadPosts()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Phê duyệt thất bại')
    }
  }

  const handleReject = async () => {
    try {
      await rejectPost(selectedPost._id, adminNote)
      setSuccess('Bài viết đã bị từ chối!')
      handleCloseDialog()
      loadPosts()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Từ chối thất bại')
    }
  }

  const handleDeleteOpen = (post) => {
    setSelectedPost(post)
    setDeleteDialogOpen(true)
  }

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false)
    setSelectedPost(null)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deletePost(selectedPost._id)
      setSuccess('Bài viết đã được xóa!')
      handleDeleteClose()
      loadPosts()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Xóa bài viết thất bại')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const getStatusChip = (status) => {
    const statusMap = {
      pending: { label: 'Chờ duyệt', color: 'warning' },
      approved: { label: 'Đã duyệt', color: 'success' },
      rejected: { label: 'Đã từ chối', color: 'error' }
    }
    const { label, color } = statusMap[status] || statusMap.pending
    return <Chip label={label} color={color} size="small" />
  }

  return (
    <PageTransition>
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 8, position: 'relative', overflow: 'hidden' }}>
        <FloatingParticles count={25} />
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
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
                <PeopleIcon sx={{ fontSize: 48, color: '#10b981' }} />
              </motion.div>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#e2e8f0' }}>
                Quản lý Bài viết Cộng đồng
              </Typography>
            </Box>
          </motion.div>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box sx={{ borderBottom: 2, borderColor: '#475569', mb: 4 }}>
              <Tabs 
                value={tabValue} 
                onChange={(e, newValue) => setTabValue(newValue)}
                sx={{
                  '& .MuiTab-root': { 
                    color: '#94a3b8', 
                    fontWeight: 700,
                    fontSize: '1rem',
                    px: 4,
                    py: 2
                  },
                  '& .Mui-selected': { color: '#10b981' },
                  '& .MuiTabs-indicator': { bgcolor: '#10b981', height: 3 }
                }}
              >
                <Tab label="Chờ duyệt" />
                <Tab label="Đã duyệt" />
                <Tab label="Đã từ chối" />
              </Tabs>
            </Box>
          </motion.div>

          {/* Posts Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Paper 
              elevation={24}
              sx={{ 
                bgcolor: '#1e293b',
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid rgba(148, 163, 184, 0.1)'
              }}
            >
              {loading ? (
                <Box sx={{ p: 8, textAlign: 'center' }}>
                  <CircularProgress sx={{ color: '#10b981' }} />
                </Box>
              ) : posts.length === 0 ? (
                <Box sx={{ p: 8, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#64748b' }}>
                    Không có bài viết nào
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#0f172a' }}>
                        <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Người đăng</TableCell>
                        <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Tiêu đề</TableCell>
                        <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Nội dung</TableCell>
                        <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Ngày tạo</TableCell>
                        <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Trạng thái</TableCell>
                        <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Hành động</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {posts.map((post) => (
                        <TableRow 
                          key={post._id}
                          component={motion.tr}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          sx={{ '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.05)' } }}
                        >
                          <TableCell sx={{ color: '#e2e8f0' }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {post.username}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                {post.user?.email || 'Người dùng ẩn danh'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: '#e2e8f0', maxWidth: 250 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {post.title}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color: '#94a3b8', maxWidth: 300 }}>
                            <Typography variant="body2" noWrap>
                              {post.content.substring(0, 100)}...
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                            {formatDate(post.createdAt)}
                          </TableCell>
                          <TableCell>
                            {getStatusChip(post.status)}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {tabValue === 0 && (
                                <>
                                  <IconButton
                                    onClick={() => handleOpenDialog(post, 'approve')}
                                    sx={{ color: '#10b981', '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.1)' } }}
                                    size="small"
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => handleOpenDialog(post, 'reject')}
                                    sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                                    size="small"
                                  >
                                    <CancelIcon />
                                  </IconButton>
                                </>
                              )}
                              <IconButton
                                onClick={() => handleDeleteOpen(post)}
                                sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </motion.div>

          {/* Approve/Reject Dialog */}
          <Dialog 
            open={dialogOpen} 
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                bgcolor: '#1e293b',
                color: '#e2e8f0'
              }
            }}
          >
            <DialogTitle sx={{ bgcolor: '#0f172a', color: dialogType === 'approve' ? '#10b981' : '#ef4444', fontWeight: 700 }}>
              {dialogType === 'approve' ? '✅ Phê duyệt bài viết' : '❌ Từ chối bài viết'}
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Box sx={{ pt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1, color: '#94a3b8' }}>
                  <strong style={{ color: '#10b981' }}>Tiêu đề:</strong> {selectedPost?.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: '#94a3b8' }}>
                  <strong style={{ color: '#10b981' }}>Nội dung:</strong> {selectedPost?.content}
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Ghi chú của Admin"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Nhập lý do phê duyệt/từ chối..."
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
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, bgcolor: '#0f172a' }}>
              <Button onClick={handleCloseDialog} sx={{ color: '#94a3b8' }}>
                Hủy
              </Button>
              <Button 
                onClick={dialogType === 'approve' ? handleApprove : handleReject}
                variant="contained"
                sx={{
                  bgcolor: dialogType === 'approve' ? '#10b981' : '#ef4444',
                  '&:hover': { bgcolor: dialogType === 'approve' ? '#059669' : '#dc2626' }
                }}
              >
                {dialogType === 'approve' ? 'Phê duyệt' : 'Từ chối'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={handleDeleteClose}
            PaperProps={{
              sx: {
                bgcolor: '#1e293b',
                color: '#e2e8f0'
              }
            }}
          >
            <DialogTitle sx={{ bgcolor: '#0f172a', color: '#ef4444', fontWeight: 700 }}>
              Xác nhận xóa
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Typography sx={{ color: '#94a3b8' }}>
                Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, bgcolor: '#0f172a' }}>
              <Button onClick={handleDeleteClose} sx={{ color: '#94a3b8' }}>
                Hủy
              </Button>
              <Button 
                onClick={handleDeleteConfirm} 
                variant="contained"
                sx={{
                  bgcolor: '#ef4444',
                  '&:hover': { bgcolor: '#dc2626' }
                }}
              >
                Xóa
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </PageTransition>
  )
}

export default CommunityManagement

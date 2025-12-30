import { useState, useEffect, useCallback } from 'react'
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Pagination,
  InputAdornment
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EventIcon from '@mui/icons-material/Event'
import ImageIcon from '@mui/icons-material/Image'
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../services/eventService'
import FloatingParticles from '../components/FloatingParticles'
import PageTransition from '../components/PageTransition'

// Component riêng cho form fields để tránh re-render
const EventFormFields = ({ formData = {}, handleChange, handleImageChange, handleRemoveImage, imagePreview = '' }) => {
  // Đảm bảo formData có các giá trị mặc định
  const safeFormData = {
    title: '',
    description: '',
    content: '',
    imageUrl: '',
    status: 'Sắp tới',
    location: '',
    startDate: '',
    endDate: '',
    ...formData
  };

  return (
  <>
    <TextField
      fullWidth
      label="Tiêu đề *"
      name="title"
      value={safeFormData.title}
      onChange={handleChange}
      margin="normal"
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
      label="Mô tả ngắn *"
      name="description"
      value={safeFormData.description}
      onChange={handleChange}
      margin="normal"
      multiline
      rows={2}
      inputProps={{ maxLength: 500 }}
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
      label="Nội dung chi tiết *"
      name="content"
      value={safeFormData.content}
      onChange={handleChange}
      margin="normal"
      multiline
      rows={6}
      inputProps={{ maxLength: 5000 }}
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

    <FormControl fullWidth margin="normal">
      <InputLabel sx={{ color: '#94a3b8' }}>Trạng thái</InputLabel>
      <Select
        name="status"
        value={safeFormData.status}
        onChange={handleChange}
        label="Trạng thái"
        sx={{
          color: '#e2e8f0',
          '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
          '&:hover fieldset': { borderColor: '#06b6d4' },
          '&.Mui-focused fieldset': { borderColor: '#06b6d4' }
        }}
      >
        <MenuItem value="Sắp tới">Sắp tới</MenuItem>
        <MenuItem value="Đang diễn ra">Đang diễn ra</MenuItem>
        <MenuItem value="Đã kết thúc">Đã kết thúc</MenuItem>
      </Select>
    </FormControl>

    <TextField
      fullWidth
      label="Địa điểm"
      name="location"
      value={safeFormData.location}
      onChange={handleChange}
      margin="normal"
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

    <Box sx={{ display: 'flex', gap: 2 }}>
      <TextField
        fullWidth
        label="Ngày bắt đầu"
        name="startDate"
        type="date"
        value={safeFormData.startDate}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{ shrink: true }}
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
        label="Ngày kết thúc"
        name="endDate"
        type="date"
        value={safeFormData.endDate}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{ shrink: true }}
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
    </Box>

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
  </>
  );
}

const EventManagement = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    imageUrl: '',
    status: 'Sắp tới',
    location: '',
    startDate: '',
    endDate: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [imagePreview, setImagePreview] = useState('')
  const eventsPerPage = 10

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const result = await getAllEvents()
      setEvents(result.data || [])
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách sự kiện')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      imageUrl: '',
      status: 'Sắp tới',
      location: '',
      startDate: '',
      endDate: ''
    })
    setImagePreview('')
  }

  const handleCreateOpen = () => {
    resetForm()
    setCreateDialogOpen(true)
    setError('')
    setSuccess('')
  }

  const handleCreateClose = () => {
    setCreateDialogOpen(false)
    resetForm()
  }

  const handleCreateSubmit = async () => {
    if (!formData.title || !formData.description || !formData.content) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    // Kiểm tra token
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Vui lòng đăng nhập để tạo sự kiện')
      return
    }

    // Kiểm tra quyền admin
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.role !== 'admin') {
      setError('Chỉ quản trị viên mới có thể tạo sự kiện')
      return
    }

    try {
      await createEvent(formData)
      setSuccess('Tạo sự kiện thành công!')
      handleCreateClose()
      loadEvents()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error creating event:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Tạo sự kiện thất bại'
      setError(errorMessage)
    }
  }

  const handleEditOpen = (event) => {
    setSelectedEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      content: event.content,
      imageUrl: event.imageUrl || '',
      status: event.status,
      location: event.location || '',
      startDate: event.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : ''
    })
    setImagePreview(event.imageUrl || '')
    setEditDialogOpen(true)
    setError('')
    setSuccess('')
  }

  const handleEditClose = () => {
    setEditDialogOpen(false)
    setSelectedEvent(null)
    resetForm()
  }

  const handleEditSubmit = async () => {
    try {
      await updateEvent(selectedEvent._id, formData)
      setSuccess('Cập nhật sự kiện thành công!')
      handleEditClose()
      loadEvents()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Cập nhật thất bại')
    }
  }

  const handleDeleteOpen = (event) => {
    setSelectedEvent(event)
    setDeleteDialogOpen(true)
    setError('')
  }

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false)
    setSelectedEvent(null)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteEvent(selectedEvent._id)
      setSuccess('Xóa sự kiện thành công!')
      handleDeleteClose()
      loadEvents()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Xóa thất bại')
    }
  }

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước ảnh không được vượt quá 5MB')
        return
      }
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
    setImagePreview('')
    setFormData(prev => ({ ...prev, imageUrl: '' }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang diễn ra': return 'success'
      case 'Sắp tới': return 'primary'
      case 'Đã kết thúc': return 'default'
      default: return 'primary'
    }
  }

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage)
  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent)

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, flexWrap: 'wrap', gap: 2 }}>
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
                  <EventIcon sx={{ fontSize: 48, color: '#06b6d4' }} />
                </motion.div>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#e2e8f0' }}>
                  Quản lý Sự kiện
                </Typography>
              </Box>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateOpen}
                  sx={{
                    bgcolor: '#06b6d4',
                    fontWeight: 700,
                    px: 3,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: '#0891b2',
                      boxShadow: '0 8px 16px rgba(6, 182, 212, 0.3)'
                    }
                  }}
                >
                  Tạo sự kiện mới
                </Button>
              </motion.div>
            </Box>
          </motion.div>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Tìm kiếm tiêu đề, mô tả, địa điểm..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                sx={{
                  flex: 1,
                  minWidth: 300,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#1e293b',
                    color: '#e2e8f0',
                    '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                    '&:hover fieldset': { borderColor: '#06b6d4' },
                    '&.Mui-focused fieldset': { borderColor: '#06b6d4' }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#06b6d4' }} />
                    </InputAdornment>
                  )
                }}
              />
              
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel sx={{ color: '#94a3b8' }}>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  label="Trạng thái"
                  sx={{
                    bgcolor: '#1e293b',
                    color: '#e2e8f0',
                    '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                    '&:hover fieldset': { borderColor: '#06b6d4' },
                    '&.Mui-focused fieldset': { borderColor: '#06b6d4' }
                  }}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="Sắp tới">Sắp tới</MenuItem>
                  <MenuItem value="Đang diễn ra">Đang diễn ra</MenuItem>
                  <MenuItem value="Đã kết thúc">Đã kết thúc</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </motion.div>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#06b6d4' }} />
            </Box>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    bgcolor: 'rgba(30, 41, 59, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(148, 163, 184, 0.1)'
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#0f172a' }}>
                        <TableCell sx={{ color: '#06b6d4', fontWeight: 700 }}>Tiêu đề</TableCell>
                        <TableCell sx={{ color: '#06b6d4', fontWeight: 700 }}>Mô tả</TableCell>
                        <TableCell sx={{ color: '#06b6d4', fontWeight: 700 }}>Trạng thái</TableCell>
                        <TableCell sx={{ color: '#06b6d4', fontWeight: 700 }}>Ngày tạo</TableCell>
                        <TableCell sx={{ color: '#06b6d4', fontWeight: 700 }} align="center">Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentEvents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ color: '#94a3b8', py: 4 }}>
                            Không có sự kiện nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentEvents.map((event, index) => (
                          <motion.tr
                            key={event._id}
                            component={TableRow}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            sx={{
                              '&:hover': { bgcolor: 'rgba(6, 182, 212, 0.05)' }
                            }}
                          >
                            <TableCell sx={{ color: '#e2e8f0', maxWidth: 250 }}>
                              {event.title}
                            </TableCell>
                            <TableCell sx={{ color: '#94a3b8', maxWidth: 300 }}>
                              {event.description}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={event.status}
                                color={getStatusColor(event.status)}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell sx={{ color: '#94a3b8' }}>
                              {new Date(event.createdAt).toLocaleDateString('vi-VN')}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                onClick={() => handleEditOpen(event)}
                                sx={{ color: '#06b6d4', '&:hover': { bgcolor: 'rgba(6, 182, 212, 0.1)' } }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDeleteOpen(event)}
                                sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </motion.tr>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </motion.div>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
                          '&:hover': { bgcolor: '#0891b2' }
                        }
                      }
                    }}
                  />
                </Box>
              )}
            </>
          )}

          {/* Create Dialog */}
          <Dialog 
            open={createDialogOpen} 
            onClose={handleCreateClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                bgcolor: '#1e293b',
                color: '#e2e8f0'
              }
            }}
          >
            <DialogTitle sx={{ bgcolor: '#0f172a', color: '#06b6d4', fontWeight: 700 }}>
              Tạo sự kiện mới
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <EventFormFields 
                formData={formData}
                handleChange={handleChange}
                handleImageChange={handleImageChange}
                handleRemoveImage={handleRemoveImage}
                imagePreview={imagePreview}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, bgcolor: '#0f172a' }}>
              <Button onClick={handleCreateClose} sx={{ color: '#94a3b8' }}>
                Hủy
              </Button>
              <Button 
                onClick={handleCreateSubmit} 
                variant="contained"
                sx={{
                  bgcolor: '#06b6d4',
                  '&:hover': { bgcolor: '#0891b2' }
                }}
              >
                Tạo sự kiện
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog 
            open={editDialogOpen} 
            onClose={handleEditClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                bgcolor: '#1e293b',
                color: '#e2e8f0'
              }
            }}
          >
            <DialogTitle sx={{ bgcolor: '#0f172a', color: '#06b6d4', fontWeight: 700 }}>
              Chỉnh sửa sự kiện
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <EventFormFields 
                formData={formData}
                handleChange={handleChange}
                handleImageChange={handleImageChange}
                handleRemoveImage={handleRemoveImage}
                imagePreview={imagePreview}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, bgcolor: '#0f172a' }}>
              <Button onClick={handleEditClose} sx={{ color: '#94a3b8' }}>
                Hủy
              </Button>
              <Button 
                onClick={handleEditSubmit} 
                variant="contained"
                sx={{
                  bgcolor: '#06b6d4',
                  '&:hover': { bgcolor: '#0891b2' }
                }}
              >
                Cập nhật
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
                Bạn có chắc chắn muốn xóa sự kiện này không? Hành động này không thể hoàn tác.
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

export default EventManagement

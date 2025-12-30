import { useState, useEffect } from 'react'
import { 
  Container, Typography, Box, Paper, TextField, Button, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, CircularProgress, Select, MenuItem, FormControl, InputLabel,
  Pagination
} from '@mui/material'
import { motion } from 'framer-motion'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import { createBlacklist, updateBlacklist, deleteBlacklist, getAllBlacklist } from '../services/blacklistService'
import { isAdmin } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import FloatingParticles from '../components/FloatingParticles'
import PageTransition from '../components/PageTransition'

const NewsfeedManagement = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [formData, setFormData] = useState({
    url: '',
    scamType: 'phishing',
    dangerLevel: 'medium',
    description: '',
    evidenceUrl: ''
  })

  const scamTypes = [
    { value: 'phishing', label: 'Lừa đảo thông tin (Phishing)' },
    { value: 'fake-shop', label: 'Website bán hàng giả' },
    { value: 'investment-scam', label: 'Lừa đảo đầu tư' },
    { value: 'social-engineering', label: 'Kỹ thuật xã hội' },
    { value: 'lottery-scam', label: 'Lừa đảo trúng thưởng' },
    { value: 'romance-scam', label: 'Lừa đảo tình cảm' },
    { value: 'malware', label: 'Phần mềm độc hại' },
    { value: 'job-scam', label: 'Lừa đảo việc làm' },
    { value: 'fake-support', label: 'Giả mạo hỗ trợ' },
    { value: 'other', label: 'Khác' }
  ]

  const dangerLevels = [
    { value: 'low', label: 'Thấp', color: '#10b981' },
    { value: 'medium', label: 'Trung bình', color: '#f59e0b' },
    { value: 'high', label: 'Cao', color: '#ef4444' },
    { value: 'critical', label: 'Nghiêm trọng', color: '#dc2626' }
  ]

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/')
      return
    }
    loadItems()
  }, [page])

  const loadItems = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getAllBlacklist({ page, limit: 10 })
      console.log('getAllBlacklist result:', result)
      
      if (result.success) {
        // API có thể trả về result.data.items hoặc result.items
        const itemsData = result.data?.items || result.items || []
        const totalPagesData = result.data?.totalPages || result.totalPages || 1
        
        setItems(Array.isArray(itemsData) ? itemsData : [])
        setTotalPages(totalPagesData)
      } else {
        setItems([])
        setError(result.message || 'Không thể tải dữ liệu')
      }
    } catch (err) {
      console.error('Load items error:', err)
      setItems([])
      setError(err.message || 'Không thể kết nối đến server')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        url: item.url,
        scamType: item.scamType,
        dangerLevel: item.dangerLevel,
        description: item.description || '',
        evidenceUrl: item.evidenceUrl || ''
      })
    } else {
      setEditingItem(null)
      setFormData({
        url: '',
        scamType: 'phishing',
        dangerLevel: 'medium',
        description: '',
        evidenceUrl: ''
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingItem(null)
    setError('')
  }

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (!formData.url.trim() || !formData.description.trim()) {
      setError('URL và mô tả không được để trống')
      return
    }

    setLoading(true)
    try {
      let result
      if (editingItem) {
        result = await updateBlacklist(editingItem._id, formData)
      } else {
        result = await createBlacklist(formData)
      }

      if (result.success) {
        setSuccess(editingItem ? 'Cập nhật thành công!' : 'Thêm bài viết thành công!')
        handleCloseDialog()
        loadItems()
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return

    setLoading(true)
    try {
      const result = await deleteBlacklist(id)
      if (result.success) {
        setSuccess('Xóa thành công!')
        loadItems()
      }
    } catch (err) {
      setError(err.message || 'Không thể xóa')
    } finally {
      setLoading(false)
    }
  }

  const getDangerColor = (level) => {
    const found = dangerLevels.find(d => d.value === level)
    return found ? found.color : '#94a3b8'
  }

  const getScamLabel = (type) => {
    const found = scamTypes.find(s => s.value === type)
    return found ? found.label : type
  }

  return (
    <PageTransition>
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 8, position: 'relative', overflow: 'hidden' }}>
        <FloatingParticles count={20} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <NewspaperIcon sx={{ fontSize: 48, color: '#10b981' }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                  Quản lý Newsfeed
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{
                  bgcolor: '#10b981',
                  '&:hover': { bgcolor: '#059669' },
                  fontWeight: 700,
                  px: 3
                }}
              >
                Thêm bài viết mới
              </Button>
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

          <Paper sx={{ bgcolor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(10px)', overflow: 'hidden' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                <CircularProgress sx={{ color: '#10b981' }} />
              </Box>
            ) : items.length === 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 8 }}>
                <NewspaperIcon sx={{ fontSize: 80, color: '#475569', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1 }}>
                  Chưa có bài viết nào
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Nhấn nút "Thêm bài viết mới" để bắt đầu
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)' }}>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>URL</TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Loại lừa đảo</TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Mức độ</TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Mô tả</TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }} align="right">Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item._id} sx={{ '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.4)' } }}>
                          <TableCell sx={{ color: '#e2e8f0', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.url}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={getScamLabel(item.scamType)} 
                              size="small"
                              sx={{ bgcolor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={dangerLevels.find(d => d.value === item.dangerLevel)?.label || item.dangerLevel}
                              size="small"
                              sx={{ 
                                bgcolor: `${getDangerColor(item.dangerLevel)}20`,
                                color: getDangerColor(item.dangerLevel),
                                fontWeight: 700
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: '#94a3b8', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.description || 'Không có mô tả'}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton 
                              onClick={() => handleOpenDialog(item)}
                              sx={{ color: '#3b82f6', '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.1)' } }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleDelete(item._id)}
                              sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <Pagination 
                      count={totalPages} 
                      page={page} 
                      onChange={(e, value) => setPage(value)}
                      sx={{
                        '& .MuiPaginationItem-root': { color: '#94a3b8' },
                        '& .Mui-selected': { bgcolor: '#10b981 !important', color: '#fff' }
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Container>

        {/* Dialog thêm/sửa */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { bgcolor: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(20px)', color: '#fff' }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
            {editingItem ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                label="URL lừa đảo"
                fullWidth
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example-scam.com"
                sx={{
                  '& .MuiOutlinedInput-root': { color: '#e2e8f0' },
                  '& .MuiInputLabel-root': { color: '#94a3b8' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(148, 163, 184, 0.3)' }
                }}
              />

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#94a3b8' }}>Loại lừa đảo</InputLabel>
                <Select
                  value={formData.scamType}
                  onChange={(e) => setFormData({ ...formData, scamType: e.target.value })}
                  label="Loại lừa đảo"
                  sx={{
                    color: '#e2e8f0',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(148, 163, 184, 0.3)' }
                  }}
                >
                  {scamTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#94a3b8' }}>Mức độ nguy hiểm</InputLabel>
                <Select
                  value={formData.dangerLevel}
                  onChange={(e) => setFormData({ ...formData, dangerLevel: e.target.value })}
                  label="Mức độ nguy hiểm"
                  sx={{
                    color: '#e2e8f0',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(148, 163, 184, 0.3)' }
                  }}
                >
                  {dangerLevels.map(level => (
                    <MenuItem key={level.value} value={level.value}>
                      <Chip 
                        label={level.label} 
                        size="small"
                        sx={{ bgcolor: `${level.color}20`, color: level.color, fontWeight: 600 }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Mô tả chi tiết"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả về website lừa đảo này, thủ đoạn, cách nhận biết..."
                sx={{
                  '& .MuiOutlinedInput-root': { color: '#e2e8f0' },
                  '& .MuiInputLabel-root': { color: '#94a3b8' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(148, 163, 184, 0.3)' }
                }}
              />

              <TextField
                label="Link bằng chứng (tùy chọn)"
                fullWidth
                value={formData.evidenceUrl}
                onChange={(e) => setFormData({ ...formData, evidenceUrl: e.target.value })}
                placeholder="https://link-to-evidence.com"
                sx={{
                  '& .MuiOutlinedInput-root': { color: '#e2e8f0' },
                  '& .MuiInputLabel-root': { color: '#94a3b8' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(148, 163, 184, 0.3)' }
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog} sx={{ color: '#94a3b8' }}>
              Hủy
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={loading}
              sx={{ 
                bgcolor: '#10b981', 
                '&:hover': { bgcolor: '#059669' },
                minWidth: 120
              }}
            >
              {loading ? <CircularProgress size={24} /> : (editingItem ? 'Cập nhật' : 'Thêm mới')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageTransition>
  )
}

export default NewsfeedManagement

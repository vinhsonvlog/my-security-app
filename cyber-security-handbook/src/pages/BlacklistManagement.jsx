import { useState, useEffect } from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Alert,
  CircularProgress,
  Pagination,
  InputAdornment,
  Stack
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import WarningIcon from '@mui/icons-material/Warning'
import ShieldIcon from '@mui/icons-material/Shield'
import { 
  getAllBlacklist, 
  createBlacklist, 
  updateBlacklist, 
  deleteBlacklist 
} from '../services/blacklistService'
import { isAdmin } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import { getScamTypeLabel, getDangerLevelColor } from '../utils/validation'
import PageTransition from '../components/PageTransition'

const BlacklistManagement = () => {
  const navigate = useNavigate()
  const [blacklist, setBlacklist] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    scamType: '',
    dangerLevel: '',
    isActive: ''
  })

  const [formData, setFormData] = useState({
    url: '',
    scamType: 'phishing',
    dangerLevel: 'medium',
    description: '',
    isActive: true
  })

  const scamTypes = [
    { value: 'phishing', label: 'Lừa đảo (Phishing)' },
    { value: 'fake-shop', label: 'Shop giả mạo' },
    { value: 'investment-scam', label: 'Lừa đảo đầu tư' },
    { value: 'social-engineering', label: 'Kỹ thuật xã hội' },
    { value: 'malware', label: 'Phần mềm độc hại' },
    { value: 'lottery-scam', label: 'Lừa đảo xổ số' },
    { value: 'romance-scam', label: 'Lừa tình' },
    { value: 'job-scam', label: 'Lừa đảo việc làm' },
    { value: 'fake-support', label: 'Hỗ trợ giả mạo' },
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
    loadBlacklist()
  }, [currentPage, filters])

  const loadBlacklist = async () => {
    setLoading(true)
    setError('')
    try {
      const params = {
        page: currentPage,
        limit: 20,
        ...(filters.scamType && { scamType: filters.scamType }),
        ...(filters.dangerLevel && { dangerLevel: filters.dangerLevel }),
        ...(filters.isActive !== '' && { isActive: filters.isActive })
      }

      const result = await getAllBlacklist(params)
      if (result.success) {
        setBlacklist(result.data)
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages)
        }
      } else {
        setError(result.message || 'Không thể tải blacklist')
      }
    } catch (err) {
      setError('Lỗi khi tải dữ liệu')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (item = null) => {
    if (item) {
      setSelectedItem(item)
      setFormData({
        url: item.url,
        scamType: item.scamType,
        dangerLevel: item.dangerLevel,
        description: item.description || '',
        isActive: item.isActive
      })
    } else {
      setSelectedItem(null)
      setFormData({
        url: '',
        scamType: 'phishing',
        dangerLevel: 'medium',
        description: '',
        isActive: true
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedItem(null)
    setError('')
  }

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (!formData.url) {
      setError('Vui lòng nhập URL')
      return
    }

    try {
      let result
      if (selectedItem) {
        result = await updateBlacklist(selectedItem._id, formData)
      } else {
        result = await createBlacklist(formData)
      }

      if (result.success) {
        setSuccess(selectedItem ? 'Cập nhật thành công!' : 'Thêm vào blacklist thành công!')
        handleCloseDialog()
        loadBlacklist()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.message || 'Có lỗi xảy ra')
      }
    } catch (err) {
      setError('Lỗi khi lưu dữ liệu')
      console.error(err)
    }
  }

  const handleDeleteClick = (item) => {
    setSelectedItem(item)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    try {
      const result = await deleteBlacklist(selectedItem._id)
      if (result.success) {
        setSuccess('Xóa thành công!')
        setDeleteDialogOpen(false)
        setSelectedItem(null)
        loadBlacklist()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.message || 'Không thể xóa')
      }
    } catch (err) {
      setError('Lỗi khi xóa')
      console.error(err)
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
    setCurrentPage(1)
  }

  const filteredBlacklist = blacklist.filter(item => {
    if (filters.search) {
      return item.url.toLowerCase().includes(filters.search.toLowerCase())
    }
    return true
  })

  return (
    <PageTransition>
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 8 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ShieldIcon sx={{ fontSize: 48, color: '#ef4444' }} />
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#e2e8f0' }}>
                Quản Lý Blacklist
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                bgcolor: '#ef4444',
                '&:hover': { bgcolor: '#dc2626' }
              }}
            >
              Thêm URL
            </Button>
          </Box>

          {/* Alerts */}
          {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}

          {/* Filters */}
          <Paper sx={{ p: 3, mb: 3, bgcolor: '#1e293b' }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                placeholder="Tìm kiếm URL..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    color: '#e2e8f0',
                    '& fieldset': { borderColor: '#475569' }
                  }
                }}
              />
              <TextField
                select
                label="Loại scam"
                value={filters.scamType}
                onChange={(e) => handleFilterChange('scamType', e.target.value)}
                sx={{
                  minWidth: 200,
                  '& .MuiOutlinedInput-root': { color: '#e2e8f0' },
                  '& label': { color: '#94a3b8' }
                }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {scamTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Mức độ"
                value={filters.dangerLevel}
                onChange={(e) => handleFilterChange('dangerLevel', e.target.value)}
                sx={{
                  minWidth: 180,
                  '& .MuiOutlinedInput-root': { color: '#e2e8f0' },
                  '& label': { color: '#94a3b8' }
                }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {dangerLevels.map(level => (
                  <MenuItem key={level.value} value={level.value}>{level.label}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Trạng thái"
                value={filters.isActive}
                onChange={(e) => handleFilterChange('isActive', e.target.value)}
                sx={{
                  minWidth: 150,
                  '& .MuiOutlinedInput-root': { color: '#e2e8f0' },
                  '& label': { color: '#94a3b8' }
                }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="true">Hoạt động</MenuItem>
                <MenuItem value="false">Vô hiệu</MenuItem>
              </TextField>
            </Stack>
          </Paper>

          {/* Table */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#06b6d4' }} />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ bgcolor: '#1e293b' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#0f172a' }}>
                      <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>URL</TableCell>
                      <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Loại</TableCell>
                      <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Mức độ</TableCell>
                      <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Báo cáo</TableCell>
                      <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Trạng thái</TableCell>
                      <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBlacklist.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ color: '#94a3b8', py: 4 }}>
                          Không có dữ liệu
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBlacklist.map((item) => (
                        <TableRow 
                          key={item._id}
                          sx={{ 
                            '&:hover': { bgcolor: '#334155' },
                            transition: 'background-color 0.2s'
                          }}
                        >
                          <TableCell sx={{ color: '#06b6d4', maxWidth: 300, wordBreak: 'break-all' }}>
                            {item.url}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getScamTypeLabel(item.scamType)}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(239, 68, 68, 0.2)',
                                color: '#ef4444',
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={item.dangerLevel.toUpperCase()}
                              size="small"
                              sx={{
                                bgcolor: `${getDangerLevelColor(item.dangerLevel)}33`,
                                color: getDangerLevelColor(item.dangerLevel),
                                fontWeight: 600
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: '#e2e8f0' }}>
                            {item.reportCount || 0}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={item.isActive ? 'Hoạt động' : 'Vô hiệu'}
                              size="small"
                              sx={{
                                bgcolor: item.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                                color: item.isActive ? '#10b981' : '#64748b'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(item)}
                              sx={{ color: '#06b6d4', mr: 1 }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(item)}
                              sx={{ color: '#ef4444' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, page) => setCurrentPage(page)}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#e2e8f0',
                        borderColor: '#475569',
                        '&.Mui-selected': {
                          bgcolor: '#06b6d4',
                          color: '#0f172a'
                        }
                      }
                    }}
                  />
                </Box>
              )}
            </>
          )}

          {/* Add/Edit Dialog */}
          <Dialog 
            open={dialogOpen} 
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: { bgcolor: '#1e293b', color: '#e2e8f0' }
            }}
          >
            <DialogTitle sx={{ borderBottom: '1px solid #475569' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon sx={{ color: '#ef4444' }} />
                {selectedItem ? 'Chỉnh sửa Blacklist' : 'Thêm vào Blacklist'}
              </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="URL *"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                  sx={{
                    '& .MuiOutlinedInput-root': { color: '#e2e8f0' },
                    '& label': { color: '#94a3b8' }
                  }}
                />
                <TextField
                  fullWidth
                  select
                  label="Loại scam *"
                  value={formData.scamType}
                  onChange={(e) => setFormData({ ...formData, scamType: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': { color: '#e2e8f0' },
                    '& label': { color: '#94a3b8' }
                  }}
                >
                  {scamTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  select
                  label="Mức độ nguy hiểm *"
                  value={formData.dangerLevel}
                  onChange={(e) => setFormData({ ...formData, dangerLevel: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': { color: '#e2e8f0' },
                    '& label': { color: '#94a3b8' }
                  }}
                >
                  {dangerLevels.map(level => (
                    <MenuItem key={level.value} value={level.value}>{level.label}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Mô tả"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết về mối đe dọa..."
                  sx={{
                    '& .MuiOutlinedInput-root': { color: '#e2e8f0' },
                    '& label': { color: '#94a3b8' }
                  }}
                />
                <TextField
                  fullWidth
                  select
                  label="Trạng thái"
                  value={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                  sx={{
                    '& .MuiOutlinedInput-root': { color: '#e2e8f0' },
                    '& label': { color: '#94a3b8' }
                  }}
                >
                  <MenuItem value="true">Hoạt động</MenuItem>
                  <MenuItem value="false">Vô hiệu</MenuItem>
                </TextField>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ borderTop: '1px solid #475569', p: 2 }}>
              <Button onClick={handleCloseDialog} sx={{ color: '#94a3b8' }}>
                Hủy
              </Button>
              <Button 
                onClick={handleSubmit} 
                variant="contained"
                sx={{ 
                  bgcolor: '#ef4444',
                  '&:hover': { bgcolor: '#dc2626' }
                }}
              >
                {selectedItem ? 'Cập nhật' : 'Thêm'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog 
            open={deleteDialogOpen} 
            onClose={() => setDeleteDialogOpen(false)}
            PaperProps={{
              sx: { bgcolor: '#1e293b', color: '#e2e8f0' }
            }}
          >
            <DialogTitle sx={{ color: '#ef4444' }}>Xác nhận xóa</DialogTitle>
            <DialogContent>
              <Typography sx={{ color: '#cbd5e1' }}>
                Bạn có chắc muốn xóa URL này khỏi blacklist?
              </Typography>
              {selectedItem && (
                <Typography sx={{ color: '#06b6d4', mt: 2, wordBreak: 'break-all' }}>
                  {selectedItem.url}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#94a3b8' }}>
                Hủy
              </Button>
              <Button 
                onClick={handleDelete} 
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

export default BlacklistManagement

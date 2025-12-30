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
import SearchIcon from '@mui/icons-material/Search'
import ReportIcon from '@mui/icons-material/Report'
import { getAllReports, updateReportStatus, deleteReport } from '../services/reportService'
import FloatingParticles from '../components/FloatingParticles'
import PageTransition from '../components/PageTransition'

const ReportManagement = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [editData, setEditData] = useState({ status: '', adminNote: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const reportsPerPage = 10

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setLoading(true)
    try {
      const result = await getAllReports()
      setReports(result.data || [])
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách báo cáo')
    } finally {
      setLoading(false)
    }
  }

  const handleEditOpen = (report) => {
    setSelectedReport(report)
    setEditData({
      status: report.status,
      adminNote: report.adminNote || ''
    })
    setEditDialogOpen(true)
    setError('')
    setSuccess('')
  }

  const handleEditClose = () => {
    setEditDialogOpen(false)
    setSelectedReport(null)
    setEditData({ status: '', adminNote: '' })
  }

  const handleEditSubmit = async () => {
    try {
      await updateReportStatus(selectedReport._id, editData)
      setSuccess('Cập nhật báo cáo thành công!')
      handleEditClose()
      loadReports()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Cập nhật thất bại')
    }
  }

  const handleDeleteOpen = (report) => {
    setSelectedReport(report)
    setDeleteDialogOpen(true)
    setError('')
  }

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false)
    setSelectedReport(null)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteReport(selectedReport._id)
      setSuccess('Xóa báo cáo thành công!')
      handleDeleteClose()
      loadReports()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Xóa thất bại')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'approved': return 'success'
      case 'rejected': return 'error'
      default: return 'default'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý'
      case 'approved': return 'Đã duyệt'
      case 'rejected': return 'Từ chối'
      default: return status
    }
  }

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporterEmail?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage)
  const indexOfLastReport = currentPage * reportsPerPage
  const indexOfFirstReport = indexOfLastReport - reportsPerPage
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport)

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <ReportIcon sx={{ fontSize: 48, color: '#f59e0b' }} />
              </motion.div>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#e2e8f0' }}>
                Quản lý Báo cáo
              </Typography>
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
                placeholder="Tìm kiếm URL, lý do, email..."
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
                    '&:hover fieldset': { borderColor: '#f59e0b' },
                    '&.Mui-focused fieldset': { borderColor: '#f59e0b' }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#f59e0b' }} />
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
                    '&:hover fieldset': { borderColor: '#f59e0b' },
                    '&.Mui-focused fieldset': { borderColor: '#f59e0b' }
                  }}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="pending">Chờ xử lý</MenuItem>
                  <MenuItem value="approved">Đã duyệt</MenuItem>
                  <MenuItem value="rejected">Từ chối</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </motion.div>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#f59e0b' }} />
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
                        <TableCell sx={{ color: '#f59e0b', fontWeight: 700 }}>URL</TableCell>
                        <TableCell sx={{ color: '#f59e0b', fontWeight: 700 }}>Người báo cáo</TableCell>
                        <TableCell sx={{ color: '#f59e0b', fontWeight: 700 }}>Lý do</TableCell>
                        <TableCell sx={{ color: '#f59e0b', fontWeight: 700 }}>Trạng thái</TableCell>
                        <TableCell sx={{ color: '#f59e0b', fontWeight: 700 }}>Ngày tạo</TableCell>
                        <TableCell sx={{ color: '#f59e0b', fontWeight: 700 }} align="center">Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentReports.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ color: '#94a3b8', py: 4 }}>
                            Không có báo cáo nào
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentReports.map((report, index) => (
                          <motion.tr
                            key={report._id}
                            component={TableRow}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            sx={{
                              '&:hover': { bgcolor: 'rgba(6, 182, 212, 0.05)' }
                            }}
                          >
                            <TableCell sx={{ color: '#e2e8f0', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              <a href={report.url} target="_blank" rel="noopener noreferrer" style={{ color: '#06b6d4' }}>
                                {report.url}
                              </a>
                            </TableCell>
                            <TableCell sx={{ color: '#e2e8f0' }}>
                              {report.reportedBy?.username || 'Người dùng ẩn danh'}
                              <br />
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                {report.reporterEmail}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ color: '#94a3b8', maxWidth: 250 }}>
                              {report.reason}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={getStatusText(report.status)}
                                color={getStatusColor(report.status)}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell sx={{ color: '#94a3b8' }}>
                              {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                onClick={() => handleEditOpen(report)}
                                sx={{ color: '#06b6d4', '&:hover': { bgcolor: 'rgba(6, 182, 212, 0.1)' } }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDeleteOpen(report)}
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
                          bgcolor: 'rgba(245, 158, 11, 0.1)',
                          borderColor: '#f59e0b'
                        },
                        '&.Mui-selected': {
                          bgcolor: '#f59e0b',
                          color: '#fff',
                          '&:hover': { bgcolor: '#d97706' }
                        }
                      }
                    }}
                  />
                </Box>
              )}
            </>
          )}

          {/* Edit Dialog */}
          <Dialog 
            open={editDialogOpen} 
            onClose={handleEditClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                bgcolor: '#1e293b',
                color: '#e2e8f0'
              }
            }}
          >
            <DialogTitle sx={{ bgcolor: '#0f172a', color: '#f59e0b', fontWeight: 700 }}>
              Cập nhật báo cáo
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ color: '#94a3b8' }}>Trạng thái</InputLabel>
                <Select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  label="Trạng thái"
                  sx={{
                    color: '#e2e8f0',
                    '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                    '&:hover fieldset': { borderColor: '#f59e0b' },
                    '&.Mui-focused fieldset': { borderColor: '#f59e0b' }
                  }}
                >
                  <MenuItem value="pending">Chờ xử lý</MenuItem>
                  <MenuItem value="approved">Đã duyệt</MenuItem>
                  <MenuItem value="rejected">Từ chối</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Ghi chú của Admin"
                multiline
                rows={4}
                value={editData.adminNote}
                onChange={(e) => setEditData({ ...editData, adminNote: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e2e8f0',
                    '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                    '&:hover fieldset': { borderColor: '#f59e0b' },
                    '&.Mui-focused fieldset': { borderColor: '#f59e0b' }
                  },
                  '& .MuiInputLabel-root': { color: '#94a3b8' }
                }}
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
                  bgcolor: '#f59e0b',
                  '&:hover': { bgcolor: '#d97706' }
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
                Bạn có chắc chắn muốn xóa báo cáo này không? Hành động này không thể hoàn tác.
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

export default ReportManagement

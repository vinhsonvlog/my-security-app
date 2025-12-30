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
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  MenuItem,
  Card,
  CardContent,
  Grid
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { getPendingReports, approveReport, rejectReport, getAllReports } from '../services/adminService'
import { getPendingPosts, approvePost, rejectPost } from '../services/postService'
import { getStatistics } from '../services/statsService'
import { isAdmin } from '../services/authService'
import { useNavigate, Link } from 'react-router-dom'
import { debugAuth } from '../services/debugAuth'
import VolunteerManagement from './VolunteerManagement'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ReportIcon from '@mui/icons-material/Report'
import EventIcon from '@mui/icons-material/Event'
import PeopleIcon from '@mui/icons-material/People'
import WarningIcon from '@mui/icons-material/Warning'
import AssessmentIcon from '@mui/icons-material/Assessment'
import ShieldIcon from '@mui/icons-material/Shield'
import PendingIcon from '@mui/icons-material/Pending'

const Dashboard = () => {
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [posts, setPosts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState('') // 'approve' or 'reject'
  const [adminNote, setAdminNote] = useState('')
  const [severity, setSeverity] = useState('medium')
  const [tabValue, setTabValue] = useState(0)
  const [mainTabValue, setMainTabValue] = useState(0) // 0: Reports, 1: Posts, 2: Volunteers

  useEffect(() => {
    console.log('🔍 Dashboard useEffect triggered');
    debugAuth(); // Debug authentication
    
    if (!isAdmin()) {
      console.log('❌ Not admin, redirecting to home');
      navigate('/')
      return
    }

    console.log('✅ User is admin, loading data');
    loadStats()
    if (mainTabValue === 0) {
      loadReports()
    } else if (mainTabValue === 1) {
      loadPosts()
    }
    // mainTabValue === 2 (Volunteers) will be handled by VolunteerManagement component
  }, [navigate, tabValue, mainTabValue])

  const loadStats = async () => {
    try {
      const result = await getStatistics()
      if (result.success) {
        setStats(result.data)
      }
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  const loadReports = async () => {
    setLoading(true)
    setError('')
    
    try {
      let result
      if (tabValue === 0) {
        result = await getPendingReports()
      } else if (tabValue === 1) {
        result = await getAllReports('approved')
      } else {
        result = await getAllReports('rejected')
      }
      
      setReports(result.data || [])
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách báo cáo')
    } finally {
      setLoading(false)
    }
  }

  const loadPosts = async () => {
    setLoading(true)
    setError('')
    
    try {
      const result = await getPendingPosts()
      setPosts(result.data || [])
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách bài viết')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (item, type, isPost = false) => {
    if (isPost) {
      setSelectedPost(item)
      setSelectedReport(null)
    } else {
      setSelectedReport(item)
      setSelectedPost(null)
    }
    setDialogType(type)
    setDialogOpen(true)
    setAdminNote('')
    setSeverity('medium')
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedReport(null)
    setSelectedPost(null)
    setAdminNote('')
  }

  const handleApprove = async () => {
    try {
      if (selectedPost) {
        await approvePost(selectedPost._id, adminNote)
        loadPosts()
      } else if (selectedReport) {
        await approveReport(selectedReport._id, {
          adminNote,
          severity
        })
        loadReports()
      }
      
      handleCloseDialog()
    } catch (err) {
      setError(err.message || 'Phê duyệt thất bại')
    }
  }

  const handleReject = async () => {
    try {
      if (selectedPost) {
        await rejectPost(selectedPost._id, adminNote)
        loadPosts()
      } else if (selectedReport) {
        await rejectReport(selectedReport._id, {
          adminNote
        })
        loadReports()
      }
      
      handleCloseDialog()
    } catch (err) {
      setError(err.message || 'Từ chối thất bại')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 8 }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 900,
            mb: 6,
            textAlign: 'center',
            background: 'linear-gradient(90deg, #06b6d4 0%, #10b981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          🛡️ Admin Dashboard
        </Typography>


        {/* Quick Links */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to="/admin/blacklist"
            variant="outlined"
            startIcon={<ShieldIcon />}
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: '#ef4444',
              borderColor: '#ef4444',
              '&:hover': {
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                borderColor: '#dc2626'
              }
            }}
          >
            Quản lý Blacklist
          </Button>

          <Button
            component={Link}
            to="/admin/statistics"
            variant="outlined"
            startIcon={<AssessmentIcon />}
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: '#8b5cf6',
              borderColor: '#8b5cf6',
              '&:hover': {
                bgcolor: 'rgba(139, 92, 246, 0.1)',
                borderColor: '#7c3aed'
              }
            }}
          >
            Thống kê Chi tiết
          </Button>

          <Button
            component={Link}
            to="/admin/newsfeed"
            variant="outlined"
            startIcon={<ReportIcon />}
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: '#10b981',
              borderColor: '#10b981',
              '&:hover': {
                bgcolor: 'rgba(16, 185, 129, 0.1)',
                borderColor: '#059669'
              }
            }}
          >
            Quản lý Newsfeed
          </Button>

          <Button
            component={Link}
            to="/admin/reports"
            variant="outlined"
            startIcon={<ReportIcon />}
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: '#f59e0b',
              borderColor: '#f59e0b',
              '&:hover': {
                bgcolor: 'rgba(245, 158, 11, 0.1)',
                borderColor: '#d97706'
              }
            }}
          >
            Quản lý Báo cáo
          </Button>
          
          <Button
            component={Link}
            to="/admin/events"
            variant="outlined"
            startIcon={<EventIcon />}
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: '#06b6d4',
              borderColor: '#06b6d4',
              '&:hover': {
                bgcolor: 'rgba(6, 182, 212, 0.1)',
                borderColor: '#0891b2'
              }
            }}
          >
            Quản lý Sự kiện
          </Button>

          <Button
            component={Link}
            to="/admin/community"
            variant="outlined"
            startIcon={<PeopleIcon />}
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: '#10b981',
              borderColor: '#10b981',
              '&:hover': {
                bgcolor: 'rgba(16, 185, 129, 0.1)',
                borderColor: '#059669'
              }
            }}
          >
            Quản lý Cộng đồng
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Main Tabs: Reports vs Posts */}
        <Box sx={{ borderBottom: 2, borderColor: '#475569', mb: 4 }}>
          <Tabs 
            value={mainTabValue} 
            onChange={(e, newValue) => setMainTabValue(newValue)}
            sx={{
              '& .MuiTab-root': { 
                color: '#94a3b8', 
                fontWeight: 700,
                fontSize: '1rem',
                px: 4,
                py: 2
              },
              '& .Mui-selected': { color: '#06b6d4' },
              '& .MuiTabs-indicator': { bgcolor: '#06b6d4', height: 3 }
            }}
          >
            <Tab label="📋 Báo cáo URL" />
            <Tab label="📝 Bài viết cộng đồng" />
            <Tab label="🤝 Tình nguyện viên" />
          </Tabs>
        </Box>

        {/* Reports Section */}
        {mainTabValue === 0 && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: '#475569', mb: 3 }}>
              <Tabs 
                value={tabValue} 
                onChange={(e, newValue) => setTabValue(newValue)}
                sx={{
                  '& .MuiTab-root': { color: '#94a3b8', fontWeight: 600 },
                  '& .Mui-selected': { color: '#06b6d4' },
                  '& .MuiTabs-indicator': { bgcolor: '#06b6d4' }
                }}
              >
                <Tab label="Chờ duyệt" />
                <Tab label="Đã duyệt" />
                <Tab label="Đã từ chối" />
              </Tabs>
            </Box>

            <Paper 
              elevation={24}
              sx={{ 
                bgcolor: '#1e293b',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              {loading ? (
                <Box sx={{ p: 8, textAlign: 'center' }}>
                  <CircularProgress sx={{ color: '#06b6d4' }} />
                </Box>
              ) : reports.length === 0 ? (
                <Box sx={{ p: 8, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#64748b' }}>
                    Không có báo cáo nào
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#0f172a' }}>
                        <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>URL</TableCell>
                        <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Người báo cáo</TableCell>
                        <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Lý do</TableCell>
                        <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Ngày tạo</TableCell>
                        <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Trạng thái</TableCell>
                        {tabValue === 0 && (
                          <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Hành động</TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reports.map((report) => (
                        <TableRow 
                          key={report._id}
                          sx={{ '&:hover': { bgcolor: 'rgba(6, 182, 212, 0.05)' } }}
                        >
                          <TableCell sx={{ color: '#06b6d4', maxWidth: 300, wordBreak: 'break-all' }}>
                            {report.url}
                          </TableCell>
                          <TableCell sx={{ color: '#e2e8f0' }}>
                            {report.reporterUserId?.username || report.reporterInfo?.name || 'Ẩn danh'}
                            <br />
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              {report.reporterInfo?.email || report.reporterUserId?.email || 'Người dùng ẩn danh'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color: '#e2e8f0', maxWidth: 200 }}>
                            {report.reason}
                          </TableCell>
                          <TableCell sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                            {formatDate(report.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={
                                report.status === 'pending' ? 'Chờ duyệt' :
                                report.status === 'approved' ? 'Đã duyệt' : 'Đã từ chối'
                              }
                              color={
                                report.status === 'pending' ? 'warning' :
                                report.status === 'approved' ? 'success' : 'error'
                              }
                              size="small"
                            />
                          </TableCell>
                          {tabValue === 0 && (
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  startIcon={<CheckCircleIcon />}
                                  onClick={() => handleOpenDialog(report, 'approve')}
                                  sx={{ fontSize: '0.75rem' }}
                                >
                                  Duyệt
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="error"
                                  startIcon={<CancelIcon />}
                                  onClick={() => handleOpenDialog(report, 'reject')}
                                  sx={{ fontSize: '0.75rem' }}
                                >
                                  Từ chối
                                </Button>
                              </Box>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </>
        )}

        {/* Posts Section */}
        {mainTabValue === 1 && (
          <Paper sx={{ bgcolor: '#1e293b', p: 3 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#06b6d4' }} />
              </Box>
            ) : posts.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#94a3b8', py: 4 }}>
                Không có bài viết nào đang chờ duyệt
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#06b6d4', fontWeight: 700 }}>Người đăng</TableCell>
                      <TableCell sx={{ color: '#06b6d4', fontWeight: 700 }}>Tiêu đề</TableCell>
                      <TableCell sx={{ color: '#06b6d4', fontWeight: 700 }}>Nội dung</TableCell>
                      <TableCell sx={{ color: '#06b6d4', fontWeight: 700 }}>Ngày tạo</TableCell>
                      <TableCell sx={{ color: '#06b6d4', fontWeight: 700 }}>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post._id} sx={{ '&:hover': { bgcolor: '#0f172a' } }}>
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
                        <TableCell sx={{ color: '#e2e8f0', maxWidth: 200 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {post.title}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8', maxWidth: 300 }}>
                          <Typography variant="body2" noWrap>
                            {post.content.substring(0, 100)}...
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8' }}>
                          {formatDate(post.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleOpenDialog(post, 'approve', true)}
                              sx={{ fontSize: '0.75rem' }}
                            >
                              Duyệt
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              startIcon={<CancelIcon />}
                              onClick={() => handleOpenDialog(post, 'reject', true)}
                              sx={{ fontSize: '0.75rem' }}
                            >
                              Từ chối
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}

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
          <DialogTitle>
            {selectedPost 
              ? (dialogType === 'approve' ? '✅ Phê duyệt bài viết' : '❌ Từ chối bài viết')
              : (dialogType === 'approve' ? '✅ Phê duyệt báo cáo' : '❌ Từ chối báo cáo')
            }
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              {selectedPost ? (
                <>
                  <Typography variant="body2" sx={{ mb: 1, color: '#94a3b8' }}>
                    <strong style={{ color: '#06b6d4' }}>Tiêu đề:</strong> {selectedPost?.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: '#94a3b8' }}>
                    <strong style={{ color: '#06b6d4' }}>Nội dung:</strong> {selectedPost?.content}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" sx={{ mb: 2, color: '#94a3b8' }}>
                  URL: <strong style={{ color: '#06b6d4' }}>{selectedReport?.url}</strong>
                </Typography>
              )}

              {dialogType === 'approve' && selectedReport && (
                <TextField
                  fullWidth
                  select
                  label="Mức độ nguy hiểm"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: '#e2e8f0',
                      '& fieldset': { borderColor: '#475569' }
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                >
                  <MenuItem value="low">Thấp</MenuItem>
                  <MenuItem value="medium">Trung bình</MenuItem>
                  <MenuItem value="high">Cao</MenuItem>
                  <MenuItem value="critical">Nghiêm trọng</MenuItem>
                </TextField>
              )}

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
                    '& fieldset': { borderColor: '#475569' }
                  },
                  '& .MuiInputLabel-root': { color: '#94a3b8' }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={handleCloseDialog} sx={{ color: '#94a3b8' }}>
              Hủy
            </Button>
            <Button 
              onClick={dialogType === 'approve' ? handleApprove : handleReject}
              variant="contained"
              color={dialogType === 'approve' ? 'success' : 'error'}
            >
              {dialogType === 'approve' ? 'Phê duyệt' : 'Từ chối'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Volunteers Section */}
        {mainTabValue === 2 && (
          <Box sx={{ mt: -8 }}>
            <VolunteerManagement />
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default Dashboard
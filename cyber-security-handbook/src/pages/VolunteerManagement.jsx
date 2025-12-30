import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  Pagination,
  InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import { getAllVolunteers, updateVolunteer, deleteVolunteer } from '../services/volunteerService';

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 10 });
  
  const [formData, setFormData] = useState({
    status: '',
    notes: ''
  });

  useEffect(() => {
    loadVolunteers();
  }, [currentPage, statusFilter, searchQuery]);

  const loadVolunteers = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10
      };
      if (statusFilter) params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      const result = await getAllVolunteers(params);
      setVolunteers(result.data || []);
      setPagination(result.pagination || { total: 0, pages: 1, limit: 10 });
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setFormData({
      status: volunteer.status,
      notes: volunteer.notes || ''
    });
    setDialogOpen(true);
  };

  const handleDeleteClick = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setDeleteDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedVolunteer) return;

    try {
      await updateVolunteer(selectedVolunteer._id, formData);
      setSuccess('Cập nhật thành công!');
      setDialogOpen(false);
      loadVolunteers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi cập nhật');
    }
  };

  const handleDelete = async () => {
    if (!selectedVolunteer) return;

    try {
      await deleteVolunteer(selectedVolunteer._id);
      setSuccess('Đã xóa tình nguyện viên!');
      setDeleteDialogOpen(false);
      loadVolunteers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi xóa');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
      case 'rejected':
        return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
      default:
        return { bg: 'rgba(234, 179, 8, 0.1)', color: '#eab308' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      default:
        return 'Chờ duyệt';
    }
  };

  const getSpecialtyText = (specialty) => {
    switch (specialty) {
      case 'tu-van':
        return 'Tư vấn tâm lý/cộng đồng';
      case 'ky-thuat':
        return 'Kỹ thuật/Xử lý sự cố';
      case 'content':
        return 'Sáng tạo nội dung';
      default:
        return specialty;
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 8 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
          <GroupIcon sx={{ fontSize: 48, color: '#10b981' }} />
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#e2e8f0' }}>
            Quản lý Tình nguyện viên
          </Typography>
        </Box>

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

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            select
            label="Lọc theo trạng thái"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            sx={{
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                bgcolor: '#1e293b',
                color: '#e2e8f0',
                '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                '&:hover fieldset': { borderColor: '#10b981' },
                '&.Mui-focused fieldset': { borderColor: '#10b981' }
              },
              '& .MuiInputLabel-root': { color: '#94a3b8' }
            }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="pending">Chờ duyệt</MenuItem>
            <MenuItem value="approved">Đã duyệt</MenuItem>
            <MenuItem value="rejected">Từ chối</MenuItem>
          </TextField>

          <TextField
            fullWidth
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#10b981' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#1e293b',
                color: '#e2e8f0',
                '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                '&:hover fieldset': { borderColor: '#10b981' },
                '&.Mui-focused fieldset': { borderColor: '#10b981' }
              }
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#10b981' }} />
          </Box>
        ) : volunteers.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#94a3b8' }}>
              Không có tình nguyện viên nào
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                bgcolor: '#1e293b',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#0f172a' }}>
                    <TableCell sx={{ color: '#10b981', fontWeight: 700 }}>Họ tên</TableCell>
                    <TableCell sx={{ color: '#10b981', fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ color: '#10b981', fontWeight: 700 }}>Số điện thoại</TableCell>
                    <TableCell sx={{ color: '#10b981', fontWeight: 700 }}>Chuyên môn</TableCell>
                    <TableCell sx={{ color: '#10b981', fontWeight: 700 }}>Trạng thái</TableCell>
                    <TableCell sx={{ color: '#10b981', fontWeight: 700 }}>Ngày đăng ký</TableCell>
                    <TableCell sx={{ color: '#10b981', fontWeight: 700 }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {volunteers.map((volunteer) => (
                    <TableRow
                      key={volunteer._id}
                      sx={{
                        '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.05)' }
                      }}
                    >
                      <TableCell sx={{ color: '#e2e8f0' }}>{volunteer.fullName}</TableCell>
                      <TableCell sx={{ color: '#94a3b8' }}>{volunteer.email}</TableCell>
                      <TableCell sx={{ color: '#94a3b8' }}>{volunteer.phone}</TableCell>
                      <TableCell sx={{ color: '#94a3b8' }}>
                        {getSpecialtyText(volunteer.specialty)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(volunteer.status)}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(volunteer.status).bg,
                            color: getStatusColor(volunteer.status).color,
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#94a3b8' }}>
                        {new Date(volunteer.createdAt).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEditClick(volunteer)}
                          sx={{ color: '#06b6d4', '&:hover': { bgcolor: 'rgba(6, 182, 212, 0.1)' } }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(volunteer)}
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

            {/* Pagination */}
            {pagination.pages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={pagination.pages}
                  page={currentPage}
                  onChange={handlePageChange}
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#94a3b8',
                      borderColor: 'rgba(148, 163, 184, 0.3)',
                      '&:hover': {
                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                        borderColor: '#10b981'
                      },
                      '&.Mui-selected': {
                        bgcolor: '#10b981',
                        color: '#fff',
                        '&:hover': {
                          bgcolor: '#059669'
                        }
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
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#1e293b',
              color: '#e2e8f0'
            }
          }}
        >
          <DialogTitle sx={{ bgcolor: '#0f172a', color: '#10b981', fontWeight: 700 }}>
            Cập nhật tình nguyện viên
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {selectedVolunteer && (
              <Box>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                  <strong>Họ tên:</strong> {selectedVolunteer.fullName}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                  <strong>Email:</strong> {selectedVolunteer.email}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                  <strong>Kinh nghiệm:</strong> {selectedVolunteer.experience || 'Không có'}
                </Typography>

                <TextField
                  select
                  fullWidth
                  label="Trạng thái"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: '#e2e8f0',
                      '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                      '&:hover fieldset': { borderColor: '#10b981' },
                      '&.Mui-focused fieldset': { borderColor: '#10b981' }
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                >
                  <MenuItem value="pending">Chờ duyệt</MenuItem>
                  <MenuItem value="approved">Đã duyệt</MenuItem>
                  <MenuItem value="rejected">Từ chối</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Ghi chú"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#e2e8f0',
                      '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
                      '&:hover fieldset': { borderColor: '#10b981' },
                      '&.Mui-focused fieldset': { borderColor: '#10b981' }
                    },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: '#0f172a' }}>
            <Button onClick={() => setDialogOpen(false)} sx={{ color: '#94a3b8' }}>
              Hủy
            </Button>
            <Button
              onClick={handleUpdate}
              variant="contained"
              sx={{
                bgcolor: '#10b981',
                '&:hover': { bgcolor: '#059669' }
              }}
            >
              Cập nhật
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
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
              Bạn có chắc chắn muốn xóa tình nguyện viên{' '}
              <strong>{selectedVolunteer?.fullName}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: '#0f172a' }}>
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
  );
};

export default VolunteerManagement;

import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Box,
  Alert,
  CircularProgress
} from "@mui/material";
import { createVolunteer } from "../services/volunteerService";

const Volunteer = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialty: "tu-van",
    experience: "",
    agree: true,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const validate = (fields = form) => {
    const next = {};
    if (!fields.fullName.trim()) next.fullName = "Vui lòng nhập họ và tên";
    if (!fields.email) next.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      next.email = "Email không hợp lệ";
    if (!fields.phone) next.phone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9()+\-\s]{7,20}$/.test(fields.phone))
      next.phone = "Số điện thoại không hợp lệ";
    if (!fields.agree) next.agree = "Bạn cần đồng ý với quy tắc bảo mật";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const v = type === "checkbox" ? checked : value;
    setForm((s) => ({ ...s, [name]: v }));
    if (errors[name]) {
      validate({ ...form, [name]: v });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const result = await createVolunteer({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        specialty: form.specialty,
        experience: form.experience
      });

      setSuccess(result.message || "Đăng ký thành công!");
      setForm({
        fullName: "",
        email: "",
        phone: "",
        specialty: "tu-van",
        experience: "",
        agree: true,
      });
      setErrors({});
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0f172a", py: 10 }}>
      <Container maxWidth="md">
        <Paper
          elevation={24}
          sx={{
            p: 6,
            bgcolor: "#1e293b",
            borderLeft: "6px solid #10b981",
            borderRadius: 2,
            border: "transparent",
            outline: "none",
            boxShadow: "0 12px 30px rgba(0,0,0,0.7)",
            backgroundClip: "padding-box",
            WebkitBackgroundClip: "padding-box",
            overflow: "visible",
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, mb: 2, color: "#e2e8f0" }}
          >
            🤝 Đăng Ký Tình Nguyện Viên
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#94a3b8", mb: 6, fontStyle: "italic" }}
          >
            Gia nhập đội ngũ phản ứng nhanh để hỗ trợ nạn nhân và lan tỏa tri
            thức an toàn mạng.
          </Typography>

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

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Họ và Tên"
                  variant="outlined"
                  required
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  InputProps={{ sx: { height: 48, borderRadius: 1 } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#e2e8f0",
                      "& fieldset": { borderColor: "#475569" },
                      "&:hover fieldset": { borderColor: "#10b981" },
                      "&.Mui-focused fieldset": { borderColor: "#10b981" },
                    },
                    "& .MuiInputLabel-root": { color: "#94a3b8" },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email"
                  type="email"
                  variant="outlined"
                  required
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{ sx: { height: 48, borderRadius: 1 } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#e2e8f0",
                      "& fieldset": { borderColor: "#475569" },
                      "&:hover fieldset": { borderColor: "#10b981" },
                      "&.Mui-focused fieldset": { borderColor: "#10b981" },
                    },
                    "& .MuiInputLabel-root": { color: "#94a3b8" },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Số điện thoại"
                  variant="outlined"
                  required
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  InputProps={{ sx: { height: 48, borderRadius: 1 } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#e2e8f0",
                      "& fieldset": { borderColor: "#475569" },
                      "&:hover fieldset": { borderColor: "#10b981" },
                      "&.Mui-focused fieldset": { borderColor: "#10b981" },
                    },
                    "& .MuiInputLabel-root": { color: "#94a3b8" },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  select
                  label="Chuyên môn chính"
                  variant="outlined"
                  name="specialty"
                  value={form.specialty}
                  onChange={handleChange}
                  InputProps={{ sx: { height: 48, borderRadius: 1 } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#e2e8f0",
                      "& fieldset": { borderColor: "#475569" },
                      "&:hover fieldset": { borderColor: "#10b981" },
                    },
                    "& .MuiInputLabel-root": { color: "#94a3b8" },
                  }}
                >
                  <MenuItem value="tu-van">Tư vấn tâm lý/cộng đồng</MenuItem>
                  <MenuItem value="ky-thuat">Kỹ thuật/Xử lý sự cố</MenuItem>
                  <MenuItem value="content">Sáng tạo nội dung</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                  label="Kinh nghiệm/Kỹ năng liên quan"
                  placeholder="VD: Đã tham gia các dự án bảo mật, có chứng chỉ CEH..."
                  variant="outlined"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: !!form.experience }}
                  InputProps={{ sx: { minHeight: 96, borderRadius: 1 } }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#e2e8f0",
                      "& fieldset": { borderColor: "#475569" },
                      "&:hover fieldset": { borderColor: "#10b981" },
                      "&.Mui-focused fieldset": { borderColor: "#10b981" },
                    },
                    "& .MuiInputLabel-root": { color: "#94a3b8" },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.agree}
                        name="agree"
                        onChange={handleChange}
                        sx={{ color: "#10b981" }}
                      />
                    }
                    label={
                      <Typography sx={{ color: "#94a3b8" }}>
                        Tôi cam kết tuân thủ quy tắc bảo mật thông tin nạn nhân.
                      </Typography>
                    }
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={
                      !form.fullName ||
                      !form.email ||
                      !form.phone ||
                      !form.agree ||
                      submitting
                    }
                    sx={{
                      bgcolor: "#10b981",
                      minWidth: 220,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: "1rem",
                      "&:hover": { bgcolor: "#059669" },
                    }}
                  >
                    {submitting ? (
                      <CircularProgress size={24} sx={{ color: '#fff' }} />
                    ) : (
                      "GỬI ĐƠN ĐĂNG KÝ"
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Volunteer;

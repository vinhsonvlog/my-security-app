import { Container, Grid, Paper, Typography, Button, Box, Divider } from '@mui/material'
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'

const Donation = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 10 }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, color: '#e2e8f0' }}>
              Đồng hành cùng <span style={{ color: '#10b981' }}>Sotayantoan</span>
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4, lineHeight: 1.8 }}>
              Sứ mệnh của chúng tôi là tạo ra một cộng đồng mạng an toàn cho mọi người.
              Mọi sự đóng góp của bạn đều giúp chúng tôi nâng cấp hệ thống quét AI
              và tổ chức thêm các buổi workshop miễn phí cho người yếu thế.
            </Typography>
            <Divider sx={{ mb: 4, borderColor: '#475569' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#e2e8f0' }}>
                💎 Tại sao nên ủng hộ?
              </Typography>
              {[
                'Duy trì hệ thống quét URL thời gian thực.',
                'Phát triển trợ lý ảo AI giải đáp sự cố 24/7.',
                'Tài trợ các chiến dịch tuyên truyền tại địa phương.'
              ].map((item, i) => (
                <Typography key={i} variant="body2" sx={{ color: '#94a3b8' }}>
                  ✓ {item}
                </Typography>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              elevation={24}
              sx={{ 
                p: 5,
                bgcolor: '#1e293b',
                textAlign: 'center',
                border: '2px dashed #475569',
                borderRadius: 3
              }}
            >
              <VolunteerActivismIcon sx={{ fontSize: 72, color: '#ef4444', mb: 3 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, color: '#e2e8f0' }}>
                Ủng hộ qua QR Code
              </Typography>

              <Box 
                sx={{ 
                  bgcolor: '#0f172a',
                  width: 240,
                  height: 240,
                  mx: 'auto',
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #475569',
                  borderRadius: 2
                }}
              >
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  QR Ngân hàng / Momo
                </Typography>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700, color: '#e2e8f0' }}>
                STK: 1234 5678 9999
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>
                MB Bank - Chủ TK: SỔ TAY AN TOÀN
              </Typography>

              <Button 
                variant="contained" 
                fullWidth 
                size="large"
                sx={{
                  bgcolor: '#10b981',
                  py: 1.5,
                  fontWeight: 700,
                  borderRadius: 3,
                  '&:hover': { bgcolor: '#059669' }
                }}
              >
                XÁC NHẬN ĐÃ QUYÊN GÓP
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Donation
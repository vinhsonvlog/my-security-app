import { Typography, Box, Container } from '@mui/material'

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'linear-gradient(180deg, #071029 0%, #0f172a 100%)',
        backgroundColor: '#071029',
        color: '#94a3b8',
        py: 6,
        mt: 'auto',
        borderTop: '1px solid rgba(6,182,212,0.08)'
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: 'center', px: 2 }}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#cbd5e1' }}>
          © {new Date().getFullYear()} Sotayantoan - Cyber Security Platform
        </Typography>
        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
          Nhóm 20
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer
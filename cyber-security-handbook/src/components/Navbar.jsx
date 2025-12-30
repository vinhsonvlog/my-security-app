import { useState } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material'
import SecurityIcon from '@mui/icons-material/Security'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import SupportIcon from '@mui/icons-material/Support'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import FavoriteIcon from '@mui/icons-material/Favorite'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import { Link as RouterLink } from 'react-router-dom'
import Sidebar from './Sidebar'

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          borderBottom: '1px solid rgba(6, 182, 212, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Toolbar sx={{ py: 1.5 }}>
          {/* Sidebar Toggle */}
          <IconButton
            onClick={() => setSidebarOpen(true)}
            sx={{ 
              mr: 2,
              color: '#06b6d4',
              '&:hover': {
                bgcolor: 'rgba(6, 182, 212, 0.1)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          <SecurityIcon sx={{ mr: 1.5, fontSize: 32, color: '#06b6d4' }} />
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 800,
              background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Sotayantoan</RouterLink>
          </Typography>

          {/* Main Navigation */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {[
                { to: '/', label: 'Quét URL', icon: <SearchIcon /> },
                { to: '/newsfeed', label: 'Newsfeed', icon: <NewspaperIcon /> },
                { to: '/request', label: 'Hỗ trợ', icon: <SupportIcon /> },
                { to: '/tracking', label: 'Tra cứu', icon: <TrackChangesIcon /> }
              ].map(item => (
                <Button 
                  key={item.to}
                  component={RouterLink} 
                  to={item.to}
                  startIcon={item.icon}
                  sx={{ 
                    color: 'rgba(226, 232, 240, 0.9)',
                    fontWeight: 600,
                    px: 2,
                    borderRadius: 2,
                    '&:hover': { 
                      bgcolor: 'rgba(6, 182, 212, 0.1)',
                      color: '#06b6d4',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
            
            <Button 
              component={RouterLink} 
              to="/donation"
              startIcon={<FavoriteIcon />}
              sx={{ 
                color: '#fbbf24',
                fontWeight: 700,
                borderRadius: 2,
                px: { xs: 1.5, md: 2 },
                fontSize: { xs: '0.85rem', md: '0.95rem' },
                '&:hover': { 
                  bgcolor: 'rgba(251, 191, 36, 0.1)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s'
              }}
            >
              Quyên góp
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Component */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}

export default Navbar

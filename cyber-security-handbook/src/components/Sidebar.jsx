import { useState } from 'react'
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Box, IconButton, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import QuizIcon from '@mui/icons-material/Quiz'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import EventIcon from '@mui/icons-material/Event'
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import { isAuthenticated, isAdmin, logout, getCurrentUser } from '../services/authService'

const Sidebar = ({ open, onClose, variant = 'temporary' }) => {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const loggedIn = isAuthenticated()
  const admin = isAdmin()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/')
  }

  const publicMenuItems = [
    { text: 'AI Quiz', icon: <QuizIcon />, path: '/quiz' },
    { text: 'Cộng đồng', icon: <NotificationsActiveIcon />, path: '/community' },
    { text: 'Sự kiện', icon: <EventIcon />, path: '/projects' },
    { text: 'Tình nguyện viên', icon: <VolunteerActivismIcon />, path: '/volunteer' }
  ]

  const drawerWidth = collapsed ? 80 : 280

  return (
    <Drawer
      variant={variant}
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: drawerWidth,
          bgcolor: '#1e293b',
          color: '#e2e8f0',
          borderRight: '1px solid #475569',
          transition: 'width 0.3s ease'
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid #475569'
        }}>
          {!collapsed && (
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Menu
            </Typography>
          )}
          <IconButton 
            onClick={() => setCollapsed(!collapsed)}
            sx={{ color: '#06b6d4' }}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>

        {/* User Info (if logged in) */}
        {loggedIn && user && !collapsed && (
          <Box sx={{ 
            p: 2, 
            bgcolor: '#0f172a',
            borderBottom: '1px solid #475569'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon sx={{ color: '#06b6d4' }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0' }}>
                  {user.username}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {user.email}
                </Typography>
              </Box>
            </Box>
            {admin && (
              <Typography variant="caption" sx={{ 
                display: 'block',
                mt: 1,
                px: 1,
                py: 0.5,
                bgcolor: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                borderRadius: 1,
                textAlign: 'center',
                fontWeight: 600
              }}>
                ADMIN
              </Typography>
            )}
          </Box>
        )}

        {/* Menu Items */}
        <List sx={{ flex: 1, py: 2 }}>
          {/* Public Menu */}
          {publicMenuItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={onClose}
                sx={{
                  py: 1.5,
                  px: collapsed ? 2 : 3,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  '&:hover': {
                    bgcolor: 'rgba(6, 182, 212, 0.1)',
                    borderLeft: '3px solid #06b6d4'
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: '#06b6d4', 
                  minWidth: collapsed ? 'auto' : 40 
                }}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: 500
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}

          {/* Admin Dashboard */}
          {admin && (
            <>
              <Divider sx={{ my: 2, borderColor: '#475569' }} />
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/dashboard"
                  onClick={onClose}
                  sx={{
                    py: 1.5,
                    px: collapsed ? 2 : 3,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(16, 185, 129, 0.2)',
                      borderLeft: '3px solid #10b981'
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: '#10b981', 
                    minWidth: collapsed ? 'auto' : 40 
                  }}>
                    <DashboardIcon />
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText 
                      primary="Dashboard"
                      primaryTypographyProps={{
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: '#10b981'
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>

        {/* Auth Actions */}
        <Divider sx={{ borderColor: '#475569' }} />
        <Box sx={{ p: 2 }}>
          {loggedIn ? (
            <ListItemButton
              onClick={handleLogout}
              sx={{
                py: 1.5,
                px: collapsed ? 2 : 3,
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 2,
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(239, 68, 68, 0.2)'
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: '#ef4444', 
                minWidth: collapsed ? 'auto' : 40 
              }}>
                <LogoutIcon />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText 
                  primary="Đăng xuất"
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#ef4444'
                  }}
                />
              )}
            </ListItemButton>
          ) : (
            <ListItemButton
              component={Link}
              to="/login"
              onClick={onClose}
              sx={{
                py: 1.5,
                px: collapsed ? 2 : 3,
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 2,
                bgcolor: 'rgba(6, 182, 212, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(6, 182, 212, 0.2)'
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: '#06b6d4', 
                minWidth: collapsed ? 'auto' : 40 
              }}>
                <LoginIcon />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText 
                  primary="Đăng nhập"
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#06b6d4'
                  }}
                />
              )}
            </ListItemButton>
          )}
        </Box>
      </Box>
    </Drawer>
  )
}

export default Sidebar

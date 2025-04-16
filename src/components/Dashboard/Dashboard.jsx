import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Divider,
  TextField,
  InputAdornment,
  Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HotelIcon from '@mui/icons-material/Hotel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';

import ListeReservations from '../ListeReservation';
import ListeHotels from '../ListeHotels';
import OffresListes from '../Offres/OffresListes';
import AvisList from '../Avis/AvisList';
import UserList from '../User/UserList';


const drawerWidth = 240;

const Dashboard = () => {
  const [selectedView, setSelectedView] = useState('accueil');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(5);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user')) || { name: 'Nom de l\'utilisateur' };
    setUserName(userData.name);
  }, []);

  const handleDrawerToggle = () => {
    if (window.innerWidth < 900) {
      setMobileOpen(!mobileOpen);
    } else {
      setDrawerOpen(!drawerOpen);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const renderContent = () => {
    switch (selectedView) {
      case 'hotels':
        return <ListeHotels searchQuery={searchQuery} />;
      case 'reservations':
        return <ListeReservations searchQuery={searchQuery} />;
      case 'offres':
        return <OffresListes searchQuery={searchQuery} />;
      case 'avis':
        return <AvisList searchQuery={searchQuery} />;
        case 'users':
        return <UserList searchQuery={searchQuery} />;

      default:
        return (
          <>
            <Typography variant="h4" gutterBottom>
              Bienvenue sur le tableau de bord 👋
            </Typography>
            <Typography variant="body1">
              Veuillez choisir une section à gauche pour commencer.
            </Typography>
          </>
        );
    }
  };

  const menuItems = [
    { key: 'accueil', icon: <DashboardIcon />, label: 'Accueil' },
    { key: 'hotels', icon: <HotelIcon />, label: 'Liste des Hôtels' },
    { key: 'reservations', icon: <AssignmentIcon />, label: 'Liste des Réservations' },
    { key: 'offres', icon: <AssignmentIcon />, label: 'Liste des Offres' },
    { key: 'avis', icon: <RateReviewIcon />, label: 'Liste des Avis' },
    { key: 'users', icon: <AccountCircleIcon />, label: 'Liste des Utilisateurs' },
    { key: 'home', icon: <DashboardIcon />, label: 'Retour à l\'Accueil', route: '/' },
  
  ];

  const drawerContent = (
    <div>
      <Toolbar>
        {drawerOpen && (
          <Typography variant="h6" noWrap sx={{ ml: 1 }}>
            Travelo Admin
          </Typography>
        )}
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.key}
            onClick={() => {
              if (item.route) {
                navigate(item.route);
              } else {
                setSelectedView(item.key);
              }
              setMobileOpen(false);
            }}
            
            sx={{
              backgroundColor: selectedView === item.key ? 'primary.main' : 'transparent',
              color: selectedView === item.key ? '#fff' : 'inherit',
              '&:hover': {
                backgroundColor: selectedView === item.key ? 'primary.dark' : '#e0e0e0',
              },
              px: drawerOpen ? 2 : 1,
            }}
          >
            <ListItemIcon sx={{ color: selectedView === item.key ? '#fff' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            {drawerOpen && <ListItemText primary={item.label} />}
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout} sx={{ px: drawerOpen ? 2 : 1 }}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          {drawerOpen && <ListItemText primary="Déconnexion" />}
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  <Toolbar>
    <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
      <MenuIcon />
    </IconButton>

    {/* Logo Travelo */}
    <Box component="img"
      src="src/assets/travelopng1.png"
      alt="Travelo Logo"
      sx={{ height: 40, mr: 1 }}
    />

    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
    
    </Typography>

    <TextField
      size="small"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Rechercher..."
      sx={{
        backgroundColor: 'white',
        borderRadius: 1,
        marginRight: 2,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />

    <IconButton color="inherit">
      <Badge badgeContent={notifications} color="error">
        <NotificationsIcon />
      </Badge>
    </IconButton>

    <IconButton color="inherit">
      <AccountCircleIcon />
    </IconButton>
    
    <Typography variant="body1" sx={{ marginRight: 2 }}>
      {userName}
    </Typography>
  </Toolbar>
</AppBar>


      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerOpen ? drawerWidth : 60,
            transition: 'width 0.3s',
            overflowX: 'hidden',
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <Box sx={{ width: drawerOpen ? 'auto' : 60 }}>{drawerContent}</Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: 'all 0.3s ease',
          ml: { xs: 0, md: drawerOpen ? `${drawerWidth}px` : '60px' },
        }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;

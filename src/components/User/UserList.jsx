// src/components/UserList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      showSnackbar("Erreur lors du chargement des utilisateurs", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showSnackbar("Utilisateur supprimé avec succès", "success");
        fetchUsers();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        showSnackbar("Erreur lors de la suppression", "error");
      }
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setNewRole(user.role); // rôle actuel
    setOpenDialog(true);
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/api/users/${userId}/role`, {
        role: newRole
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      showSnackbar("Rôle mis à jour avec succès", "success");
      setOpenDialog(false);
      fetchUsers();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error.response?.data || error);
      showSnackbar("Erreur lors de la mise à jour du rôle", "error");
    }
  };
  
  

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(users.filter(u =>
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query)
    ));
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Liste des utilisateurs</Typography>
      </Box>

      <TextField
        label="Rechercher un utilisateur"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nom</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Téléphone</strong></TableCell>
              <TableCell><strong>Statut</strong></TableCell>
              <TableCell><strong>Rôle</strong></TableCell>
              <TableCell><strong>Actif</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.length > 0 ? paginatedUsers.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.name || u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.telephone}</TableCell>
                <TableCell>{u.statut}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{u.isActive ? "Oui" : "Non"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(u)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(u.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Aucun utilisateur trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Utilisateurs par page"
        />
      </TableContainer>

      {/* Dialog Modification Rôle */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Modifier le rôle de l'utilisateur</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Rôle</InputLabel>
            <Select
              value={newRole}
              label="Rôle"
              onChange={(e) => setNewRole(e.target.value)}
            >
              <MenuItem value="user">Utilisateur</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              {/* Ajoute d'autres rôles si nécessaire */}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button
  variant="contained"
  onClick={() => handleUpdateRole(selectedUser.id, newRole)}
>
  Enregistrer
</Button>

        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserList;

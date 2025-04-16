import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  CircularProgress,
  Box,
  IconButton,
  Button,
  TextField,
  TablePagination,
  Snackbar,
  Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import HotelDialog from './HotelDialog';

const ListeHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = () => {
    setLoading(true);
    axios.get('http://localhost:8000/api/hotels')
      .then((response) => {
        setHotels(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des hôtels:', error);
        showSnackbar("Erreur de chargement des hôtels", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAdd = () => {
    setSelectedHotel(null);
    setDialogOpen(true);
  };

  const handleEdit = (hotel) => {
    setSelectedHotel(hotel);
    setDialogOpen(true);
  };

  const handleDelete = (hotelId) => {
    if (window.confirm("Confirmer la suppression de l'hôtel ?")) {
      axios.delete(`http://localhost:8000/api/hotels/${hotelId}`)
        .then(() => {
          showSnackbar("Hôtel supprimé avec succès", "success");
          fetchHotels();
        })
        .catch((err) => {
          console.error(err);
          showSnackbar("Erreur lors de la suppression", "error");
        });
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    fetchHotels();
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredHotels = hotels.filter((hotel) =>
    hotel.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedHotels = filteredHotels.slice(
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
        <Typography variant="h5">Liste des Hôtels</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Ajouter
        </Button>
      </Box>

      <Box mb={2}>
        <TextField
          label="Rechercher un hôtel"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nom</strong></TableCell>
              <TableCell><strong>Adresse</strong></TableCell>
              <TableCell><strong>Étoiles</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Image</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedHotels.length > 0 ? paginatedHotels.map((hotel) => (
              <TableRow key={hotel.id}>
                <TableCell>{hotel.nom}</TableCell>
                <TableCell>{hotel.adresse}</TableCell>
                <TableCell>{hotel.nbEtoiles}</TableCell>
                <TableCell>{hotel.description}</TableCell>
                <TableCell>
                  <img
                    src={hotel.urlImage}
                    alt={hotel.nom}
                    style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(hotel)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(hotel.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Aucun hôtel trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredHotels.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Hôtels par page"
        />
      </TableContainer>

      <HotelDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        hotel={selectedHotel}
      />

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

export default ListeHotels;

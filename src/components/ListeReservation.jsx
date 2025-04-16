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
  TablePagination,
  TextField,
  Button,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';


const ListeReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/reservations')
      .then((response) => {
        setReservations(response.data);
        setFilteredReservations(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des réservations:', error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = reservations.filter((res) =>
      res.user?.name?.toLowerCase().includes(value) ||
      res.offre?.nom?.toLowerCase().includes(value)
    );
    setFilteredReservations(filtered);
    setPage(0); // reset page
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const updateEtatReservation = async (id, newEtat) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/reservations/admin/${id}`, {
        etatReservation: newEtat,
      });

      // Mise à jour locale après modification
      const updated = reservations.map((res) =>
        res.id === id ? { ...res, etatReservation: newEtat } : res
      );
      setReservations(updated);
      setFilteredReservations(updated);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réservation:', error);
      alert("Échec de la mise à jour.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Liste des Réservations
      </Typography>

      {/* Zone de recherche */}
      <Box mb={2}>
        <TextField
          label="Rechercher par client ou offre"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Client</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Nombre De Jour</strong></TableCell>
              <TableCell><strong>Prix Total</strong></TableCell>
              <TableCell><strong>Offre</strong></TableCell>
              <TableCell><strong>État</strong></TableCell>
              <TableCell><strong>Avis</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReservations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((res) => (
                <TableRow key={res.id}>
                  <TableCell>{res.user?.name || 'Inconnu'}</TableCell>
                  <TableCell>{res.date}</TableCell>
                  <TableCell>{res.nbr_jour}</TableCell>
                  <TableCell>{res.prix_totale}</TableCell>
                  <TableCell>{res.offre?.nom || 'Non spécifiée'}</TableCell>
                  <TableCell>{res.etatReservation}</TableCell>
                  <TableCell>{res.avis?.contenu || 'Aucun avis'}</TableCell>
                  <TableCell>
  <Button
    variant="contained"
    color="success"
    size="small"
    startIcon={<i className="fas fa-check" />} // ou utilise @mui/icons-material
    onClick={() => updateEtatReservation(res.id, 'accepte')}
    disabled={res.etatReservation === 'accepte'}
    sx={{
      mr: 1,
      borderRadius: 2,
      textTransform: 'none',
      fontWeight: 'bold',
      boxShadow: 1,
      '&:hover': {
        backgroundColor: '#388e3c',
      },
    }}
  >
    Accepter
  </Button>
  <Button
    variant="contained"
    color="error"
    size="small"
    startIcon={<i className="fas fa-times" />}
    onClick={() => updateEtatReservation(res.id, 'refuse')}
    disabled={res.etatReservation === 'refuse'}
    sx={{
      borderRadius: 2,
      textTransform: 'none',
      fontWeight: 'bold',
      boxShadow: 1,
      '&:hover': {
        backgroundColor: '#d32f2f',
      },
    }}
  >
    Refuser
  </Button>
</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredReservations.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page"
        />
      </TableContainer>
    </Box>
  );
};

export default ListeReservations;

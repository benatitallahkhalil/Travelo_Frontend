import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Dialog, DialogTitle, DialogActions, Button,
  TableContainer, Paper, TablePagination, TextField, Typography, Box
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import OffresForm from './OffresForm';

const OffresListes = () => {
  const [offres, setOffres] = useState([]);
  const [filteredOffres, setFilteredOffres] = useState([]);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchOffres = () => {
    axios.get('http://localhost:8000/api/offres')
      .then(res => {
        setOffres(res.data);
        setFilteredOffres(res.data);
        console.log(res.data);
      
      })
      .catch(err => console.error(err));
  };
  

  useEffect(() => {
    fetchOffres();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = offres.filter((offre) =>
      offre.description.toLowerCase().includes(value) ||
      offre.prix.toString().includes(value)
    );
    setFilteredOffres(filtered);
    setPage(0); // reset page
  };

  const handleAdd = () => {
    setSelectedOffre(null);
    setDialogOpen(true);
  };

  const handleEdit = (offre) => {
    setSelectedOffre(offre);
    setDialogOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:8000/api/offres/${confirmDeleteId}`)
      .then(() => {
        fetchOffres();
        setConfirmDeleteId(null);
      })
      .catch(err => console.error(err));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Liste des Offres
      </Typography>

      {/* Zone de recherche */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Rechercher une offre (description ou prix)"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />

      {/* Bouton Ajouter */}
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={handleAdd}
        sx={{ mb: 2 }}
      >
        Ajouter Offre
      </Button>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Prix</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Hotel ID</TableCell>
              <TableCell>Type de chambre</TableCell>
              <TableCell>Nombre de personnes</TableCell>
              <TableCell>Date de début</TableCell>
              <TableCell>Date de fin</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOffres
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((offre) => (
                <TableRow key={offre.id}>
                  <TableCell>{offre.prix} €</TableCell>
                  <TableCell>{offre.description}</TableCell>
                  <TableCell>
                    <img src={offre.urlImage} alt="offre" width={60} />
                  </TableCell>
                  <TableCell>{offre.hotelId}</TableCell>
                  <TableCell>{offre.type_chambre}</TableCell>
                  <TableCell>{offre.nombre_personne}</TableCell>
                  <TableCell>{offre.date_debut}</TableCell>
                  <TableCell>{offre.date_fin}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(offre)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(offre.id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredOffres.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page"
        />
      </TableContainer>

      {/* Dialog ajouter/modifier */}
      <OffresForm
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          fetchOffres();
        }}
        offre={selectedOffre}
      />

      {/* Dialog confirmation suppression */}
      <Dialog open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle>Confirmer la suppression ?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Annuler</Button>
          <Button color="error" onClick={confirmDelete}>Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OffresListes;

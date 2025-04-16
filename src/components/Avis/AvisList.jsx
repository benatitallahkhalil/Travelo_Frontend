import React, { useEffect, useState } from 'react';
import {
  Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Typography, TablePagination, TextField
} from '@mui/material';
import axios from 'axios';

const AvisList = () => {
  const [avisList, setAvisList] = useState([]);
  const [filteredAvis, setFilteredAvis] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    axios.get('http://localhost:8000/api/avis')
      .then(res => {
        setAvisList(res.data);
        setFilteredAvis(res.data);
      })
      .catch(err => console.error('Erreur lors du chargement des avis :', err));
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = avisList.filter(avis =>
      avis.commentaire?.toLowerCase().includes(term) ||
      avis.note?.toString().includes(term) ||
      avis.reservation?.id?.toString().includes(term)
    );
    setFilteredAvis(filtered);
    setPage(0); // reset to first page
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Liste des Avis Clients
      </Typography>

      <TextField
        label="Rechercher un avis..."
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '16px' }}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Commentaire</TableCell>
            <TableCell>Note</TableCell>
            <TableCell>Réservation</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAvis
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((avis) => (
              <TableRow key={avis.id}>
                <TableCell>{avis.id}</TableCell>
                <TableCell>{avis.commentaire}</TableCell>
                <TableCell>{avis.note}</TableCell>
                <TableCell>{avis.reservation?.id || 'Non spécifié'}</TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={filteredAvis.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
};

export default AvisList;

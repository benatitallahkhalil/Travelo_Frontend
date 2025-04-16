import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import axios from 'axios';

const HotelDialog = ({ open, onClose, hotel }) => {
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    description: '',
    urlImage: '',
    nbEtoiles: '',
  });

  useEffect(() => {
    if (hotel) {
      setFormData(hotel);
    } else {
      setFormData({
        nom: '',
        adresse: '',
        description: '',
        urlImage: '',
        nbEtoiles: '',
      });
    }
  }, [hotel]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const request = hotel
      ? axios.put(`http://localhost:8000/api/hotels/${hotel.id}`, formData)
      : axios.post('http://localhost:8000/api/hotels', formData);

    request
      .then(() => onClose())
      .catch((err) => console.error('Erreur lors de l’enregistrement :', err));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{hotel ? "Modifier l'Hôtel" : 'Ajouter un Hôtel'}</DialogTitle>
      <DialogContent>
        <TextField
          name="nom"
          label="Nom"
          fullWidth
          margin="dense"
          value={formData.nom}
          onChange={handleChange}
        />
        <TextField
          name="adresse"
          label="Adresse"
          fullWidth
          margin="dense"
          value={formData.adresse}
          onChange={handleChange}
        />
        <TextField
          name="description"
          label="Description"
          fullWidth
          margin="dense"
          value={formData.description}
          onChange={handleChange}
        />
        <TextField
          name="urlImage"
          label="URL de l’image"
          fullWidth
          margin="dense"
          value={formData.urlImage}
          onChange={handleChange}
        />
        <TextField
          name="nbEtoiles"
          label="Nombre d’étoiles"
          type="number"
          fullWidth
          margin="dense"
          value={formData.nbEtoiles}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {hotel ? 'Modifier' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HotelDialog;

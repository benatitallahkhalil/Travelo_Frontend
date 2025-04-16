import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import axios from 'axios';

const OffresForm = ({ open, onClose, offre }) => {
  const [formData, setFormData] = useState({
    prix: '',
    description: '',
    urlImage: '',
    hotelId: '',
    type_chambre: '',
    nombre_personne: '',
    date_debut: '',
    date_fin: ''
  });

  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    // Charger les hôtels depuis l'API
    axios.get('http://localhost:8000/api/hotels')
      .then(res => setHotels(res.data))
      .catch(err => console.error("Erreur lors du chargement des hôtels :", err));
  }, []);

  useEffect(() => {
    if (offre) {
      setFormData({
        ...offre,
        date_debut: offre.date_debut ? offre.date_debut.slice(0, 10) : '',
        date_fin: offre.date_fin ? offre.date_fin.slice(0, 10) : ''
      });
    } else {
      setFormData({
        prix: '',
        description: '',
        urlImage: '',
        hotelId: '',
        type_chambre: '',
        nombre_personnes: '',
        date_debut: '',
        date_fin: ''
      });
    }
  }, [offre]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    const request = offre
      ? axios.put(`http://localhost:8000/api/offres/${offre.id}`, formData)
      : axios.post('http://localhost:8000/api/offres', formData);

    request
      .then(() => onClose())
      .catch(err => {
        if (err.response?.status === 422) {
          console.error('Erreurs de validation :', err.response.data.errors);
        } else {
          console.error('Erreur lors de l’enregistrement :', err);
        }
      });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{offre ? 'Modifier Offre' : 'Ajouter Offre'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Prix"
          name="prix"
          fullWidth
          type="number"
          margin="dense"
          value={formData.prix}
          onChange={handleChange}
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="dense"
          value={formData.description}
          onChange={handleChange}
        />
        <TextField
          label="URL de l’image"
          name="urlImage"
          fullWidth
          margin="dense"
          value={formData.urlImage}
          onChange={handleChange}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel id="hotelId-label">Hôtel</InputLabel>
          <Select
            labelId="hotelId-label"
            name="hotelId"
            value={formData.hotelId}
            onChange={handleChange}
            label="Hôtel"
          >
            {hotels.map(hotel => (
              <MenuItem key={hotel.id} value={hotel.id}>
                {hotel.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Type de chambre"
          name="type_chambre"
          fullWidth
          margin="dense"
          value={formData.type_chambre}
          onChange={handleChange}
        />
        <TextField
          label="Nombre de personnes"
          name="nombre_personne"
          fullWidth
          type="number"
          margin="dense"
          value={formData.nombre_personne}
          onChange={handleChange}
        />
        <TextField
          label="Date de début"
          name="date_debut"
          type="date"
          fullWidth
          margin="dense"
          value={formData.date_debut}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Date de fin"
          name="date_fin"
          type="date"
          fullWidth
          margin="dense"
          value={formData.date_fin}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {offre ? 'Modifier' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OffresForm;

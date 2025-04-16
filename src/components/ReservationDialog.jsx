import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

const ReservationDialog = ({ open, onClose, offer }) => {
  const [dateDebut, setDateDebut] = useState(dayjs().format('YYYY-MM-DD'));
  const [nbJours, setNbJours] = useState(1);
  const [userId, setUserId] = useState(null);
  const [prixTotal, setPrixTotal] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    if (offer && offer.prix && nbJours) {
      const total = offer.prix * nbJours;
      setPrixTotal(total);
    }
  }, [offer, nbJours]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = dayjs().format('YYYY-MM-DD');

    try {
      await axios.post('http://localhost:8000/api/reservations', {
        date: today,
        date_debut: dateDebut,
        nbr_jour: parseInt(nbJours),
        user_id: userId,
        offre_id: offer.id,
      });

      alert('Réservation effectuée avec succès !');
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la réservation.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', color: '#1976d2' }}>
        Réserver l’offre #{offer?.id}
      </DialogTitle>

      <DialogContent>
        {/* Résumé de l'offre */}
        <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            {offer?.titre || 'Offre sans titre'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Prix unitaire : <strong>{offer?.prix} €</strong>
          </Typography>
        </Paper>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Date de début"
              type="date"
              fullWidth
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Nombre de jours"
              type="number"
              fullWidth
              value={nbJours}
              onChange={(e) => setNbJours(e.target.value)}
              inputProps={{ min: 1 }}
            />

            <Divider />

            <TextField
              label="Prix total (€)"
              fullWidth
              value={prixTotal}
              InputProps={{ readOnly: true }}
              sx={{ fontWeight: 'bold', backgroundColor: '#e3f2fd' }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '16px',
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              Confirmer la réservation
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDialog;

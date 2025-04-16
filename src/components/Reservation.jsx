import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import dayjs from 'dayjs';

const Reservation = () => {
  const { offreId } = useParams();
  const navigate = useNavigate();

  const [dateDebut, setDateDebut] = useState(dayjs().format('YYYY-MM-DD'));
  const [nbJours, setNbJours] = useState(1);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id);
    } else {
      alert('Aucun utilisateur trouvé dans le localStorage.');
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = dayjs().format('YYYY-MM-DD');

    try {
      await axios.post('http://localhost:8000/api/reservations', {
        date: today,
        date_debut: dateDebut,
        nbr_jour: parseInt(nbJours),
        user_id: userId,
        offre_id: parseInt(offreId),
      });

      alert('Réservation effectuée avec succès !');
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("Une erreur s'est produite lors de la réservation.");
    }
  };

  return (
    <Overlay>
      <DialogBox>
        <CloseButton onClick={() => navigate(-1)}>&times;</CloseButton>
        <h2>Réserver l’offre #{offreId}</h2>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <label htmlFor="date">Date de début :</label>
            <input
              id="date"
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <label htmlFor="jours">Nombre de jours :</label>
            <input
              id="jours"
              type="number"
              min="1"
              value={nbJours}
              onChange={(e) => setNbJours(e.target.value)}
              required
            />
          </InputGroup>

          <ButtonGroup>
            <SubmitButton type="submit">Confirmer</SubmitButton>
            <CancelButton type="button" onClick={() => navigate(-1)}>Annuler</CancelButton>
          </ButtonGroup>
        </Form>
      </DialogBox>
    </Overlay>
  );
};

export default Reservation;

// === Styled Components ===

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  } to {
    opacity: 1;
    transform: scale(1);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const DialogBox = styled.div`
  background: #fff;
  padding: 2rem 3rem;
  border-radius: 15px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
  min-width: 320px;
  max-width: 500px;
  width: 90%;
  animation: ${fadeIn} 0.3s ease-out;

  h2 {
    margin-bottom: 1.5rem;
    font-weight: bold;
    color: #2c3e50;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;

  label {
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
    display: block;
    color: #34495e;
  }

  input {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;

    &:focus {
      border-color: #3498db;
      outline: none;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SubmitButton = styled.button`
  flex: 1;
  background: #3498db;
  color: #fff;
  padding: 0.8rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  transition: background 0.3s ease;
  cursor: pointer;

  &:hover {
    background: #2980b9;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  background: #e74c3c;
  color: #fff;
  padding: 0.8rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  transition: background 0.3s ease;
  cursor: pointer;

  &:hover {
    background: #c0392b;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1.2rem;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #999;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import ReservationDialog from '../ReservationDialog';

const HotelDetail = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedOffre, setSelectedOffre] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const hotelResponse = await axios.get(`http://localhost:8000/api/hotels/${id}`);
        setHotel(hotelResponse.data);

        const offersResponse = await axios.get(`http://localhost:8000/api/offres/hotel/${id}`);
        setOffres(offersResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [id]);

  const handleReservation = (offre) => {
    setSelectedOffre(offre);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedOffre(null);
  };

  if (loading) return <Loading>Chargement en cours...</Loading>;
  if (error) return <Error>{error}</Error>;
  if (!hotel) return <NotFound>Hôtel non trouvé</NotFound>;

  return (
    <Container>
      <HotelCard>
        <HotelImage
          src={hotel.urlImage || '/src/assets/Destination3.png'}
          alt={hotel.nom}
        />
        <HotelInfo>
          <HotelHeader>
            <h1>{hotel.nom}</h1>
            <StarRating>
              {'★'.repeat(hotel.nbEtoiles)}{'☆'.repeat(5 - hotel.nbEtoiles)}
            </StarRating>
          </HotelHeader>
          <HotelAddress>{hotel.adresse}</HotelAddress>
          <HotelDescription>{hotel.description}</HotelDescription>
        </HotelInfo>
      </HotelCard>

      <OffresSection>
        <h2>Nos offres spéciales</h2>

        {offres.length === 0 ? (
          <NoOffres>Aucune offre disponible pour cet hôtel</NoOffres>
        ) : (
          <OffresGrid>
            {offres.map(offre => (
              <OffreCard key={offre.id}>
                <OffreImage
                  src={offre.urlImage || '/src/assets/Destination3.png'}
                  alt={`Offre ${offre.id}`}
                />
                <OffreContent>
                  <OffrePrice>{offre.prix} €</OffrePrice>
                  <OffreDescription>{offre.description}</OffreDescription>

                  <OffreDetails>
                    <DetailItem>Type de chambre : {offre.type_chambre}</DetailItem>
                    <DetailItem>Nombre de personnes : {offre.nombre_personne}</DetailItem>
                    <DetailItem>Du {offre.date_debut} au {offre.date_fin}</DetailItem>
                  </OffreDetails>

                  <ReserveButton onClick={() => handleReservation(offre)}>
                    Réserver maintenant
                  </ReserveButton>
                </OffreContent>
              </OffreCard>
            ))}
          </OffresGrid>
        )}
      </OffresSection>

      {/* Reservation Dialog */}
      <ReservationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        offer={selectedOffre}
      />
    </Container>
  );
};

export default HotelDetail;


// === Styled Components ===

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  position: relative;
`;

const HotelCard = styled.div`
  display: flex;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HotelImage = styled.img`
  width: 40%;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 100%;
    height: 250px;
  }
`;

const HotelInfo = styled.div`
  padding: 2rem;
  flex: 1;
`;

const HotelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h1 {
    margin: 0;
    color: #2c3e50;
    font-size: 2rem;
  }
`;

const StarRating = styled.div`
  color: #f39c12;
  font-size: 1.5rem;
`;

const HotelAddress = styled.div`
  color: #7f8c8d;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
`;

const HotelDescription = styled.p`
  color: #34495e;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const OffresSection = styled.section`
  margin-top: 3rem;

  h2 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    text-align: center;
  }
`;

const OffresGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OffreCard = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const OffreImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const OffreContent = styled.div`
  padding: 1.5rem;
`;

const OffrePrice = styled.h3`
  color: #e74c3c;
  font-size: 1.8rem;
  margin: 0 0 1rem 0;
`;

const OffreDescription = styled.p`
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const OffreDetails = styled.div`
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  font-size: 1rem;
  color: #34495e;
  margin-bottom: 0.5rem;
`;

const ReserveButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #2980b9;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #7f8c8d;
`;

const Error = styled.div`
  text-align: center;
  padding: 3rem;
  color: #e74c3c;
  font-size: 1.2rem;
`;

const NotFound = styled.div`
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  font-size: 1.2rem;
`;

const NoOffres = styled.div`
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  font-style: italic;
`;

const OutletWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  pointer-events: none;

  & > * {
    pointer-events: all;
  }
`;

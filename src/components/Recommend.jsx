import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/hotels');
        setHotels(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) return <Message>Chargement en cours...</Message>;
  if (error) return <Message error>Erreur: {error}</Message>;

  return (
    <Section>
      <div className="title">
        <h2>Nos Hôtels les plus recommandé</h2>
      </div>
      <div className="hotels">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="hotel-card"
            onClick={() => navigate(`/hotel/${hotel.id}`)}
          >
            <img src={hotel.urlImage} alt={hotel.nom} />
            <div className="info">
              <h3>{hotel.nom}</h3>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={i < hotel.nbEtoiles ? 'filled' : 'empty'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="location">{hotel.adresse}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default HotelList;

const Section = styled.section`
  margin: 5rem 2rem;

  .title {
    text-align: center;
    margin-bottom: 2rem;
    h2 {
      font-size: 2rem;
      color: #333;
    }
  }

  .hotels {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;

    .hotel-card {
      background-color: #f0f8ff;
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      transition: 0.3s ease-in-out;
      cursor: pointer;
      width: 300px;

      &:hover {
        transform: translateY(-0.5rem);
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      }

      img {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }

      .info {
        padding: 1.5rem;

        h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
          &:hover {
            color: #e74c3c;
          }
        }

        .stars {
          margin: 0.5rem 0;
          font-size: 1.2rem;

          .filled {
            color: #facc15;
          }
          .empty {
            color: #d1d5db;
          }
        }

        .location {
          color: #666;
          font-size: 0.9rem;
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    .hotels {
      flex-direction: column;
      align-items: center;
    }
  }
`;

const Message = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${(props) => (props.error ? '#dc2626' : '#111827')};
  font-size: 1.2rem;
`;

import React, { useState } from "react";
import styled from "styled-components";
import homeImage from "../assets/hero.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";

export default function Hero() {
  const [destination, setDestination] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (destination.trim() === "") {
      setSearchResult([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get("http://localhost:8000/api/hotels");
      const allHotels = response.data;

      const matchedHotels = allHotels.filter((hotel) =>
        hotel.nom.toLowerCase().includes(destination.toLowerCase())
      );

      setSearchResult(matchedHotels);
    } catch (error) {
      console.error("Erreur de recherche :", error);
      setSearchResult([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <HeroContainer>
      <Background>
        <img src={homeImage} alt="background" />
      </Background>

      <Content>
        <h1>Explorez le Monde</h1>
        <p>Trouvez des hôtels parfaits pour votre prochaine aventure.</p>

        <SearchBox>
          <InputWrapper>
            <FaMapMarkerAlt className="icon" />
            <input
              type="text"
              placeholder="Rechercher une destination..."
              value={destination}
              onChange={(e) => {
                const value = e.target.value;
                setDestination(value);

                // 👉 Si le champ est vidé, supprimer les résultats
                if (value.trim() === "") {
                  setSearchResult([]);
                }
              }}
            />
          </InputWrapper>
          <button
            onClick={handleSearch}
            disabled={isSearching || destination.trim() === ""}
          >
            {isSearching ? "Recherche..." : "Rechercher"}
          </button>
        </SearchBox>

        {searchResult.length > 0 && (
          <HotelsWrapper>
            {searchResult.map((hotel) => (
              <HotelCard key={hotel.id}>
                <HotelImage src={hotel.urlImage} alt={hotel.nom} />
                <div className="info">
                  <h3>{hotel.nom}</h3>
                  <p className="adresse">{hotel.adresse}</p>
                  <p className="etoiles">{hotel.nbEtoiles} ★</p>
                  <p className="desc">{hotel.description}</p>
                </div>
              </HotelCard>
            ))}
          </HotelsWrapper>
        )}

        {searchResult.length === 0 &&
          !isSearching &&
          destination.trim() !== "" && (
            <p style={{ color: "#fff", marginTop: "1rem" }}>
              Aucun hôtel trouvé.
            </p>
          )}
      </Content>
    </HeroContainer>
  );
}

// 🎨 Styled-components

const HeroContainer = styled.div`
  position: relative;
  min-height: 100vh;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.5);
  }
`;

const Content = styled.div`
  max-width: 900px;
  width: 100%;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  h1 {
    font-size: 2.8rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
`;

const SearchBox = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;

  button {
    padding: 0.8rem 1.4rem;
    background-color: #0077ff;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s ease;

    &:hover {
      background-color: #005ad9;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }

  @media (max-width: 600px) {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`;

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;

  .icon {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    color: #888;
    font-size: 1.2rem;
  }

  input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 2.5rem;
    border-radius: 8px;
    border: none;
    font-size: 1rem;
  }
`;

const HotelsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 1.5rem;
`;

const HotelCard = styled.div`
  background: #ffffff;
  color: #333;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: row;
  gap: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }

  .info {
    padding: 1rem;
    text-align: left;

    h3 {
      margin: 0;
      font-size: 1.3rem;
    }

    .adresse {
      margin: 0.3rem 0;
      color: #666;
      font-size: 0.95rem;
    }

    .etoiles {
      font-weight: bold;
      color: #f39c12;
    }

    .desc {
      margin-top: 0.5rem;
      color: #555;
      font-size: 0.95rem;
    }
  }
`;

const HotelImage = styled.img`
  width: 160px;
  height: 160px;
  object-fit: cover;

  @media (max-width: 600px) {
    width: 100%;
    height: 200px;
  }
`;

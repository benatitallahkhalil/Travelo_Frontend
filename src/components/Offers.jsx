import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Hotels.css';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import ReservationDialog from './ReservationDialog'; 

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [hotelsMap, setHotelsMap] = useState({});
  const [addressesMap, setAddressesMap] = useState({});
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/offres')
      .then(res => {
        setOffers(res.data);
        setFilteredOffers(res.data);

        const hotelIds = [...new Set(res.data.map(offer => offer.hotelId))];
        Promise.all(hotelIds.map(id =>
          axios.get(`http://127.0.0.1:8000/api/hotels/${id}`)
            .then(res => ({ id, nom: res.data.nom, adresse: res.data.adresse }))
            .catch(() => ({ id, nom: 'Inconnu', adresse: 'Inconnue' }))
        )).then(results => {
          const hotels = {};
          const addresses = {};
          results.forEach(h => {
            hotels[h.id] = h.nom;
            addresses[h.id] = h.adresse;
          });
          setHotelsMap(hotels);
          setAddressesMap(addresses);
        });
      })
      .catch(err => console.error("Erreur chargement offres :", err));
  }, []);

  const filterOffers = useCallback(() => {
    let filtered = offers.filter(offer => parseFloat(offer.prix) <= maxPrice);

    if (selectedHotels.length > 0) {
      filtered = filtered.filter(offer => selectedHotels.includes(offer.hotelId.toString()));
    }

    if (selectedAddresses.length > 0) {
      filtered = filtered.filter(offer => selectedAddresses.includes(addressesMap[offer.hotelId]));
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(offer => selectedTypes.includes(offer.type_chambre));
    }

    if (selectedPeople.length > 0) {
      filtered = filtered.filter(offer => selectedPeople.includes(String(offer.nombre_personne)));
    }

    if (startDate && endDate) {
      filtered = filtered.filter(offer => {
        const offerStart = dayjs(offer.date_debut);
        const offerEnd = dayjs(offer.date_fin);
        return offerStart.isSameOrAfter(startDate) && offerEnd.isSameOrBefore(endDate);
      });
    }

    setFilteredOffers(filtered);
  }, [offers, maxPrice, selectedHotels, selectedAddresses, selectedTypes, selectedPeople, startDate, endDate, addressesMap]);

  useEffect(() => {
    filterOffers();
  }, [maxPrice, selectedHotels, selectedAddresses, selectedTypes, selectedPeople, startDate, endDate, filterOffers]);

  const toggleSelection = (value, list, setter) => {
    setter(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const uniqueAddresses = [...new Set(Object.values(addressesMap))];
  const chambreTypes = [...new Set(offers.map(o => o.type_chambre).filter(Boolean))];
  const peopleOptions = [...new Set(offers.map(o => String(o.nombre_personne)).filter(Boolean))];

  return (
    <>
      <div className="container">
        <div className="filters">
          <div className="filter-item">
            <h5>Prix maximum : {maxPrice} DT</h5>
            <Box sx={{ width: 200 }}>
              <Slider
                size="small"
                value={maxPrice}
                onChange={(e, val) => setMaxPrice(val)}
                valueLabelDisplay="auto"
                step={10}
                min={0}
                max={2000}
              />
            </Box>
          </div>

          <div className="filter-item">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date de début"
                value={startDate}
                onChange={setStartDate}
              />
              <DatePicker
                label="Date de fin"
                value={endDate}
                onChange={setEndDate}
              />
            </LocalizationProvider>
          </div>

          <div className="filter-item">
            <h5>Filtrer par Hôtel</h5>
            <FormGroup>
              {Object.entries(hotelsMap).map(([id, nom]) => (
                <FormControlLabel
                  key={id}
                  control={
                    <Checkbox
                      checked={selectedHotels.includes(id)}
                      onChange={() => toggleSelection(id, selectedHotels, setSelectedHotels)}
                    />
                  }
                  label={nom}
                />
              ))}
            </FormGroup>
          </div>

          <div className="filter-item">
            <h5>Filtrer par Adresse</h5>
            <FormGroup>
              {uniqueAddresses.map((addr, i) => (
                <FormControlLabel
                  key={i}
                  control={
                    <Checkbox
                      checked={selectedAddresses.includes(addr)}
                      onChange={() => toggleSelection(addr, selectedAddresses, setSelectedAddresses)}
                    />
                  }
                  label={addr}
                />
              ))}
            </FormGroup>
          </div>

          <div className="filter-item">
            <h5>Type de chambre</h5>
            <FormGroup>
              {chambreTypes.map((type, i) => (
                <FormControlLabel
                  key={i}
                  control={
                    <Checkbox
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleSelection(type, selectedTypes, setSelectedTypes)}
                    />
                  }
                  label={type}
                />
              ))}
            </FormGroup>
          </div>

          <div className="filter-item">
            <h5>Nombre de personnes</h5>
            <FormGroup>
              {peopleOptions.map((num, i) => (
                <FormControlLabel
                  key={i}
                  control={
                    <Checkbox
                      checked={selectedPeople.includes(num)}
                      onChange={() => toggleSelection(num, selectedPeople, setSelectedPeople)}
                    />
                  }
                  label={num}
                />
              ))}
            </FormGroup>
          </div>
        </div>

        <div className="offer-list">
          {filteredOffers.length > 0 ? (
            filteredOffers.map((offer, index) => (
              <figure key={index} className="card card-product-grid card-lg">
                <div className="img-wrap">
                  <img src="/src/assets/Destination6.png" alt="Offre" />
                </div>
                <figcaption className="info-wrap">
                  <h5 className="title">Offre #{offer.id}</h5>
                  <p className="description">{offer.description}</p>
                  <p className="hotel-name">Hôtel : {hotelsMap[offer.hotelId]}</p>
                  <p className="hotel-name">Adresse : {addressesMap[offer.hotelId]}</p>
                  <p><strong>Type de chambre :</strong> {offer.type_chambre}</p>
                  <p><strong>Nombre de personnes :</strong> {offer.nombre_personne}</p>
                  <p><strong>Du :</strong> {offer.date_debut} <strong>au</strong> {offer.date_fin}</p>
                </figcaption>
                <div className="bottom-wrap">
                  <span className="price-tag">{offer.prix} DT</span>
                  <button
                    className="btn btn-offers"
                    onClick={() => {
                      setSelectedOffer(offer);
                      setOpenDialog(true);
                    }}
                  >
                    Réserver
                  </button>
                </div>
              </figure>
            ))
          ) : (
            <p>Aucune offre ne correspond à vos critères.</p>
          )}
        </div>
      </div>

      {/* ✅ Composant de réservation */}
      <ReservationDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        offer={selectedOffer}
      />
    </>
  );
};

export default Offers;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Checkbox from '@mui/material/Checkbox';
import Rating from '@mui/material/Rating';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { useNavigate } from 'react-router-dom';


const Hotel = () => {
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [uniqueLocations, setUniqueLocations] = useState([]);
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        stars: [],
        location: 'all',
    });

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `  body {
            background-color: #EEEEEE;
            margin: 0;
            padding: 0;
        }
        
        a {
            text-decoration: none !important;
        }
        
        .container {
            display: flex;
            width: 100%;
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }
        
        .filters {
            width: 280px;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 16px;
            margin-right: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }
        
        .filter-item {
            margin-bottom: 25px;
            padding: 15px;
            border-radius: 10px;
            background-color: #f1f3f5;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .filter-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
        }
        
        .filter-item h5 {
            font-size: 17px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #333;
        }
        
        .form-check-label::before {
            content: "";
            position: absolute;
            left: 0;
            top: 1px;
            height: 18px;
            width: 18px;
            background-color: #fff;
            border: 2px solid #ccc;
            border-radius: 4px;
            transition: all 0.3s ease;
        }
        
        .form-check-input:checked + .form-check-label::before {
            background-color: #3167eb;
            border-color: #3167eb;
            transform: scale(1.1);
        }
        
        .form-check {
            position: relative;
            padding-left: 1.8em;
            margin-bottom: 10px;
            cursor: pointer;
            user-select: none;
        }
        
        .form-check-input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
        }
        
        .form-check-label {
            font-size: 14px;
            color: #333;
            padding-left: 6px;
            position: relative;
        }
        
        .form-check-input:checked + .form-check-label::after {
            content: "✔";
            position: absolute;
            left: 4px;
            top: 0;
            font-size: 14px;
            color: white;
        }
        
        /* Styling for the star checkbox */
        .star-rating input.form-control {
            display: none;
        }
        
        .star-rating label {
            font-size: 30px;
            color: #ccc;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .star-rating input[type="radio"]:checked ~ label,
        .star-rating label:hover,
        .star-rating label:hover ~ label {
            color: #FF9800;
        }
        
        .star-rating input[type="radio"]:checked + label {
            color: #FF9800;
        }
        
        input.form-control {
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #ccc;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        input.form-control:focus {
            border-color: #3167eb;
            box-shadow: 0 0 5px rgba(49, 103, 235, 0.3);
            outline: none;
        }
        
        .hotel-list {
            display: flex;
            flex-wrap: wrap;
           
            width: 100%;
            justify-content: flex-start;
        }
        
        .card {
            flex: 0 0 32%;
            box-sizing: border-box;
            position: relative;
            display: flex;
            flex-direction: column;
            background-color: #fff;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 23px;
            transition: all 0.4s ease;
        }
        
        .card:hover {
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
            transform: translateY(-5px);
        }
        
        .card:hover .img-wrap img {
            transform: scale(1.05);
        }
        
        .card:hover .title {
            color: #3167eb;
            text-decoration: underline;
        }
        
        .img-wrap {
            border-radius: 0.2rem 0.2rem 0 0;
            height: 260px;
            padding: 16px;
            text-align: center;
            overflow: hidden;
        }
        
        .img-wrap img {
            height: 100%;
            max-width: 100%;
            width: auto;
            object-fit: cover;
            border-radius: 12px;
            transition: transform 0.3s ease-in-out;
        }
        
        .info-wrap {
            padding: 18px 20px;
        }
        
        .title {
            color: #212529;
            display: block;
            font-weight: bold;
            transition: color 0.3s ease;
        }
        
        .rated {
            font-size: 10px;
            color: #b3b4b6;
        }
        
        .rating {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 3px;
            flex-wrap: nowrap;
            white-space: nowrap;
        }
        
        .rating i.fa {
            color: #FF5722;
            font-size: 16px;
        }
        
        .bottom-wrap {
            padding: 18px;
            border-top: 1px solid #e4e4e4;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }
        
        .btn {
            font-weight: 600;
            font-size: 1rem;
            padding: 0.45rem 0.85rem;
            border-radius: 0.2rem;
            display: flex;
            align-items: center;
            gap: 5px;
            flex-direction: row-reverse;
            transition: all 0.3s ease;
            transform: scale(1);
        }
        
        .btn:hover {
            transform: scale(1.08);
            opacity: 0.9;
            box-shadow: 0 3px 8px rgba(0,0,0,0.2);
        }
        
        .btn-warning {
            background-color: #3167eb;
            border-color: #3167eb;
            color: white;
        }
        
         .btn-offers  {
            background-color: #ffc107;
            border-color: #ffc107;
            color: white;
        }
        
        // .btn-offers {
        //     background-color: #f5a623;
        //     border-color: #f5a623;
        //     color: white;
        // }
        
        .fa-star {
            color: #FF9800;
            font-size: 16px;
        }
.btn-warning:hover {
    background-color: #ffffff;
    color: #3167eb;
    border-color: #3167eb;
    transform: scale(1.08);
    opacity: 1;
    box-shadow: 0 3px 8px rgba(49, 103, 235, 0.3);
}

.btn-offers:hover {
    background-color: #ffffff;
    color: #ffc107;
    border-color: #ffc107;
    transform: scale(1.08);
    opacity: 1;
    box-shadow: 0 3px 8px rgba(255, 193, 7, 0.3);
} 
    @media (max-width: 768px) {
  .card {
    flex: 0 0 48%;
  }
}

@media (max-width: 480px) {
  .card {
    flex: 0 0 100%;
  }
}


        `;
        document.head.appendChild(style);

        axios.get('http://127.0.0.1:8000/api/hotels')
            .then(response => {
                setHotels(response.data);

                // Extraire les localisations uniques à partir des adresses
                const locations = [...new Set(response.data.map(h => h.adresse))];
                setUniqueLocations(locations);
            })
            .catch(error => console.error("Erreur lors du chargement des hôtels :", error));

        return () => document.head.removeChild(style);
    }, []);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFilters((prev) => {
                const stars = checked
                    ? [...prev.stars, value]
                    : prev.stars.filter((s) => s !== value);
                return { ...prev, stars };
            });
        } else {
            setFilters({ ...filters, [name]: value });
        }
    };

    useEffect(() => {
        let filtered = hotels;

        if (filters.stars.length > 0) {
            filtered = filtered.filter(hotel =>
                filters.stars.includes(String(hotel.nbEtoiles))
            );
        }

        if (filters.location !== 'all') {
            filtered = filtered.filter(hotel =>
                hotel.adresse.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        setFilteredHotels(filtered);
    }, [filters, hotels]);

    return (
        <div className="container">
            <div className="filters">

                {/* Filtres par étoiles */}
                <div className="filter-item">
                    <h5>Filtrer par étoiles</h5>
                    {['1', '2', '3', '4', '5'].map(star => (
                        <div key={star} className="d-flex align-items-center justify-content-between mb-2">
                            <Checkbox
                                value={star}
                                onChange={handleFilterChange}
                                checked={filters.stars.includes(star)}
                                name="stars"
                                size="small"
                                inputProps={{ 'aria-label': `${star} étoiles` }}
                            />
                            <Rating
                                name={`read-only-${star}`}
                                value={parseInt(star)}
                                readOnly
                                size="small"
                            />
                        </div>
                    ))}
                </div>

                {/* Filtres par localisation (adresse) */}
                <div className="filter-item">
                    <FormControl>
                        <FormLabel id="location-filter">Filtrer par localisation</FormLabel>
                        <RadioGroup
                            value={filters.location}
                            onChange={handleFilterChange}
                            aria-labelledby="location-filter"
                            name="location"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: 1,
                                paddingLeft: 1
                            }}
                        >
                            <FormControlLabel value="all" control={<Radio />} label="Toutes" />
                            {uniqueLocations.map((location, index) => (
                                <FormControlLabel key={index} value={location} control={<Radio />} label={location} />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </div>

            </div>

            {/* Liste des hôtels filtrés */}
            <div className="hotel-list">
                {filteredHotels.map((hotel, index) => (
                    <figure key={index} className="card card-product-grid card-lg">
                        <a href="#" className="img-wrap" data-abc="true">
                            <img src="/src/assets/Destination1.png" alt={hotel.nom} />
                        </a>
                        <figcaption className="info-wrap">
                            <div className="row">
                                <div className="col-md-9 col-xs-9">
                                    <a href="#" className="title" data-abc="true">{hotel.nom}</a>
                                    <span className="rated">{hotel.adresse}</span>
                                </div>
                                <div className="col-md-3 col-xs-3">
                                    <div className="rating">
                                        {[...Array(hotel.nbEtoiles)].map((_, i) => (
                                            <i key={i} className="fa fa-star"></i>
                                        ))}
                                        <span className="rated ms-1">{hotel.nbEtoiles} étoile(s)</span>
                                    </div>
                                </div>
                            </div>
                        </figcaption>

                        <div className="bottom-wrap">
                         
                 <button
                    onClick={() => navigate(`/hotel/${hotel.id}`)}
                    className="btn btn-offers"
                >
                    <span className="material-symbols-outlined">redeem</span>
                    Offres
                </button>

                            {/* <a href="#" className="btn btn-primary" data-abc="true">
                                <span className="material-symbols-outlined">hotel</span>
                                Réserver
                            </a> */}
                        </div>
                    </figure>
                ))}
            </div>
        </div>
    );
};

export default Hotel;
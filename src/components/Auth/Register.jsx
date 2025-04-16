import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import './Register.css';
import PageTransitionWrapper from './PageTransitionWrapper';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    telephone: '',
    statut: '',
    password: '',
    password_confirmation: '',
  });
  const navigate = useNavigate();


  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/users/register', form);
      setSuccess(res.data.message);
      setErrors({});
  
      // Redirection après 1.5 secondes pour laisser le temps d'afficher le message
      setTimeout(() => {
        navigate('/login');
      }, 1500);
  
    } catch (err) {
      if (err.response?.status === 400) {
        setErrors(err.response.data);
      } else {
        setErrors({ global: 'Une erreur est survenue' });
      }
    }
  };
  

  return (
    <PageTransitionWrapper>
      <MDBContainer fluid className="vh-100 d-flex justify-content-center align-items-center">
        <MDBRow className="w-100">
          <MDBCol md="6" className="d-none d-md-flex justify-content-center align-items-center px-4">
            <div className="video-container w-100">
              <video autoPlay loop muted playsInline>
                <source src="/src/assets/register.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
            </div>
          </MDBCol>

          <MDBCol md="6" className="d-flex justify-content-center align-items-center">
            <div className="register-box shadow-lg p-4 rounded-4 w-75">
              <div className="d-flex flex-row mb-4">
                <MDBIcon fas icon="user-plus fa-3x me-3" style={{ color: '#111111' }} />
                <span className="h1 fw-bold mb-0" style={{ fontFamily: ' Rubik Moonrocks, sans-serif' }}>Register</span>
</div>

<h3 className="fw-normal mb-3" style={{ letterSpacing: '1px', fontFamily: 'Barrio, sans-serif' }}>Créer un compte</h3>


              {success && <p className="text-success text-center">{success}</p>}
              {errors.global && <p className="text-danger text-center">{errors.global}</p>}

              <form onSubmit={handleRegister}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nom"
                  />
                  <label htmlFor="name">Nom</label>
                  {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                  <label htmlFor="email">Email</label>
                  {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="telephone"
                    name="telephone"
                    value={form.telephone}
                    onChange={handleChange}
                    placeholder="Téléphone"
                  />
                  <label htmlFor="telephone">Téléphone</label>
                  {errors.telephone && <div className="text-danger small mt-1">{errors.telephone}</div>}
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="statut"
                    name="statut"
                    value={form.statut}
                    onChange={handleChange}
                    placeholder="Statut"
                  />
                  <label htmlFor="statut">Statut</label>
                  {errors.statut && <div className="text-danger small mt-1">{errors.statut}</div>}
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Mot de passe"
                  />
                  <label htmlFor="password">Mot de passe</label>
                  {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="password_confirmation"
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    placeholder="Confirmer le mot de passe"
                  />
                  <label htmlFor="password_confirmation">Confirmer le mot de passe</label>
                </div>

                <button
                  type="submit"
                  className="btn btn-info btn-lg mb-4 px-5 w-100"
                  style={{
                    backgroundColor: '#17a2b8',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#138496')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#17a2b8')}
                >
                  S'inscrire
                </button>
              </form>

              <p className="text-center text-muted">
                Vous avez déjà un compte ? <Link to="/login" className="link-info">Se connecter</Link>
              </p>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </PageTransitionWrapper>
  );
};

export default Register;

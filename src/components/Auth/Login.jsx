import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import PageTransitionWrapper from './PageTransitionWrapper';

import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon
} from 'mdb-react-ui-kit';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/login', form);

      // Stockage du token et des infos utilisateur
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      const user = response.data.user;
console.log(user);


      // Redirection vers le tableau de bord
     // Rediriger selon le rôle
     if (user.role === 'admin') {
      navigate('/dashboard');
    } else if (user.role === 'user') {
      navigate('/');
    } else {
      navigate('/');
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Erreur de connexion');
  }
  };

  return (
    <PageTransitionWrapper>
    <MDBContainer fluid className="vh-100 d-flex justify-content-center align-items-center p-0">
      <MDBRow className="w-100 h-100">
        {/* Form Section */}
        <MDBCol md="6" className="d-flex justify-content-center align-items-center">
          <div className="login-box shadow-lg p-4 rounded-4 w-75">
            <div className="d-flex flex-row mb-4 align-items-center">
              <MDBIcon icon="sign-in-alt" className="fa-3x me-3" style={{ color: '#111111' }} />
              <span className="h1 fw-bold mb-0" style={{ fontFamily: 'Rubik Moonrocks, sans-serif' }}>Login</span>
            </div>

            <h3 className="fw-normal mb-3" style={{ letterSpacing: '1px', fontFamily: 'Barrio, sans-serif' }}>Se connecter</h3>

            {error && <p className="text-danger text-center">{error}</p>}

            <form onSubmit={handleLogin}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Adresse Email"
                  required
                />
                <label htmlFor="email">Adresse Email</label>
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
                  required
                />
                <label htmlFor="password">Mot de passe</label>
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
                Se connecter
              </button>
            </form>

            <p className="small mb-4 text-center">
              <a className="text-muted" href="#!">Mot de passe oublié ?</a>
            </p>

            <p className="text-center text-muted">
              Vous n'avez pas de compte ? <Link to="/register" className="link-info">Créer un compte</Link>
            </p>
          </div>
        </MDBCol>

        {/* Video Section */}
        <MDBCol md="6" className="d-none d-md-flex justify-content-center align-items-center px-4">
          <div className="video-container w-100">
            <video
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/src/assets/register_1.mp4" type="video/mp4" />
            </video>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  </PageTransitionWrapper>
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import logo from "../assets/travelopng1.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { VscChromeClose } from "react-icons/vsc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const [navbarState, setNavbarState] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Écouter les changements de localStorage
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://127.0.0.1:8000/api/users/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    } finally {
      // Nettoyage quel que soit le résultat
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setNavbarState(false);
      navigate("/login");
      
      // Forcer le rafraîchissement pour s'assurer que tous les composants sont mis à jour
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <>
      <Nav>
        <div className="brand">
          <div className="container">
            <Link to="/">
              <img src={logo} alt="Travelo Logo" className="logo-image" />
            </Link>
          </div>
          <div className="toggle">
            {navbarState ? (
              <VscChromeClose onClick={() => setNavbarState(false)} />
            ) : (
              <GiHamburgerMenu onClick={() => setNavbarState(true)} />
            )}
          </div>
        </div>

        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/hotels">Hotels</Link>
          </li>
          <li>
            <Link to="/offers">Offres</Link>
          </li>
          {user?.role === "admin" && (
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          )}
        </ul>

        <div className="profile-section">
          {user ? (
            <>
              <div 
                className="profile-circle"
                onClick={() => navigate("/profile")}
                title={`${user.name || 'Utilisateur'} (${user.role})`}
              >
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <button onClick={handleLogout} className="logout-btn">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <button className="login-btn">
                <Link to="/login">Connexion</Link>
              </button>
              <button className="register-btn">
                <Link to="/register">Inscription</Link>
              </button>
            </>
          )}
        </div>
      </Nav>

      <ResponsiveNav state={navbarState}>
        <ul>
          <li>
            <Link to="/" onClick={() => setNavbarState(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setNavbarState(false)}>
              About
            </Link>
          </li>
          <li>
            <Link to="/offers" onClick={() => setNavbarState(false)}>
              Offres
            </Link>
          </li>
          <li>
            <Link to="/testimonials" onClick={() => setNavbarState(false)}>
              Avis
            </Link>
          </li>
          {user?.role === "admin" && (
            <li>
              <Link to="/dashboard" onClick={() => setNavbarState(false)}>
                Dashboard
              </Link>
            </li>
          )}
          {user ? (
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Déconnexion
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link 
                  to="/login" 
                  onClick={() => setNavbarState(false)}
                  className="mobile-login-link"
                >
                  Connexion
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  onClick={() => setNavbarState(false)}
                  className="mobile-register-link"
                >
                  Inscription
                </Link>
              </li>
            </>
          )}
        </ul>
      </ResponsiveNav>
    </>
  );
}

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;

  .brand {
    .container {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.4rem;
      font-size: 1.5rem;
      font-weight: 900;
      text-transform: uppercase;
      color: #2c3e50;

      img {
        height: 40px;
      }
    }

    .toggle {
      display: none;
    }
  }

  ul {
    display: flex;
    gap: 2rem;
    list-style-type: none;

    li {
      a {
        text-decoration: none;
        color: #34495e;
        font-size: 1.1rem;
        font-weight: 500;
        transition: all 0.3s ease;
        padding: 0.5rem 0;
        position: relative;

        &:hover {
          color: #3498db;
        }

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #3498db;
          transition: width 0.3s ease;
        }

        &:hover::after {
          width: 100%;
        }
      }
    }
  }

  .profile-section {
    display: flex;
    align-items: center;
    gap: 1.5rem;

    .profile-circle {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background-color: #3498db;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: #2980b9;
        transform: scale(1.05);
      }
    }

    button {
      padding: 0.6rem 1.2rem;
      cursor: pointer;
      border-radius: 25px;
      border: none;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;

      a {
        color: white;
        text-decoration: none;
      }
    }

    .login-btn {
      background-color: #3498db;

      &:hover {
        background-color: #2980b9;
      }
    }

    .register-btn {
      background-color: #2ecc71;

      &:hover {
        background-color: #27ae60;
      }
    }

    .logout-btn {
      background-color: #e74c3c;

      &:hover {
        background-color: #c0392b;
      }
    }
  }

  @media screen and (max-width: 1080px) {
    padding: 1rem;
    flex-wrap: wrap;

    .brand {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .toggle {
        display: block;
        font-size: 1.5rem;
        color: #2c3e50;
        cursor: pointer;
      }
    }

    ul {
      display: none;
    }

    .profile-section {
      display: none;
    }
  }
`;

const ResponsiveNav = styled.div`
  display: flex;
  position: fixed;
  z-index: 99;
  top: ${({ state }) => (state ? "80px" : "-100vh")};
  left: 0;
  right: 0;
  background-color: white;
  height: ${({ state }) => (state ? "auto" : "0")};
  min-height: ${({ state }) => (state ? "50vh" : "0")};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  padding: ${({ state }) => (state ? "2rem" : "0")};

  ul {
    list-style-type: none;
    width: 100%;
    padding: 0;
    margin: 0;

    li {
      width: 100%;
      margin: 1rem 0;
      text-align: center;

      a {
        text-decoration: none;
        color: #34495e;
        font-size: 1.2rem;
        font-weight: 500;
        padding: 0.5rem 1rem;
        display: block;
        transition: all 0.3s ease;

        &:hover {
          color: #3498db;
          background-color: #f8f9fa;
        }
      }

      button {
        width: 80%;
        margin: 0 auto;
        padding: 0.8rem;
        border-radius: 25px;
        border: none;
        color: white;
        font-size: 1rem;
        font-weight: 600;
        background-color: #e74c3c;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background-color: #c0392b;
        }
      }

      .mobile-login-link {
        display: inline-block;
        width: 80%;
        padding: 0.8rem;
        border-radius: 25px;
        background-color: #3498db;
        color: white !important;
        margin: 0.5rem auto;

        &:hover {
          background-color: #2980b9;
        }
      }

      .mobile-register-link {
        display: inline-block;
        width: 80%;
        padding: 0.8rem;
        border-radius: 25px;
        background-color: #2ecc71;
        color: white !important;
        margin: 0.5rem auto;

        &:hover {
          background-color: #27ae60;
        }
      }
    }
  }

  @media screen and (min-width: 1081px) {
    display: none;
  }
`;
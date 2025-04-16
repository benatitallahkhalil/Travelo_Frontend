import React from "react";
import styled from "styled-components";
import { BsLinkedin, BsFacebook, BsTwitter, BsGithub } from "react-icons/bs";
import { AiFillInstagram, AiOutlineMail } from "react-icons/ai";
import { FaTripadvisor } from "react-icons/fa";

export default function Footer() {
  return (
    <FooterContainer>
      <div className="content">
        <div className="copyright">
          <h3>Travelo</h3>
          <span>© {new Date().getFullYear()} Travelo. Tous droits réservés</span>
          <div className="newsletter">
            <p>Abonnez-vous à notre newsletter</p>
            <form>
              <input type="email" placeholder="Votre email" />
              <button type="submit">S'abonner</button>
            </form>
          </div>
        </div>

        <div className="links-section">
          <div className="links">
            <h4>Liens rapides</h4>
            <ul>
              <li>
                <a href="/">Accueil</a>
              </li>
              <li>
                <a href="/hotels">Hotels</a>
              </li>
              <li>
                <a href="/offres">Offres</a>
              </li>
            </ul>
          </div>

          <div className="contact">
            <h4>Contact</h4>
            <ul>
              <li>
                <AiOutlineMail /> contact@travelo.com
              </li>
              <li>+216 23 45 67 89</li>
              <li>123 Rue du Voyage, Paris, France</li>
            </ul>
          </div>
        </div>
      </div>

      
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 3rem 2rem 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  .content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  .copyright {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    h3 {
      font-size: 1.8rem;
      font-weight: 700;
      color: #fff;
      margin: 0;
    }

    span {
      opacity: 0.8;
      font-size: 0.9rem;
    }

    .newsletter {
      p {
        margin-bottom: 0.5rem;
        font-weight: 500;
      }

      form {
        display: flex;
        gap: 0.5rem;

        input {
          padding: 0.5rem;
          border: none;
          border-radius: 4px;
          flex: 1;
          min-width: 0;
        }

        button {
          background-color: #ff6b6b;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background-color: #ff5252;
          }
        }
      }
    }
  }

  .links-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  .links, .contact {
    h4 {
      font-size: 1.2rem;
      margin-bottom: 1.2rem;
      color: #fff;
      position: relative;
      padding-bottom: 0.5rem;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 40px;
        height: 2px;
        background: #ff6b6b;
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;

      li {
        a, span {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        a:hover {
          color: #fff;
          padding-left: 5px;
        }

        svg {
          font-size: 1.1rem;
        }
      }
    }
  }

  .social-and-legal {
    max-width: 1200px;
    margin: 1rem auto 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding-top: 1.5rem;

    .social__links {
      display: flex;
      gap: 1.5rem;

      a {
        color: white;
        font-size: 1.5rem;
        transition: all 0.3s ease;
        opacity: 0.8;

        &:hover {
          opacity: 1;
          transform: translateY(-3px);
          color: #ff6b6b;
        }
      }
    }

    .legal-links {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
      justify-content: center;

      a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        font-size: 0.8rem;
        transition: all 0.3s ease;

        &:hover {
          color: #fff;
          text-decoration: underline;
        }
      }
    }
  }
`;

import React from "react";
import styled from "styled-components";
import avatarImage from "../assets/1.jpg";
import yessine from "../assets/yessine.jpg";
import nour from "../assets/zaw.jpg"
import khalil from "../assets/khalil.jpg";
export default function Testimonials() {
  return (
    <Section id="testimonials">
  <div className="title">
    <h2>Témoignages de Nos Clients</h2>
    <p>Ce que nos clients disent de leur expérience</p>
  </div>
  <div className="testimonials">
    {/* Professional Testimonial 1 */}
    <div className="testimonial">
      <p>
        "Jamais vu un service aussi professionnel! La réservation était fluide, 
        l'hôtel correspondait exactement à la description, et le staff était aux petits soins."
      </p>
      <div className="info">
        <img src={avatarImage} alt="Client professionnel" />
        <div className="details">
          <h4>Mohamed Amin</h4>
          <span>Directeur - Société Tunisienne de Banque</span>
        </div>
      </div>
    </div>

    {/* Humorous Testimonial */}
    <div className="testimonial">
      <p>
        "Même ma belle-mère aurait trouvé à redire... mais là, nada! Tout était parfait. 
        Surtout le couscous du vendredi - un délice!"
      </p>
      <div className="info">
        <img src={yessine} alt="Client humoristique" />
        <div className="details">
          <h4>Yassine Blagueur</h4>
          <span>Comédien - Stand-up Tunisien</span>
        </div>
      </div>
    </div>

    {/* Professional Testimonial 2 */}
    <div className="testimonial">
      <p>
        "En 10 ans de voyages professionnels, c'est la première fois que je trouve une plateforme 
        aussi fiable pour la réservation d'hôtels en Tunisie. Service client réactif 24/7."
      </p>
      <div className="info">
        <img src={nour} alt="Cliente professionnelle" />
        <div className="details">
          <h4>Mohamed Zouari</h4>
          <span>Responsable Logistique - Multinationale</span>
        </div>
      </div>
    </div>

    {/* Mixed Testimonial */}
    <div className="testimonial">
      <p>
        "Le wifi marchait tellement bien que j'ai pu streamer Netflix sans buffer... 
        et pourtant j'étais en pleine conférence Zoom avec le CEO!"
      </p>
      <div className="info">
        <img src={khalil} alt="Client tech" />
        <div className="details">
          <h4>Khalil Tech</h4>
          <span>CTO - Startup Tunisienne</span>
        </div>
      </div>
    </div>
  </div>
</Section>
  );
}

const Section = styled.section`
  margin: 5rem 0;
  padding: 0 1rem;

  .title {
    text-align: center;
    margin-bottom: 3rem;
    h2 {
      font-size: 2rem;
      color: #333;
    }
    p {
      color: #666;
      font-size: 1rem;
      margin-top: 0.5rem;
    }
  }

  .testimonials {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;

    .testimonial {
      background-color: #f0f8ff;
      padding: 2rem;
      border-radius: 0.75rem;
      width: 300px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
      }

      p {
        font-style: italic;
        color: #444;
      }

      .info {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 1.5rem;

        img {
          border-radius: 50%;
          width: 3rem;
          height: 3rem;
          object-fit: cover;
        }

        .details {
          h4 {
            margin: 0;
            font-size: 1rem;
            font-weight: bold;
            color: #222;
          }

          span {
            font-size: 0.85rem;
            color: #777;
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    .testimonials {
      flex-direction: column;
      align-items: center;

      .testimonial {
        width: 90%;
      }
    }
  }
`;

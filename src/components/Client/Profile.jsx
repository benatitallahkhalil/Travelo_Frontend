import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [avisList, setAvisList] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    // Get user info
    axios.get(`http://localhost:8000/api/users/${userId}`)
      .then(res => setUserData(res.data.user))
      .catch(err => console.error("Erreur utilisateur:", err));

    // Get user reservations
    axios.get(`http://localhost:8000/api/reservations`)
      .then(res => {
        const userReservations = res.data.filter(r => r.user.id === parseInt(userId));
        setReservations(userReservations);
      })
      .catch(err => console.error("Erreur réservations:", err));

    // Get all reviews (avis)
    axios.get(`http://localhost:8000/api/avis`)
      .then(res => setAvisList(res.data))
      .catch(err => console.error("Erreur avis:", err));
  }, [userId]);

  const handleConfirmReservation = (id) => {
    axios.put(`http://localhost:8000/api/reservations/client/${id}`, {
      etatReservation: "confirme"
    }).then(() => {
      setReservations(prev =>
        prev.map(res => res.id === id ? { ...res, etatReservation: "confirme" } : res)
      );
    }).catch(error => console.error("Erreur confirmation:", error));
  };

  const handleCancelReservation = (id) => {
    axios.put(`http://localhost:8000/api/reservations/client/${id}`, {
      etatReservation: "annule"
    }).then(() => {
      // Suppression après annulation
      axios.delete(`http://localhost:8000/api/reservations/${id}`)
        .then(() => {
          setReservations(prev => prev.filter(res => res.id !== id));
        })
        .catch(err => console.error("Erreur suppression:", err));
    }).catch(error => console.error("Erreur annulation:", error));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!review || !rating || !selectedReservation) return;

    axios.post("http://localhost:8000/api/avis", {
      commentaire: review,
      note: rating,
      reservation_id: selectedReservation
    }).then(res => {
      alert("Avis envoyé avec succès !");
      setAvisList(prev => [...prev, res.data]);
      setReview("");
      setRating(5);
      setSelectedReservation(null);
    }).catch(err => {
      console.error("Erreur lors de l'envoi de l'avis:", err);
      alert("Erreur lors de l'envoi de l'avis.");
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!userData) return <div className="loading">Chargement...</div>;

  return (
    <div className="profile-container">
      <div className="header">
        <h1>Mon Profil</h1>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
          Mes Informations
        </button>
        <button className={`tab ${activeTab === "reservations" ? "active" : ""}`} onClick={() => setActiveTab("reservations")}>
          Mes Réservations
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="profile-info">
          <div className="info-item"><strong>Nom:</strong> {userData.name}</div>
          <div className="info-item"><strong>Email:</strong> {userData.email}</div>
          <div className="info-item"><strong>Téléphone:</strong> {userData.telephone}</div>
          <div className="info-item"><strong>Statut:</strong> {userData.statut}</div>
          <div className="info-item"><strong>Membre depuis:</strong> {new Date(userData.created_at).toLocaleDateString()}</div>
        </div>
      )}

      {activeTab === "reservations" && (
        <div className="reservations-container">
          {reservations.length === 0 ? (
            <div className="no-reservations">Vous n'avez aucune réservation.</div>
          ) : (
            reservations.map(res => {
              const avisForReservation = avisList.filter(a => a.reservation_id === res.id);
              return (
                <div key={res.id} className="reservation-card">
                  <div className="reservation-header">
                    <h3>{res.offre?.nom || "Offre"}</h3>
                    <span className={`status ${res.etatReservation}`}>
                      {res.etatReservation}
                    </span>
                  </div>

                  <div className="reservation-details">
                    <div><strong>Date de réservation:</strong> {new Date(res.date).toLocaleDateString()}</div>
                    <div><strong>Offre ID:</strong> {res.offre_id}</div>
                    <div><strong>Description:</strong> {res.offre?.description || "Aucune description"}</div>
                    <div><strong>Prix:</strong> {res.offre?.prix} €</div>
                    <div><strong>Type de chambre</strong> {res.offre?.type_chambre || "Non spécifié"}</div>
                    <div><strong>Nombre de personnes:</strong> {res.offre?.nombre_personne} </div>
                    <div><strong>Date de début:</strong> {res.offre?.date_debut} </div>
                    <div><strong>Date de fin:</strong> {res.offre?.date_fin} </div>
                  </div>

                  {res.etatReservation === "en attente" && (
                    <div className="reservation-actions">
                      <button onClick={() => handleConfirmReservation(res.id)} className="confirm-btn">Confirmer</button>
                      <button onClick={() => handleCancelReservation(res.id)} className="cancel-btn">Annuler</button>
                    </div>
                  )}

                  {res.etatReservation === "confirme" && (
                    <div className="review-section">
                      {avisForReservation.length > 0 && (
                        <div className="avis-display">
                          <h4>Avis précédents:</h4>
                          {avisForReservation.map((a, index) => (
                            <div key={index} className="avis-item">
                              <div><strong>Note:</strong> {a.note} ⭐</div>
                              <div><strong>Commentaire:</strong> {a.commentaire}</div>
                              <hr />
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedReservation === res.id ? (
                        <form className="review-form" onSubmit={handleSubmitReview}>
                          <label>Note:
                            <select value={rating} onChange={e => setRating(Number(e.target.value))}>
                              {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num} étoile{num > 1 ? "s" : ""}</option>
                              ))}
                            </select>
                          </label>
                          <textarea
                            required
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Décrivez votre expérience..."
                          />
                          <div className="review-buttons">
                            <button type="submit" className="submit-btn">Envoyer</button>
                            <button type="button" onClick={() => setSelectedReservation(null)} className="cancel-review-btn">Annuler</button>
                          </div>
                        </form>
                      ) : (
                        <button onClick={() => setSelectedReservation(res.id)} className="review-btn">
                          Ajouter un avis
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;

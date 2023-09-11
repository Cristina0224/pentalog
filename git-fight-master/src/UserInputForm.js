import React, { useState } from "react";

function UserInputForm({ onSearch }) {
  // Definirea stării pentru username-urile celor doi utilizatori și pentru afișarea erorilor
  const [username1, setUsername1] = useState("");
  const [username2, setUsername2] = useState("");
  const [error, setError] = useState("");

  // Funcție pentru gestionarea trimiterii formularului
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificăm dacă ambele câmpuri au fost completate
    if (username1 && username2) {
      try {
        // Realizăm căutarea utilizatorilor utilizând funcția onSearch furnizată ca prop
        await onSearch(username1, username2);
        // Dacă căutarea este reușită, resetăm mesajul de eroare
        setError("");
      } catch (error) {
        // În caz de eroare, setăm un mesaj de eroare corespunzător
        setError("Unul sau ambii utilizatori nu au fost găsiți pe GitHub.");
      }
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Câmpuri de introducere pentru numele utilizatorilor */}
        <input
          type="text"
          placeholder="Introduceți numele primului utilizator GitHub"
          value={username1}
          onChange={(e) => setUsername1(e.target.value)}
        />
        <input
          type="text"
          placeholder="Introduceți numele celui de-al doilea utilizator GitHub"
          value={username2}
          onChange={(e) => setUsername2(e.target.value)}
        />
        {/* Buton pentru trimiterea formularului */}
        <button type="submit">Compară</button>
      </form>
    </div>
  );
}

export default UserInputForm;

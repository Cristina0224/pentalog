// Importam React și ReactDOM necesare pentru a crea și randa aplicația
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Importam stilurile pentru aplicație, dacă există
import App from "./App"; // Importam componenta App pe care dorim să o randam
import reportWebVitals from "./reportWebVitals"; // Importam funcția de raportare a performanței web

const root = ReactDOM.createRoot(document.getElementById("root"));

// Randăm componenta <App /> în interiorul unui StrictMode pentru a detecta probleme potențiale
root.render(
 
    <App />
 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

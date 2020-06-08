import React from "react";
import "./styles.css";
import logo from "../../assets/svg/logo.svg";

const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="Ecoleta logo"></img>
        </header>
        <main>
          <h1>Seu marketplace de coleta de residuos</h1>
          <p>Ajudamos pessoas a encontrarem pontos de coleta</p>
        </main>
      </div>
    </div>
  );
};

export default Home;

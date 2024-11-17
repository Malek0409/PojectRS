import React, { useContext } from "react";
import Log from "../components/log/index";
import { UidContext } from "../components/AppContext";

const Profil = () => {
  const uid = useContext(UidContext);

  return (
    <div className="profil-page">
      {uid ? (
        <h1>UPDATE PAGE</h1>
      ) : (
        <div className="log-container">
          <Log />
          <dix className="img-container">
            <img src="./img/log.svg" alt="img-log" />
          </dix>
        </div>
      )}
    </div>
  );
};

export default Profil;

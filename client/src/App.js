import React, { useEffect, useState } from "react";
import Routes from "../src/components/Routes";
import { UidContext } from "./components/AppContext";
import axios from "axios";

function App() {
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}jwtid`, {
          withCredentials: true,
        });
        setUid(res.data);
      } catch (err) {
        console.error(`${err} : no token`);
      }
    };

    fetchToken();
  }, []);

  return (
    <UidContext.Provider value={uid}>
      <Routes />
    </UidContext.Provider>
  );
}

export default App;

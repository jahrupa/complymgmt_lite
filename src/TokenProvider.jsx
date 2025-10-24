// tokenContext.js
import { createContext, useContext, useState } from "react";

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  //  console.log(token,'token in provider');
  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);




// tokenContext.js
// import { createContext, useContext, useState } from "react";

// export const TokenContext = createContext();

// export const TokenProvider = ({ children }) => {
//   const [token, setToken] = useState(null);
//   return (
//     <TokenContext.Provider value={{ token, setToken }}>
//       {children}
//     </TokenContext.Provider>
//   );
// };




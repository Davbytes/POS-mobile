import { createContext, useContext, useState } from 'react';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);
  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}

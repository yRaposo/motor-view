import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import PrivateRoutes from './screens/routes/PrivateRoutes';

export default function App() {
  return (
     <NavigationContainer>
        <Routes />
      </NavigationContainer>
  );
}

function Routes() {
  // const { token } = useContext(AuthContext); // Access token from context
  return <PrivateRoutes />; // Conditional rendering based on token
}
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NetInfoProvider } from './contexts/NetInfoContext.tsx';  // Importando o provider

import HomeScreen from './screens/HomeScreen'; // Tela inicial
import LoadingScreen from './screens/LoadingScreen'; // Tela de carregamento
import DestinationPointScreen from './screens/DestinationPointScreen';
import ScannerScreen from './screens/ScannerScreen';
import StartRouteSreen from './screens/StartRouteScreen';
import BeforeScanner from './screens/BeforeScanner.tsx';

const Stack = createStackNavigator();

export type RootStackParamList = {
  Home: undefined; // A tela "Home" não aceita parâmetros
  DestinationPoint: undefined; // A tela "DestinationPoint" não aceita parâmetros
  Scanner: undefined;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula o carregamento, como uma chamada a uma API ou inicialização
    const timer = setTimeout(() => {
      setIsLoading(false); // Define que o carregamento terminou
    }, 3000); // Tempo de carregamento em milissegundos (3 segundos)

    return () => clearTimeout(timer); // Limpa o timer quando o componente desmonta
  }, []);

  if (isLoading) {
    return <LoadingScreen />; // Exibe a tela de carregamento enquanto carrega
  }

  return (
    // Envolvendo a navegação com o NetInfoProvider
    <NetInfoProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DestinationPoint"
            component={DestinationPointScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Scanner"
            component={ScannerScreen}
            options={{ title: 'Scanner' }}
          />
          <Stack.Screen
            name="StartRoute"
            component={StartRouteSreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BeforeScanner"
            component={BeforeScanner}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NetInfoProvider>
  );
}

export default App;

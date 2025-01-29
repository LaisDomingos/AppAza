import React, { createContext, useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

// Tipo para o contexto
export const NetInfoContext = createContext({
  isConnected: true,
  checkConnection: () => {},
});

export const NetInfoProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // Garante que o valor seja sempre booleano
      setIsConnected(state.isConnected ?? true);  // Usa `true` como fallback para `null`
    });

    return () => unsubscribe(); // Limpa o ouvinte quando o componente for desmontado
  }, []);

  const checkConnection = () => {
    console.log(isConnected ? 'Conectado' : 'Desconectado');
  };

  return (
    <NetInfoContext.Provider value={{ isConnected, checkConnection }}>
      {children}
    </NetInfoContext.Provider>
  );
};

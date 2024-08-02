import React, { useEffect } from 'react';
import { useGlobalState } from './GlobalStateContext';
import { Storage } from '../storage';

const WebSocketComponent = () => {
  const { globalState, setGlobalState } = useGlobalState();

  useEffect(() => {
    const socket = new WebSocket(`ws://${process.env.REACT_APP_GATEWAT_WBEBSOCKT_HOST}:${process.env.REACT_APP_GATEWAT_WBEBSOCKT_PORT}`);

    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.onmessage = (event) => {
      console.log(event);
      const data = JSON.parse(event.data);
      switch (data.event) {
        case 'plus_wave_bluetooth_list':
          console.log(data.data);
          setGlobalState((prevState: Storage) => ({
            ...prevState,
            plusWave: {
              ...prevState.plusWave,
              bluetooth: data.data
            }
          }));
          break;
        case 'plus_wave_bluetooth_connected':
          setGlobalState((prevState: Storage) => ({
            ...prevState,
            plusWave: {
              ...prevState.plusWave,
              connect: data.data
            }
          }));
          break;
        default:
          console.log(data.event);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup WebSocket on unmount or dependencies change
    return () => {
      socket.close();
    };
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div></div>
  );
};

export default WebSocketComponent;

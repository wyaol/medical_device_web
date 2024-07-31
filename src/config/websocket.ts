import storage from "../storage";


// const socket = new WebSocket(`ws://${process.env.GATEWAT_WBEBSOCKT_HOST}:${process.env.GATEWAT_WBEBSOCKT_PORT}`);
const socket = new WebSocket(`ws://127.0.0.1:8765`);
socket.onopen = () => {
  console.log('WebSocket connection opened');
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  switch (data.event) {
    case 'plus_wave_bluetooth_list':
      storage.plusWave.bluetooth = data.data;
      break;
    case 'plus_wave_bluetooth_connected':
      storage.plusWave.connect = data.data;
      break;
    default:
      console.log(data.event)
  }
};

socket.onclose = () => {
  console.log('WebSocket connection closed');
};

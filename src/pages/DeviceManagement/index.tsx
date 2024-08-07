import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Space, Spin, Tag, Alert } from 'antd';
import storage from '../../storage';
import request from '../../config/request';
import { AxiosResponse } from 'axios';
import { useGlobalState } from '../../config/GlobalStateContext';
import { connectPlusWaveDevice, startDataCollector, stopDataCollector } from '../../service/plusWaveService';

const DeviceManagement: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [bluetooth, setBluetooth] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { globalState, setGlobalState } = useGlobalState();

  useEffect(() => {
    setBluetooth(globalState.plusWave.bluetooth);
    setConnected(globalState.plusWave.connect.success);
  }, [])

  useEffect(() => {
    setBluetooth(globalState.plusWave.bluetooth);
    setLoading(false);
  }, [
    globalState.plusWave.bluetooth
  ])

  useEffect(() => {
    if (storage.plusWave.connect.message !== '') {
      alert(globalState.plusWave.connect.message)
    } else {
      setConnected(globalState.plusWave.connect.success);
    }
    setConnectLoading(false);
  }, [
    globalState.plusWave.connect
  ])

  const scanBluetooth = () => {
    setLoading(true);
    setError(null);
    request.post(`/plus_wave/devices/${storage.deviceId}/scan_bluetooth`)
      .then((res: AxiosResponse<any>) => {
        if (res.status !== 200) {
          throw new Error('Scan failed');
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const connect = (address: string) => {
    setConnectLoading(true);
    connectPlusWaveDevice(storage.deviceId, address).catch((err: any) => {
        setConnectLoading(false);
        setError(err.message);
      });
  };

  const start = () => {
    startDataCollector(storage.deviceId).then(() => {
      console.log('start');
    })
  }

  const stop = () => {
    stopDataCollector(storage.deviceId).then(() => {
      console.log('stop');
    })
  }

  return (
    <div style={{ padding: '24px', background: '#fff' }}>
      <Row gutter={16}>
        <Col span={24}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Button type="primary" onClick={scanBluetooth} loading={loading}>
              扫描
            </Button>
            {loading && <Spin size="large" />}
            {error && <Alert message="错误" description={error} type="error" showIcon />}
            <Card title="设备状态" bordered={false}>
              <div>
                连接状态: <Tag color={connected ? 'green' : 'red'}>{connected ? '已连接' : '未连接'}</Tag>
              </div>
            </Card>
            <Card title="蓝牙设备" bordered={false}>
              {bluetooth.length > 0 ? (
                bluetooth.filter(item => item.name).map((item, index) => (
                  <Card key={index} style={{ marginBottom: '16px' }}>
                    <Row align="middle" gutter={16}>
                      <Col flex="auto">
                        <strong>{item.name}</strong>
                      </Col>
                      <Col>
                        <Button type="primary" onClick={() => connect(item.address)} loading={connectLoading}>
                          连接
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                ))
              ) : (
                <div>未发现蓝牙设备</div>
              )}
            </Card>
            <Button type="primary" onClick={start} loading={loading}>
              开始采集数据
            </Button>

            <Button type="primary" onClick={stop} loading={loading}>
              停止采集数据
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default DeviceManagement;

import { Button, Card, message, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useGlobalState } from '../../config/GlobalStateContext';
import { bindPatient, getAllPatient } from '../../service/plusWaveService';
import { getCurrentPatient } from '../../utils';

const { Option } = Select;

const PatientSelect = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const [patients, setPatients] = useState<Record<string, any>[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    // 加载所有病人列表
    fetchPatients();
    setPatientInfo(getCurrentPatient());
  }, []);

  const fetchPatients = async () => {
    try {
      // 发送 GET 请求获取所有病人列表
      const patients = await getAllPatient();

      // 更新病人列表状态
      setPatients(patients);
    } catch (error) {
      console.error('Error:', error);
      message.error('获取病人列表失败！');
    }
  };

  const handlePatientSelect = (patient_id: string) => {
    setSelectedPatient(patient_id);
  };

  const handleSelectPatient = async () => {
    if (!selectedPatient) {
      message.error('请选择一个病人！');
      return;
    }

    try {
      const patient = await bindPatient(selectedPatient, globalState.deviceId);
      // 处理成功响应
      setPatientInfo(patient);
      message.success('选择病人成功！');
    } catch (error) {
      // 处理错误情况
      console.error('Error:', error);
      message.error('选择病人失败！');
    }
  };

  return (
    <div>
      <Select
        style={{ width: 200, marginRight: 16 }}
        placeholder="请选择病人"
        onChange={handlePatientSelect}
      >
        {patients.map((patient) => (
          <Option key={patient.patient_id} value={patient.patient_id}>
            {patient.name}
          </Option>
        ))}
      </Select>
      <Button type="primary" onClick={handleSelectPatient}>
        确定选择
      </Button>
      <div style={{ marginTop: '20px' }}>
        {patientInfo ? (
          <Card title="选中病人信息">
            <p>ID: {patientInfo.patient_id}</p>
            <p>姓名: {patientInfo.name}</p>
            <p>性别: {patientInfo.sex}</p>
            <p>年龄: {patientInfo.age}</p>
            <p>身高: {patientInfo.height}</p>
            <p>体重: {patientInfo.weight}</p>
          </Card>
        ) : (
          <Card title="选中病人信息">
            <p>病人未绑定</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PatientSelect;

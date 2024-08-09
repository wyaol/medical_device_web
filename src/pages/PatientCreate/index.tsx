import { Button, Form, Input, message } from 'antd';
import { createPatient } from '../../service/plusWaveService';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};

const PatientCreate = () => {
    const onFinish = async (values: any) => {
        try {
            // 构建需要发送的病人数据对象
            const patientData = {
                patient_id: values.patient_id,
                sex: values.sex,
                name: values.name,
                height: parseFloat(values.height),
                age: parseInt(values.age),
                weight: parseFloat(values.weight),
            };

            // 发送 POST 请求
            await createPatient(patientData)

            message.success('病人创建成功！');

            // 清空表单字段
            form.resetFields();
        } catch (error) {
            // 处理错误情况
            console.error('Error:', error);
            message.error('病人创建失败！');
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const [form] = Form.useForm();

    return (
        <Form
            {...layout}
            form={form}
            name="createPatientForm"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="ID"
                name="patient_id"
                rules={[{ required: true, message: '请输入病人ID!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="性别"
                name="sex"
                rules={[{ required: true, message: '请输入性别!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="姓名"
                name="name"
                rules={[{ required: true, message: '请输入姓名!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="身高"
                name="height"
                rules={[{ required: true, message: '请输入身高!' }]}
            >
                <Input type="number" step="0.01" />
            </Form.Item>

            <Form.Item
                label="年龄"
                name="age"
                rules={[{ required: true, message: '请输入年龄!' }]}
            >
                <Input type="number" />
            </Form.Item>

            <Form.Item
                label="体重"
                name="weight"
                rules={[{ required: true, message: '请输入体重!' }]}
            >
                <Input type="number" step="0.01" />
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
                <Button type="primary" htmlType="submit">
                    创建病人
                </Button>
            </Form.Item>
        </Form>
    );
};

export default PatientCreate;

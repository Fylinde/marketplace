import React from 'react';
import { Form, Input, Button } from 'antd';
import warehouseService from '../../services/warehouseService';
import { getLocalizedText } from '../../utils/localizationUtils';

interface WarehouseFormProps {
  initialValues?: { id?: string; name: string; location: string };
  onFinish: () => void;
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({ initialValues, onFinish }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: { name: string; location: string }) => {
    try {
      if (initialValues?.id) {
        await warehouseService.updateWarehouse({ id: initialValues.id, ...values });
      } else {
        await warehouseService.addWarehouse(values);
      }
      onFinish();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues || { name: '', location: '' }}
      onFinish={handleSubmit}
    >
      <Form.Item
        label={getLocalizedText('Warehouse Name', 'returnAndRefund')}
        name="name"
        rules={[{ required: true, message: getLocalizedText('Warehouse name is required', 'returnAndRefund') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={getLocalizedText('Location', 'returnAndRefund')}
        name="location"
        rules={[{ required: true, message: getLocalizedText('Location is required', 'returnAndRefund') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {getLocalizedText('Save', 'returnAndRefund')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default WarehouseForm;

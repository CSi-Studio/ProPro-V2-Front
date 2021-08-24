import React from 'react';
import { ProFormText, ModalForm } from '@ant-design/pro-form';
import { Space } from 'antd';
import { Tag } from 'antd';

export type FormValueType = {
  name?: string;
};

export type DeleteFormProps = {
  onSubmit: (value: FormValueType) => Promise<void>;
  onCancel: () => void;
  delete2ModalVisible: boolean;
  values: FormValueType;
  form: any;
  currentRow: any;
};

const DeleteForm: React.FC<DeleteFormProps> = (props) => {
  return (
    <ModalForm
      form={props.form}
      title="你确定要删除吗？"
      width={530}
      visible={props.delete2ModalVisible}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          props.onCancel();
        },
      }}
      onFinish={props.onSubmit}
    >
      <Space direction="vertical" style={{ textAlign: 'center', width: '100%' }}>
        <div style={{ marginTop: '24px' }}>
          请输入
          <Tag
            style={{
              margin: ' 0 2px',
              padding: '0 2px',
              fontSize: '14px',
              display: 'inline',
            }}
            color="red"
          >
            我要删除IRT
          </Tag>
          以确认删除。
        </div>
        <ProFormText
          rules={[
            {
              required: true,
              message: '请输入我要删除IRT',
            },
          ]}
          width="sm"
          name="name"
          placeholder="请输入我要删除IRT"
        />
      </Space>
    </ModalForm>
  );
};

export default DeleteForm;

import { Form, message, Tag, Tooltip } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { addList, proteinList } from './service';
import type { TableListItem, TableListPagination } from './data';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import { Icon } from '@iconify/react';
import { CheckCircleOutlined, CloseCircleOutlined, LinkOutlined } from '@ant-design/icons';

/**
 * 添加库
 */
const handleAdd = async (values: any) => {
  const hide = message.loading('正在添加');
  try {
    await addList(values);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
const TableList: React.FC = (props: any) => {
  /** 全选 */
  const [selectedRows, setSelectedRows] = useState<TableListItem[]>([]);
  const [total, setTotal] = useState<any>();
  const [formCreate] = Form.useForm();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '标识符',
      dataIndex: 'identifier',
      render: (dom) => {
        return (
          <Tooltip title={dom} placement="topLeft">
            {/* <div
              style={{
                width: '150px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            > */}
            {dom}
            {/* </div> */}
          </Tooltip>
        );
      },
    },
    {
      title: '审核与否',
      dataIndex: 'reviewed',
      hideInSearch: true,
      render: (dom, entity) => {
        return entity.reviewed ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            已审核
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            未审核
          </Tag>
        );
      },
    },
    {
      title: '蛋白质名称',
      dataIndex: 'names',
      hideInSearch: true,
      render: (dom) => {
        return (
          <Tooltip title={dom} placement="topLeft">
            <div
              style={{
                width: '150px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {dom}
            </div>
          </Tooltip>
        );
      },
    },

    {
      title: '基因',
      dataIndex: 'gene',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <>
            <Tag>{dom}</Tag>
          </>
        );
      },
    },
    {
      title: '序列号',
      dataIndex: 'sequence',
      hideInSearch: true,
      render: (dom) => {
        return (
          <Tooltip title={dom} placement="topLeft">
            <div
              style={{
                width: '300px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {dom}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: '有机生物',
      dataIndex: 'organism',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              console.log(entity);
            }}
          >
            <Tag color="geekblue">{dom}</Tag>
          </a>
        );
      },
    },
    {
      title: '更多',
      dataIndex: 'link',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <>
            <a href={entity?.uniProtLink} target="_blank">
              <Tag icon={<LinkOutlined />} color="blue">
                UniProt
              </Tag>
            </a>
            <a href={entity?.alphaFoldLink} target="_blank">
              <Tag icon={<LinkOutlined />} color="blue">
                alphaFold
              </Tag>
            </a>
          </>
        );
      },
    },
  ];

  /* 点击行选中相关 */
  const selectRow = (record: any) => {
    const rowData = [...selectedRows];
    if (rowData.length == 0) {
      rowData.push(record);
      setSelectedRows(rowData);
    } else {
      if (rowData.indexOf(record) >= 0) {
        rowData.splice(rowData.indexOf(record), 1);
      } else {
        rowData.push(record);
      }
      setSelectedRows(rowData);
    }
  };
  return (
    <>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        size="small"
        headerTitle={
          props?.location?.state?.libraryName === undefined
            ? '蛋白列表'
            : props?.location?.state?.libraryName
        }
        actionRef={actionRef}
        rowKey="id"
        tableAlertRender={false}
        request={async (params) => {
          const msg = await proteinList({ ...params });
          setTotal(msg.totalNum);
          return Promise.resolve(msg);
        }}
        columns={columns}
        pagination={{
          total: total,
        }}
        toolBarRender={() => [
          <a key="add">
            <Tag
              color="green"
              onClick={() => {
                formCreate?.resetFields();
                handleModalVisible(true);
              }}
            >
              <Icon
                style={{ verticalAlign: 'middle', fontSize: '20px' }}
                icon="mdi:playlist-plus"
              />
              导入蛋白库
            </Tag>
          </a>,
        ]}
        onRow={(record, index) => {
          return {
            onClick: () => {
              selectRow(record);
            },
          };
        }}
        rowSelection={{
          selectedRowKeys: selectedRows?.map((item) => {
            return item.id;
          }),
          onChange: (_, selectedRowKeys) => {
            setSelectedRows(selectedRowKeys);
          },
        }}
      />
      {/* 添加列表 */}
      <CreateForm
        form={formCreate}
        onCancel={() => {
          handleModalVisible(false);
          formCreate?.resetFields();
        }}
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        createModalVisible={createModalVisible}
      />
    </>
  );
};

export default TableList;

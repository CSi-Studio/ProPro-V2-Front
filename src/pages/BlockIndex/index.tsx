import { Tooltip } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { blockIndexList } from './service';
import type { TableListDetail, TableListItem, TableListPagination } from './data';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import DetailForm from './components/DetailForm';
import { Link } from 'umi';

const TableList: React.FC = (props) => {
  /** 全局弹窗 */
  // const [popup, setPopup] = useState<boolean>(false);
  /** 全选 */
  // const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>();

  const [idRow, setRowId] = useState<any>();
  const [detaileRow, setDetailRow] = useState<TableListDetail>();

  const actionRef = useRef<ActionType>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const { expId } = props?.location?.query.expId;
  console.log(props?.location);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'level',
      dataIndex: 'level',
    },
    {
      title: '文件开始位置',
      dataIndex: 'startPtr',
    },
    {
      title: '文件结束位置',
      dataIndex: 'endPtr',
    },
    {
      title: 'range',
      dataIndex: 'range',
    },
    {
      title: '操作',
      valueType: 'option',
      copyable: true,
      width: 100,
      ellipsis: true,
      fixed: 'right',
      render: (text, record) => [
        <Tooltip title={'详情'} key="detail">
          <a
            onClick={() => {
              setRowId(record.id);
              setShowDetail(true);
            }}
            key="detail"
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-document" />
          </a>
        </Tooltip>,
      ],
    },
  ];

  const columnsNew = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '实验Id',
      dataIndex: 'expId',
    },
    {
      title: '等级',
      dataIndex: 'level',
    },
    {
      title: 'startPtr',
      dataIndex: 'startPtr',
    },
    {
      title: 'endPtr',
      dataIndex: 'endPtr',
    },
  ];

  return (
    <>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle=""
        actionRef={actionRef}
        rowKey="id"
        size="small"
        toolBarRender={() => [
          <Tooltip title={'blockIndex'} key="blockIndex">
            <Link
              to={{
                pathname: '/experiment/list',
                search: `?projectId=${props?.location?.state?.projectId}`,
              }}
            >
              返回实验列表
            </Link>
          </Tooltip>,
        ]}
        request={async (params) => {
          console.log(expId);

          const msg = await blockIndexList({ expId, ...params });
          return Promise.resolve(msg);
        }}
        columns={columns}
        rowSelection={
          {
            // onChange: (_, selectedRows) => {
            // setSelectedRows(selectedRows);
            // },
          }
        }
      />

      {/* 列表详情 */}
      <DetailForm
        showDetail={showDetail}
        currentRow={idRow}
        columns={columnsNew}
        onClose={() => {
          setDetailRow(undefined);
          setShowDetail(false);
        }}
      />
    </>
  );
};

export default TableList;

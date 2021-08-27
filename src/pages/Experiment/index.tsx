import { Tag, Tooltip, Form, Button, message } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { experimentList, analyze, prepare } from './service';
import type { AnalyzeParams, PrepareAnalyzeVO, TableListItem, TableListPagination } from './data';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Icon } from '@iconify/react';
import DetailForm from './components/DetailForm';
import AnalyzeForm from './components/AnalyzeForm';
import { Link } from 'umi';

const TableList: React.FC = (props: any) => {
  const [formAnalyze] = Form.useForm();
  /* 分析窗口变量 */
  const [analyzeModalVisible, handleAnalyzeModalVisible] = useState<boolean>(false);
  /** 全选 */
  const [selectedRows, setSelectedRows] = useState<TableListItem[]>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  /** 库详情的抽屉 */
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [total, setTotal] = useState<any>();
  const actionRef = useRef<ActionType>();

  const [prepareData, setPrepareData] = useState<PrepareAnalyzeVO>();
  const projectId = props?.location?.query.projectId;

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '实验名',
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <Tooltip title={'Id:' + entity.id} placement="topLeft">
            <a
              onClick={() => {
                setCurrentRow(entity);
                setShowDetail(true);
              }}
            >
              {dom}
            </a>
          </Tooltip>
        );
      },
    },
    {
      title: 'ExpId',
      dataIndex: 'id',
      hideInTable: true,
      render: (dom) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      hideInSearch: true,
      render: (dom) => {
        return <Tag color="green">{dom}</Tag>;
      },
    },
    {
      title: 'OverView数目',
      dataIndex: 'id',
      hideInSearch: true,
      render: (dom,entity) => {
        return <Link
        to={{
          pathname: '/overView',
          state: {projectId:projectId, expId: entity.id },
        }}
      >
        <Tag color="green">查看</Tag>
      </Link>
      },
    },
    {
      title: 'Aird : Vendor(MB)',
      dataIndex: 'fileSize',
      hideInSearch: true,
      render: (dom, entity) => {
        const airdSize = (entity.airdSize + entity.airdIndexSize) / 1024 / 1024;
        const vendorSize = entity.vendorFileSize / 1024 / 1024;
        const deltaRatio = (((vendorSize - airdSize) / vendorSize) * 100).toFixed(1) + '%';

        return (
          <>
            <Tag color="blue">{airdSize.toFixed(0)}</Tag>
            <Tag color="blue">{vendorSize.toFixed(0)}</Tag>
            <Tag color="green">{deltaRatio}</Tag>
          </>
        );
      },
    },
    {
      title: 'SWATH窗口',
      dataIndex: 'windowRanges',
      render: (dom, entity) => {
        if (entity?.windowRanges) {
          return (
            <>
              <Tag color="blue">{entity?.windowRanges.length}</Tag>
              <Link
                to={{
                  pathname: '/blockIndex',
                  search: `?expId=${entity.id}`,

                  state: { projectId, expName: entity.name },
                }}
              >
                <Tag color="green">查看</Tag>
              </Link>
            </>
          );
        }
        return false;
      },
    },
    {
      title: 'IRT校验结果',
      dataIndex: 'irt',
      render: (dom, entity) => {
        if (entity.irt) {
          return <Tag color="green">{entity.irt.si.formula}</Tag>;
        } else {
          return <Tag color="red">未分析</Tag>;
        }
      },
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      hideInSearch: true,
      render: (dom, entity) => [
        <Tooltip title={'详情'} key="detail">
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
            key="edit"
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:file-document" />
          </a>
        </Tooltip>,
        <Tooltip title={'blockIndex'} key="blockIndex">
          <Link
            to={{
              pathname: '/blockIndex',
              search: `?expId=${entity.id}`,
              state: { projectId, expName: entity.name },
            }}
          >
            <Icon
              style={{ verticalAlign: 'middle', fontSize: '20px' }}
              icon="mdi:format-line-spacing"
            />
          </Link>
        </Tooltip>,
      ],
    },
  ];
  return (
    <>
      <div style={{ background: '#FFF' }}>
        <Link
          to={{
            pathname: '/project/list',
          }}
        >
          <Tag color="blue" style={{ margin: '0 0 0 30px' }}>
            <Icon style={{ verticalAlign: '-4px', fontSize: '16px' }} icon="mdi:content-copy" />
            返回项目列表
          </Tag>
        </Link>
      </div>
      <ProTable<TableListItem, TableListPagination>
        scroll={{ x: 'max-content' }}
        headerTitle={
          props?.location?.state?.projectName === undefined
            ? '实验列表'
            : '项目名称：' + props?.location?.state?.projectName
        }
        actionRef={actionRef}
        search={{ labelWidth: 'auto' }}
        rowKey="id"
        size="small"
        pagination={{
          pageSize: 50,
        }}
        tableAlertRender={false}
        // request={experimentList}
        request={async (params) => {
          const result = await prepare(projectId);
          if (result.success) {
            setPrepareData(result.data);
          }
          const msg = await experimentList({ projectId, ...params });
          setTotal(msg.totalNum);
          return Promise.resolve(msg);
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              if (selectedRows && selectedRows.length > 0) {
                handleAnalyzeModalVisible(true);
              }
            }}
          >
            <Icon style={{ verticalAlign: 'middle', fontSize: '20px' }} icon="mdi:playlist-plus" />
            开始分析
          </Button>,
          <Button type="primary" key="primary">
            {selectedRows && selectedRows.length > 0 ? (
              <Link
                to={{
                  pathname: '/irt/list',
                  search: `?expList=${selectedRows?.map((item) => {
                    return item.id;
                  })}`,
                  state: { projectId, expNum: selectedRows.length },
                }}
              >
                <Icon
                  style={{ verticalAlign: 'middle', fontSize: '20px' }}
                  icon="mdi:playlist-plus"
                />
                查看IRT
              </Link>
            ) : (
              <a
                onClick={() => {
                  message.warn('至少选择一个实验 🔬');
                }}
              >
                <Icon
                  style={{ verticalAlign: 'middle', fontSize: '20px' }}
                  icon="mdi:playlist-plus"
                />
                查看IRT
              </a>
            )}
          </Button>,
        ]}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      {selectedRows && selectedRows.length ? (
        <AnalyzeForm
          form={formAnalyze}
          onCancel={() => {
            handleAnalyzeModalVisible(false);
            formAnalyze?.resetFields();
          }}
          onSubmit={async (value: AnalyzeParams) => {
            value.expIdList = selectedRows.map((e) => e.id);
            value.projectId = projectId;
            const success = await analyze(value);
            if (success) {
              handleAnalyzeModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          analyzeModalVisible={analyzeModalVisible}
          values={{ expNum: selectedRows.length, prepareData: prepareData }}
        />
      ) : null}

      {/* 列表详情 */}
      <DetailForm
        showDetail={showDetail}
        currentRow={currentRow}
        columns={columns}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
      />
    </>
  );
};

export default TableList;

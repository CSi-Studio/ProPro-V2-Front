import React, { useEffect, useState } from 'react';
import { Drawer, Tabs, Tag, Typography } from 'antd';
import type { TableListDetail } from '../data';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import { blockIndexDetail } from '../service';
import ChartsForm from './DetailChartsForm';
import { FormattedMessage } from 'umi';

export type UpdateFormProps = {
  showDetail: any;
  currentRow: any;
  columns: any;
  onClose: () => void;
  runNameRow: any;
};
const { TabPane } = Tabs;
const { Text } = Typography;
const DetailForm: React.FC<UpdateFormProps> = (props) => {
  const [reqData, setReqData] = useState<any>([]);
  const [rtsClass, setRtsClass] = useState<any>([]);
  const [showCharts, setShowCharts] = useState<boolean>(false);
  const [blockIndexId, setBlockIndexId] = useState<any>();
  const [rtData, setRtData] = useState<any>();

  useEffect(() => {
    if (props.currentRow) {
      const getData = async () => {
        try {
          const data = await blockIndexDetail({ id: props.currentRow });
          setReqData(data.data);

          return true;
        } catch (error) {
          return false;
        }
      };
      getData();
    }
  }, [props]);
  useEffect(() => {
    const rtsData: any = [];
    reqData?.rts?.forEach((item: number) => {
      const page = Math.floor(item / 500);
      if (!rtsData[page]) {
        rtsData[page] = [];
      }
      rtsData[page].push(item);
    });
    setRtsClass(rtsData);
  }, [reqData]);
  const columns = [
    {
      title: <FormattedMessage id="component.projectId" />,
      dataIndex: 'id',
      render: (dom: any) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: <FormattedMessage id="component.runId" />,
      dataIndex: 'runId',
      render: (dom: any) => {
        return <Tag>{dom}</Tag>;
      },
    },
    {
      title: <FormattedMessage id="component.level" />,
      dataIndex: 'level',
    },
    {
      title: <FormattedMessage id="table.mzRange" />,
      dataIndex: 'range',
      render: (dom: any, entity: any) => {
        if (entity.range) {
          return (
            <span>
              {entity?.range?.start} ~ {entity?.range?.end}
            </span>
          );
        }
        return false;
      },
    },
    {
      title: <FormattedMessage id="table.startPtr" />,
      dataIndex: 'startPtr',
    },
    {
      title: <FormattedMessage id="table.endPtr" />,
      dataIndex: 'endPtr',
    },
  ];

  return (
    <Drawer width={900} visible={props.showDetail} onClose={props.onClose} closable={false}>
      <ProDescriptions<TableListDetail>
        column={2}
        title={props.runNameRow}
        dataSource={reqData}
        params={{
          id: props.currentRow,
        }}
        columns={columns as ProDescriptionsItemProps<TableListDetail>[]}
      />
      <Text>
        <FormattedMessage id="component.rtRange" />：
      </Text>
      {rtsClass.length > 0 && (
        <Tabs type="card" tabBarGutter={1} tabPosition="left" defaultActiveKey="0">
          {rtsClass.map((item: any, index: any) => {
            return (
              <TabPane
                tab={`${parseInt(item[0], 10)}-${parseInt(item.slice(-1), 10)}`}
                key={index.toString()}
              >
                {item.map((_item: any) => {
                  return (
                    <Tag
                      style={{ width: '75px', textAlign: 'center' }}
                      onClick={() => {
                        setBlockIndexId(props?.currentRow);
                        setRtData(_item);
                        setShowCharts(true);
                      }}
                      key={_item.toString()}
                    >
                      {_item}
                    </Tag>
                  );
                })}
              </TabPane>
            );
          })}
        </Tabs>
      )}
      <ChartsForm
        onCancel={() => {
          setShowCharts(false);
          setBlockIndexId(null);
          setRtData(null);
        }}
        onSubmit={async () => {
          setShowCharts(false);
          setBlockIndexId(null);
          setRtData(null);
        }}
        rtData={rtData}
        blockIndexId={blockIndexId}
        showCharts={showCharts}
      />
    </Drawer>
  );
};

export default DetailForm;

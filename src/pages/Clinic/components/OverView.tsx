import React, { useState } from 'react';
import { Col, Row, Tag } from 'antd';
import ProTable from '@ant-design/pro-table';
import { FormattedMessage } from 'umi';

export type OverViewProps = {
  values: any;
};

const OverView: React.FC<OverViewProps> = (props: any) => {

  const [ovRowKey, setOvRowKey] = useState<any>();
  const { prepareData, expData } = props.values;

  let scoreResult: any[] = expData.map((item: any) => {
    return item?.scoreList?.map((_item: any, index: any) => ({
      expId: item.expId,
      alias: item.alias,
      status: item.status,
      realRt: _item.rt,
      nearestRt: _item.nearestRt,
      ions50: _item.ions50,
      sum: _item.intensitySum,
      minTotalScore: item.minTotalScore,
      index,
      key: _item.rt,
      selectIndex: item.selectIndex,
      scoreList: item?.scoreList,
    }));
  });
  scoreResult = [].concat(...scoreResult); // 拍平数组
  const pageSize: number = scoreResult.length;

  /* 打分结果Columns */
  let scoreColumns: any = [
    {
      title: <FormattedMessage id="table.alias" />,
      dataIndex: 'alias',
      key: 'alias',
      fixed: 'left',
      width: 50,
      render: (dom: any, entity: any) => {
        if (entity?.index === entity?.selectIndex) {
          return <Tag color="#87d068">{dom}</Tag>;
        }
        return <Tag color="blue">{dom}</Tag>;
      },
    },
    {
      title: <FormattedMessage id="component.identStatus" />,
      dataIndex: 'status',
      key: 'status',
      fixed: 'left',
      width: 70,
      render: (dom: any, entity: any) => {
        if (entity?.index === entity?.selectIndex) {
          switch (entity?.status) {
            case 0:
              return (
                <Tag color="blue">
                  <FormattedMessage id="component.noIdentify" />
                </Tag>
              );
              break;
            case 1:
              return (
                <Tag color="success">
                  <FormattedMessage id="component.successIdentify" />
                </Tag>
              );
              break;
            case 2:
              return (
                <Tag color="error">
                  <FormattedMessage id="component.failIdentify" />
                </Tag>
              );
              break;
            case 3:
              return (
                <Tag color="warning">
                  <FormattedMessage id="component.notEnoughIdentify" />
                </Tag>
              );
              break;
            case 4:
              return (
                <Tag color="warning">
                  <FormattedMessage id="component.lackOfPeakGroup" />
                </Tag>
              );
              break;
            case 5:
              return (
                <Tag color="warning">
                  <FormattedMessage id="component.noEIC" />
                </Tag>
              );
              break;
            default:
              return (
                <Tag color="warning">
                  <FormattedMessage id="component.unknownError" />
                </Tag>
              );
              break;
          }
        }
        if (entity?.scoreList[entity?.index]?.scores[0] >= entity?.minTotalScore) {
          return (
            <Tag color="success">
              <FormattedMessage id="component.successIdentify" />
            </Tag>
          );
        }
        return (
          <Tag color="error">
            <FormattedMessage id="component.failIdentify" />
          </Tag>
        );
      },
    },
    {
      title: 'Ions50',
      dataIndex: 'ions50',
      key: 'ions50',
      fixed: 'left',
      width: 50,
      render: (dom: any, entity: any) => {
        // console.log('entity', entity);
        return <Tag color="blue">{entity?.ions50}</Tag>;
      },
    },
    {
      title: 'RealRT',
      dataIndex: 'realRt',
      key: 'realRt',
      width: 70,
      fixed: 'left',
      render: (dom: any, entity: any) => {
        return <Tag color="blue">{entity?.realRt?.toFixed(1)}</Tag>;
      },
    },
    {
      title: 'NearRT',
      dataIndex: 'nearestRt',
      key: 'nearestRt',
      width: 70,
      fixed: 'left',
      render: (dom: any, entity: any) => {
        return <Tag color="blue">{entity?.nearestRt?.toFixed(1)}</Tag>;
      },
    },
    {
      title: 'Sum',
      dataIndex: 'sum',
      key: 'sum',
      fixed: 'left',
      width: 70,
      render: (dom: any, entity: any) => {
        return <Tag color="blue">{entity?.sum?.toFixed(0)}</Tag>;
      },
    },
    {
      title: <FormattedMessage id="component.minTotalScore" />,
      dataIndex: 'minTotalScore',
      key: 'minTotalScore',
      width: 70,
      fixed: 'left',
      render: (dom: any, entity: any) => {
        return <Tag color="blue">{entity?.minTotalScore?.toFixed(3)}</Tag>;
      },
    },
  ];

  if (prepareData) {
    const scoreColumn = prepareData.method.score.scoreTypes.map((type: string, index: number) => ({
      title: (value: { tooltip: any }) => {
        return index === 0 ? (
          <a
            style={{ width: '60px', display: 'inline-block' }}
            onClick={() => {
              setOvRowKey(value.tooltip);
            }}
          >
            0(
            <FormattedMessage id="component.totalScore" />)
          </a>
        ) : (
          <a
            style={{ width: '60px', display: 'inline-block' }}
            onClick={() => {
              setOvRowKey(value.tooltip);
            }}
          >
            {index}
          </a>
        );
      },
      dataIndex: index,
      key: index,
      width: 80,
      fixed: `${index === 0 ? 'left' : 'false'}`,
      tooltip: type,
      render: (dom: any, entity: any) => {
        if (
          entity?.selectIndex !== null &&
          entity?.scoreList !== null &&
          entity?.scoreList[entity?.selectIndex].scores[index] !== null &&
          entity?.scoreList[entity?.selectIndex].scores[index] !== 'NaN' &&
          prepareData.overviewMap[entity?.expId] != null &&
          prepareData.overviewMap[entity?.expId].length > 0
        ) {
          return (
            <>
              {index === 0 ? (
                <Tag
                  color={
                    entity?.scoreList[entity?.index]?.scores[index] > entity?.minTotalScore
                      ? 'green'
                      : 'blue'
                  }
                  key={entity?.scoreList[entity?.index]?.scores[index]?.toString()}
                >
                  {entity?.scoreList[entity?.index]?.scores[index]?.toFixed(3)}
                </Tag>
              ) : (
                <Tag key={entity?.scoreList[entity?.index]?.scores[index]?.toString()}>
                  {`${prepareData.overviewMap[entity?.expId][0]?.weights[type]?.toFixed(
                    3,
                  )}x${entity?.scoreList[entity?.index]?.scores[index]?.toFixed(2)}=${(
                    prepareData.overviewMap[entity?.expId][0]?.weights[type] *
                    entity?.scoreList[entity?.index]?.scores[index]
                  )?.toFixed(4)}`}
                </Tag>
              )}
            </>
          );
        }
        return <Tag color="red">NaN</Tag>;
      },
    }));
    scoreColumns.push(scoreColumn);
  }
  scoreColumns = [].concat(...scoreColumns); // 拍平数组

  return (
    <>
      <>
        <strong>Protein: </strong>
        <span style={{ userSelect: 'all' }}>{expData[0].proteins[0]}</span>
        &nbsp;&nbsp;
        <strong>Peptide</strong>: <span style={{ userSelect: 'all' }}>{expData[0].peptideRef}</span>
        &nbsp;&nbsp;
      </>
      <Row>
        <Col span={3.5}>
          <ProTable
            columns={[
              {
                title: 'Index',
                dataIndex: 'index',
                key: 'index',
              },
              {
                title: <FormattedMessage id="component.scoreType" />,
                dataIndex: 'type',
                key: 'type',
              },
            ]}
            dataSource={prepareData?.method.score.scoreTypes.map((name: any, index: number) => {
              return { index, type: name, key: name };
            })}
            rowKey={'key'}
            size="small"
            search={false}
            // scroll={{ x: 'max-content' }}
            toolBarRender={false}
            tableAlertRender={false}
            rowClassName={(record: any) => {
              return record.key === ovRowKey ? 'clinicTableBgc' : '';
            }}
            onRow={(record: any) => {
              return {
                onClick: () => {
                  setOvRowKey(record.key);
                },
              };
            }}
            pagination={{
              hideOnSinglePage: true,
              size: 'small',
              showSizeChanger: false,
              showQuickJumper: false,
              pageSize: 24,
              showTotal: () => null,
              position: ['bottomRight'],
            }}
          />
        </Col>
        <Col span={20}>
          <ProTable
            style={{ width: '69vw' }}
            columns={scoreColumns}
            dataSource={scoreResult}
            rowKey={'key'}
            size="small"
            search={false}
            scroll={{ x: 'max-content', y: 730 }}
            toolBarRender={false}
            tableAlertRender={false}
            pagination={{
              hideOnSinglePage: true,
              pageSize,
              size: 'small',
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default OverView;

import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getPeptideRatio } from '../service';
import { Col, Descriptions, Empty, Row, Spin, Tag } from 'antd';

export type QtChartsProps = {
  values: any[];
};

const QtCharts: React.FC<QtChartsProps> = (props: any) => {
  const [handleOption, setHandleOption] = useState({});
  const [ratioData, setRatioData] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const op = async () => {
      const result = await getPeptideRatio({ projectId: props.values });
      // const ecoliData: any[][] = [];
      const ecoliData = result.data.ecoli.map((data: { x: any; y: any }) => {
        return [data.x, data.y];
      });
      const humanData = result.data.human.map((data: { x: any; y: any }) => {
        return [data.x, data.y];
      });
      const yeastData = result.data.yeast.map((data: { x: any; y: any }) => {
        return [data.x, data.y];
      });
      setRatioData(result.data);
      setLoading(false);
      const option = {
        xAxis: {
          splitLine: {
            show: false,
          },
          scale: true,
          axisLabel: {
            color: '#000',
            show: true,
            fontFamily: 'Times New Roman,STSong',
            fontWeight: 'normal',
          },
          nameTextStyle: {
            color: '#000',
            fontSize: '16',
            fontWeight: 'bold',
            fontFamily: 'Times New Roman,STSong',
            align: 'left',
          },
        },
        yAxis: {
          splitLine: {
            show: false,
          },
          scale: true,
          axisLabel: {
            color: '#000',
            show: true,
            fontFamily: 'Times New Roman,STSong',
            fontWeight: 'normal',
          },
          nameTextStyle: {
            color: '#000',
            fontSize: '16',
            fontWeight: 'bold',
            fontFamily: 'Times New Roman,STSong',
            align: 'left',
          },
        },
        animation: false,
        toolbox: {
          feature: {
            restore: {},
            dataView: {},
            saveAsImage: {},
          },
        },
        dataZoom: { type: 'inside' },
        tooltip: {
          trigger: 'axis',
          textStyle: {
            color: '#000',
            fontSize: '14',
            fontWeight: 'normal',
            fontFamily: 'Times New Roman,STSong',
          },
        },
        legend: {
          right: '8%',
          // width: '700px',
          // type: 'scroll',
          // icon: 'none',
          // itemGap: 0,
          // itemWidth: 5,
          align: 'left',
          textStyle: {
            fontSize: '14',
            fontFamily: 'Times New Roman,STSong',
          },
        },
        series: [
          {
            type: 'scatter',
            name: 'ecoli',
            symbolSize: 7,
            color: 'tomato',
            data: ecoliData,
            markLine: {
              symbol: ['none', 'none'],
              animation: false,
              lineStyle: {
                type: 'dashed',
                color: '#333',
                width: 2,
              },
              emphasis: {
                lineStyle: {
                  type: 'dashed',
                  color: 'gold',
                  width: 3,
                },
              },
              tooltip: {
                // formatter: formula,
                axisPointer: {
                  label: {
                    fontFamily: 'Times New Roman,STSong',
                  },
                },
              },
              label: { show: false },
              data: [{ yAxis: result.data.ecoliAvg, name: '平均线' }],
            },
          },
          {
            type: 'scatter',
            name: 'human',
            symbolSize: 7,
            color: '#60B077',
            data: humanData,
            markLine: {
              symbol: ['none', 'none'],
              animation: false,
              lineStyle: {
                type: 'dashed',
                color: '#333',
                width: 2,
              },
              emphasis: {
                lineStyle: {
                  type: 'dashed',
                  color: 'gold',
                  width: 3,
                },
              },
              tooltip: {
                // formatter: formula,
                axisPointer: {
                  label: {
                    fontFamily: 'Times New Roman,STSong',
                  },
                },
              },
              label: { show: false },
              data: [{ yAxis: result.data.humanAvg, name: '平均线' }],
            },
          },
          {
            type: 'scatter',
            name: 'yeast',
            symbolSize: 7,
            color: '#1890ff',
            data: yeastData,
            markLine: {
              symbol: ['none', 'none'],
              animation: false,
              lineStyle: {
                type: 'dashed',
                color: '#333',
                width: 2,
              },
              emphasis: {
                lineStyle: {
                  type: 'dashed',
                  color: 'gold',
                  width: 3,
                },
              },
              tooltip: {
                // formatter: formula,
                axisPointer: {
                  label: {
                    fontFamily: 'Times New Roman,STSong',
                  },
                },
              },
              label: { show: false },
              data: [{ yAxis: result.data.yeastAvg, name: '平均线' }],
            },
          },
        ],
      };
      setHandleOption(option);
    };
    op();
  }, []);

  return (
    <Row>
      <Col span="3">
        <Spin spinning={loading}>
          <Descriptions title="yeast" column={1}>
            <Descriptions.Item label="yeastAvg">
              <Tag color="blue">{ratioData?.yeastAvg.toFixed(4)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="yeastCV">
              <Tag color="blue">{ratioData?.yeastCV.toFixed(4)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="yeastSD">
              <Tag color="blue">{ratioData?.yeastSD.toFixed(4)}</Tag>
            </Descriptions.Item>
          </Descriptions>
          <Descriptions title="human" column={1}>
            <Descriptions.Item label="humanAvg">
              <Tag color="blue">{ratioData?.humanAvg.toFixed(4)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="humanCV">
              <Tag color="blue">{ratioData?.humanCV.toFixed(4)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="humanSD">
              <Tag color="blue">{ratioData?.humanSD.toFixed(4)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="identifyNumA">
              <Tag color="blue">{ratioData?.identifyNumA}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="identifyNumB">
              <Tag color="blue">{ratioData?.identifyNumB}</Tag>
            </Descriptions.Item>
          </Descriptions>
          <Descriptions title="ecoli" column={1}>
            <Descriptions.Item label="ecoliAvg">
              <Tag color="blue">{ratioData?.ecoliAvg.toFixed(4)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="ecoliCV">
              <Tag color="blue">{ratioData?.ecoliCV.toFixed(4)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="ecoliSD">
              <Tag color="blue">{ratioData?.ecoliSD.toFixed(4)}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </Spin>
      </Col>
      <Col span="21">
        <Spin spinning={loading}>
          {!loading ? (
            <ReactECharts
              option={handleOption}
              style={{ width: `100%`, height: '700px' }}
              lazyUpdate={true}
            />
          ) : (
            <Empty
              description="正在加载中"
              style={{ padding: '10px', color: '#B0B8C1' }}
              imageStyle={{ padding: '20px 0 0 0', height: '140px' }}
            />
          )}
        </Spin>
      </Col>
    </Row>
  );
};

export default QtCharts;
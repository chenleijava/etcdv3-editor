import React, { useEffect, useState } from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Line } from '@ant-design/charts';
import { DatePicker, message, Pagination, Select } from 'antd';
import moment from 'moment';

interface WeightData {
  timestamp: string;
  sensor_id: string;
  weight: number;
  min_weight: number;
  max_weight: number;
  status: string;
  read_count: number;
}

interface SprayRateData {
  timestamp: string;
  sensor_id: string;
  collection_type: string;
  status: string;
  total_weight_change: number;
  spray_rate_tph: number;
  error_percentage: string;
}

interface ApiResponse {
  code: number;
  msg: string;
  data: WeightData[] | SprayRateData[] | null;
}

const ChartsDashboard: React.FC = () => {
  const [weightData, setWeightData] = useState<WeightData[]>([]);
  const [sprayRateData, setSprayRateData] = useState<SprayRateData[]>([]);
  const [timeRange, setTimeRange] = useState<[moment.Moment, moment.Moment]>([
    moment().subtract(1, 'hour'),
    moment(),
  ]);
  const [timePreset, setTimePreset] = useState<string>('1h');
  const [aggregate, setAggregate] = useState<string>('');
  const [weightPage, setWeightPage] = useState<number>(1);
  const [sprayRatePage, setSprayRatePage] = useState<number>(1);
  const pageSize = 1000;

  const timePresets = {
    '1h': 1 * 60 * 60 * 1000,
    '2h': 2 * 60 * 60 * 1000,
    '3h': 3 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '3d': 3 * 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
  };

  const fetchData = async (type: string, page: number) => {
    try {
      const [start, end] = timeRange;
      const startTime = start.toISOString();
      const endTime = end.toISOString();
      const url = `http://localhost:9898/api/${type}`;

      const requestBody = {
        startTime,
        endTime,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        aggregate: aggregate || undefined,
      };
      console.log(`${type} request body:`, requestBody);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON, but received: ${text.substring(0, 50)}...`);
      }

      const result: ApiResponse = await response.json();
      console.log(`${type} data received:`, result);

      if (result.code === 0 && Array.isArray(result.data)) {
        const formattedData = result.data.map((item) => ({
          ...item,
          timestamp: moment(item.timestamp, 'YYYY-MM-DD HH:mm:ss').toISOString(),
        }));
        if (type === 'weight') {
          setWeightData(formattedData as WeightData[]);
          console.log('Setting weight data:', formattedData);
        } else {
          setSprayRateData(formattedData as SprayRateData[]);
          console.log('Setting spray rate data:', formattedData);
        }
      } else {
        console.error(`${type} API error:`, result.msg || 'No data returned');
        message.error(`Failed to fetch ${type} data: ${result.msg || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      message.error(`Error fetching ${type} data: ${error.message}`);
    }
  };

  const fetchLatestData = async (type: string) => {
    try {
      const url = `http://localhost:9898/api/${type}`; // 修复 URL
      const requestBody = { latest: true };
      console.log(`${type} latest request body:`, requestBody);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON, but received: ${text.substring(0, 50)}...`);
      }

      const result: ApiResponse = await response.json();
      console.log(`${type} latest data received:`, result);

      if (result.code === 0 && Array.isArray(result.data)) {
        const formattedData = result.data.map((item) => ({
          ...item,
          timestamp: moment(item.timestamp, 'YYYY-MM-DD HH:mm:ss').toISOString(),
        }));
        if (type === 'weight') {
          setWeightData((prev) => {
            const newData = [...prev, ...(formattedData as WeightData[])].slice(-100);
            console.log('Updated weight data:', newData);
            return newData;
          });
        } else {
          setSprayRateData((prev) => {
            const newData = [...prev, ...(formattedData as SprayRateData[])].slice(-100);
            console.log('Updated spray rate data:', newData);
            return newData;
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching latest ${type} data:`, error);
      // 不显示错误消息，避免频繁弹窗
    }
  };

  useEffect(() => {
    fetchData('weight', weightPage);
    fetchData('sprayrate', sprayRatePage);
  }, [timeRange, timePreset, aggregate, weightPage, sprayRatePage]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchLatestData('weight');
      fetchLatestData('sprayrate');
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const handleTimePresetChange = (value: string) => {
    setTimePreset(value);
    const duration = timePresets[value as keyof typeof timePresets];
    setTimeRange([moment().subtract(duration, 'milliseconds'), moment()]);
    setWeightPage(1);
    setSprayRatePage(1);
  };

  const handleCustomRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setTimeRange([dates[0], dates[1]]);
      setWeightPage(1);
      setSprayRatePage(1);
    }
  };

  const handleAggregateChange = (value: string) => {
    setAggregate(value);
    setWeightPage(1);
    setSprayRatePage(1);
  };

  // 添加一个辅助函数来处理可能为空的值
  const formatValue = (value: any, unit: string = '') => {
    if (value === null || value === undefined) return '暂无数据';
    return `${value}${unit}`;
  };

  const weightConfig = {
    data: weightData,
    xField: 'timestamp',
    yField: 'weight',
    seriesField: 'sensor_id',
    xAxis: {
      type: 'time',
      label: { formatter: (text: string) => moment(text).format('HH:mm:ss') },
    },
    yAxis: { label: { formatter: (v: number) => `${v} t` } },
    interactions: [{ type: 'brush' }],
    tooltip: {
      customContent: (title: string, items: any[]) => {
        if (!items[0]) return title;
        const item = items[0]?.data || {};
        return `<div>
          ${title}<br/>
          重量: ${formatValue(items[0]?.value, ' t')}<br/>
          最小: ${formatValue(item.min_weight, ' t')}<br/>
          最大: ${formatValue(item.max_weight, ' t')}<br/>
          状态: ${formatValue(item.status)}<br/>
          记录数: ${formatValue(item.read_count)}
        </div>`;
      },
    },
  };

  const sprayRateConfig = {
    data: sprayRateData,
    xField: 'timestamp',
    yField: 'spray_rate_tph',
    seriesField: 'sensor_id',
    xAxis: {
      type: 'time',
      label: { formatter: (text: string) => moment(text).format('HH:mm:ss') },
    },
    yAxis: { label: { formatter: (v: number) => `${v} t/h` } },
    interactions: [{ type: 'brush' }],
    tooltip: {
      customContent: (title: string, items: any[]) => {
        if (!items[0]) return title;
        const item = items[0]?.data || {};
        return `<div>
          ${title}<br/>
          喷吹率: ${formatValue(items[0]?.value, ' tph')}<br/>
          总重量变化: ${formatValue(item.total_weight_change, ' t')}<br/>
          状态: ${formatValue(item.status)}<br/>
          误差: ${formatValue(item.error_percentage)}
        </div>`;
      },
    },
  };

  return (
    <PageContainer>
      <div style={{ padding: 24 }}>
        <ProCard
          title="数据监控仪表盘"
          extra={
            <>
              <Select
                value={timePreset}
                onChange={handleTimePresetChange}
                style={{ width: 120, marginRight: 8 }}
              >
                <Select.Option value="1h">1 小时</Select.Option>
                <Select.Option value="2h">2 小时</Select.Option>
                <Select.Option value="3h">3 小时</Select.Option>
                <Select.Option value="1d">1 天</Select.Option>
                <Select.Option value="3d">3 天</Select.Option>
                <Select.Option value="7d">7 天</Select.Option>
              </Select>
              <Select
                value={aggregate}
                onChange={handleAggregateChange}
                style={{ width: 120, marginRight: 8 }}
                placeholder="数据粒度"
              >
                <Select.Option value="">原始数据</Select.Option>
                <Select.Option value="minute">分钟</Select.Option>
                <Select.Option value="hour">小时</Select.Option>
              </Select>
              <DatePicker.RangePicker
                showTime
                value={timeRange}
                onChange={handleCustomRangeChange}
                style={{ marginRight: 8 }}
              />
            </>
          }
        >
          <ProCard
            title="罐重变化曲线 (t)"
            extra={
              <Pagination
                current={weightPage}
                pageSize={pageSize}
                total={(timePresets[timePreset as keyof typeof timePresets] / 10000) * pageSize}
                onChange={(page) => setWeightPage(page)}
                simple
              />
            }
            style={{ marginBottom: 16 }}
          >
            {weightData.length > 0 ? (
              <Line {...weightConfig} style={{ height: 300 }} />
            ) : (
              <div>暂无罐重数据</div>
            )}
          </ProCard>
          <ProCard
            title="实时喷吹率 (t/h)"
            extra={
              <Pagination
                current={sprayRatePage}
                pageSize={pageSize}
                total={(timePresets[timePreset as keyof typeof timePresets] / 1000) * pageSize}
                onChange={(page) => setSprayRatePage(page)}
                simple
              />
            }
          >
            {sprayRateData.length > 0 ? (
              <Line {...sprayRateConfig} style={{ height: 300 }} />
            ) : (
              <div>暂无喷吹率数据</div>
            )}
          </ProCard>
        </ProCard>
      </div>
    </PageContainer>
  );
};

export default ChartsDashboard;

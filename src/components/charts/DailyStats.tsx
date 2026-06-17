import ReactECharts from 'echarts-for-react';
import { dailyStatsList } from '@/data/mock/statsData';

const personTypeData = {
  dates: dailyStatsList.map((d) => d.date.slice(5)),
  parent: [58, 52, 0, 0, 62, 65, 38],
  guardian: [42, 38, 0, 0, 45, 48, 28],
  agent: [56, 52, 0, 0, 61, 62, 32],
  totals: dailyStatsList.map((d) => d.totalCases),
  avgTimes: dailyStatsList.map((d) => d.avgHandleTime),
};

export default function DailyStats() {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
    },
    legend: {
      data: ['父母', '监护人', '代理人', '办件总量', '平均时长(分)'],
      top: 0,
      textStyle: {
        fontSize: 12,
        color: '#64748b',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 40,
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: personTypeData.dates,
        axisPointer: {
          type: 'shadow',
        },
        axisLabel: {
          color: '#64748b',
          fontSize: 12,
        },
        axisLine: {
          lineStyle: {
            color: '#e2e8f0',
          },
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '办件量(件)',
        nameTextStyle: {
          color: '#94a3b8',
          fontSize: 12,
        },
        axisLabel: {
          color: '#64748b',
          fontSize: 12,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#f1f5f9',
            type: 'dashed',
          },
        },
      },
      {
        type: 'value',
        name: '时长(分钟)',
        nameTextStyle: {
          color: '#94a3b8',
          fontSize: 12,
        },
        axisLabel: {
          color: '#64748b',
          fontSize: 12,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '父母',
        type: 'bar',
        stack: 'total',
        barWidth: 24,
        emphasis: {
          focus: 'series',
        },
        itemStyle: {
          color: '#1677ff',
          borderRadius: [0, 0, 0, 0],
        },
        data: personTypeData.parent,
      },
      {
        name: '监护人',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series',
        },
        itemStyle: {
          color: '#52c41a',
        },
        data: personTypeData.guardian,
      },
      {
        name: '代理人',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series',
        },
        itemStyle: {
          color: '#722ed1',
          borderRadius: [4, 4, 0, 0],
        },
        data: personTypeData.agent,
      },
      {
        name: '办件总量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#1e40af',
        },
        itemStyle: {
          color: '#1e40af',
          borderColor: '#fff',
          borderWidth: 2,
        },
        data: personTypeData.totals,
      },
      {
        name: '平均时长(分)',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'diamond',
        symbolSize: 8,
        lineStyle: {
          width: 2,
          type: 'dashed',
          color: '#f59e0b',
        },
        itemStyle: {
          color: '#f59e0b',
          borderColor: '#fff',
          borderWidth: 2,
        },
        data: personTypeData.avgTimes,
      },
    ],
  };

  return (
    <div className="w-full">
      <ReactECharts
        option={option}
        style={{ height: 320, width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}

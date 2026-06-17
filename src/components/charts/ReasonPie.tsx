import ReactECharts from 'echarts-for-react';
import { returnReasonStats } from '@/data/mock/statsData';

export default function ReasonPie() {
  const data = returnReasonStats.map((r) => ({
    name: r.reason,
    value: r.count,
  }));

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}件 ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 10,
      textStyle: {
        fontSize: 12,
        color: '#475569',
      },
      formatter: (name: string) => {
        const item = data.find((d) => d.name === name);
        if (!item) return name;
        const percent = ((item.value / data.reduce((s, d) => s + d.value, 0)) * 100).toFixed(1);
        return `${name}  ${percent}%`;
      },
    },
    color: [
      '#ef4444',
      '#f97316',
      '#f59e0b',
      '#eab308',
      '#84cc16',
      '#22c55e',
      '#10b981',
      '#14b8a6',
    ],
    series: [
      {
        name: '退件原因',
        type: 'pie',
        radius: ['45%', '72%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{c}件',
          fontSize: 11,
          color: '#334155',
          lineHeight: 16,
        },
        labelLine: {
          show: true,
          length: 12,
          length2: 8,
          smooth: true,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
          },
          scale: true,
          scaleSize: 6,
        },
        data,
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

import ReactECharts from 'echarts-for-react';

export default function SankeyFlow() {
  const option = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: (params: any) => {
        if (params.dataType === 'edge') {
          return `${params.data.source} → ${params.data.target}<br/>流量: <b>${params.data.value}</b> 件`;
        }
        return `<b>${params.name}</b><br/>累计: ${params.value} 件`;
      },
    },
    series: [
      {
        type: 'sankey',
        layout: 'none',
        emphasis: {
          focus: 'adjacency',
        },
        nodeAlign: 'left',
        data: [
          { name: '叫号', itemStyle: { color: '#1677ff' } },
          { name: '建单', itemStyle: { color: '#52c41a' } },
          { name: '核验', itemStyle: { color: '#13c2c2' } },
          { name: '联办', itemStyle: { color: '#722ed1' } },
          { name: '补正/异常', itemStyle: { color: '#fa8c16' } },
          { name: '审批', itemStyle: { color: '#eb2f96' } },
          { name: '办结', itemStyle: { color: '#52c41a' } },
          { name: '归档', itemStyle: { color: '#8c8c8c' } },
        ],
        links: [
          { source: '叫号', target: '建单', value: 2856 },
          { source: '建单', target: '核验', value: 2800 },
          { source: '建单', target: '补正/异常', value: 56 },
          { source: '核验', target: '联办', value: 2450 },
          { source: '核验', target: '补正/异常', value: 210 },
          { source: '核验', target: '审批', value: 140 },
          { source: '联办', target: '补正/异常', value: 180 },
          { source: '联办', target: '审批', value: 2270 },
          { source: '补正/异常', target: '核验', value: 320 },
          { source: '补正/异常', target: '建单', value: 80 },
          { source: '审批', target: '办结', value: 2380 },
          { source: '审批', target: '补正/异常', value: 50 },
          { source: '办结', target: '归档', value: 2350 },
        ],
        lineStyle: {
          color: 'gradient',
          curveness: 0.5,
          opacity: 0.6,
        },
        label: {
          fontSize: 13,
          color: '#1e293b',
          fontWeight: 500,
        },
        nodeWidth: 20,
        nodeGap: 12,
        layoutIterations: 32,
      },
    ],
  };

  return (
    <div className="w-full">
      <ReactECharts
        option={option}
        style={{ height: 380, width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
}

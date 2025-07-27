import dynamic from 'next/dynamic'
import React from 'react'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const series = [
  {
    name: 'Profit',
    type: 'column',
    data: [44000, 55000, 41000, 67000, 22000, 43000, 55000]
  },
  {
    name: 'Expenses',
    type: 'line',
    data: [23000, 42000, 35000, 27000, 18000, 21000, 32000]
  }
]

const options = {
  chart: {
    height: 300,
    type: 'line',
    toolbar: { show: false },
    width: '100%'
  },
  stroke: {
    width: [0, 4]
  },
  title: {
    text: undefined
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [1]
  },
  labels: ['월', '화', '수', '목', '금', '토', '일'],
  xaxis: {
    type: 'category'
  },
  yaxis: [
    {
      title: {
        text: 'Profit'
      }
    },
    {
      opposite: true,
      title: {
        text: 'Expenses'
      }
    }
  ],
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: { height: 220 }
      }
    }
  ]
}

export default function ProfitChart() {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <ReactApexChart options={options} series={series} type="line" height={300} width="100%" />
    </div>
  )
} 
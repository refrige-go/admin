import dynamic from 'next/dynamic'
import React from 'react'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const series = [
  {
    name: 'Earnings',
    data: [31, 40, 28, 51, 42, 109, 100]
  }
]

const options = {
  chart: {
    type: 'area',
    height: 100,
    sparkline: { enabled: true },
    toolbar: { show: false },
    width: '100%'
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  xaxis: {
    categories: ['월', '화', '수', '목', '금', '토', '일']
  },
  yaxis: {
    show: false
  },
  tooltip: {
    enabled: true
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: { height: 70 }
      }
    }
  ]
}

export default function EarningChart() {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <ReactApexChart options={options} series={series} type="area" height={100} width="100%" />
    </div>
  )
} 
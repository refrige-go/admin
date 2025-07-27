import dynamic from 'next/dynamic'
import React from 'react'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const series = [44, 55, 13, 43]
const options = {
  chart: {
    type: 'donut',
    height: 200,
    toolbar: { show: false },
    width: '100%'
  },
  labels: ['Organic', 'Referral', 'Social', 'Direct'],
  legend: {
    position: 'bottom'
  },
  dataLabels: {
    enabled: false
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: { height: 150 }
      }
    }
  ]
}

export default function TrafficChart() {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <ReactApexChart options={options} series={series} type="donut" height={200} width="100%" />
    </div>
  )
} 
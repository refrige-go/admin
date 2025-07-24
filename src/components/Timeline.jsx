'use client'

export default function Timeline() {
  const timelineItems = [
    {
      time: '9:30 am',
      title: 'Payment received',
      description: 'Payment received from John Doe of $385.90',
      type: 'payment',
    },
    {
      time: '10:00 am',
      title: 'New sale recorded',
      description: 'New sale recorded',
      type: 'sale',
      link: '#ML-3467',
    },
    {
      time: '12:00 am',
      title: 'Payment made',
      description: 'Payment was made of $64.95 to Michael',
      type: 'payment',
    },
    {
      time: '9:30 am',
      title: 'New sale recorded',
      description: 'New sale recorded',
      type: 'sale',
      link: '#ML-3467',
    },
    {
      time: '9:30 am',
      title: 'New arrival recorded',
      description: 'New arrival recorded',
      type: 'arrival',
    },
    {
      time: '12:00 am',
      title: 'Payment received',
      description: 'Payment received from John Doe of $385.90',
      type: 'payment',
    },
  ]

  const getBadgeColor = (type) => {
    switch (type) {
      case 'payment':
        return 'border-blue-600'
      case 'sale':
        return 'border-blue-300'
      case 'arrival':
        return 'border-green-500'
      default:
        return 'border-yellow-500'
    }
  }

  return (
    <ul className="timeline-widget relative">
      {timelineItems.map((item, index) => (
        <li key={index} className="timeline-item flex relative overflow-hidden min-h-[70px]">
          <div className="timeline-time text-gray-600 text-sm min-w-[90px] py-[6px] pr-4 text-end">
            {item.time}
          </div>
          <div className="timeline-badge-wrap flex flex-col items-center">
            <div className={`timeline-badge w-3 h-3 rounded-full shrink-0 bg-transparent border-2 ${getBadgeColor(item.type)} my-[10px]`}>
            </div>
            {index < timelineItems.length - 1 && (
              <div className="timeline-badge-border block h-full w-[1px] bg-gray-200"></div>
            )}
          </div>
          <div className="timeline-desc py-[6px] px-4">
            <p className="text-gray-600 text-sm font-normal">{item.description}</p>
            {item.link && (
              <a href="#" className="text-blue-600 text-sm hover:underline">
                {item.link}
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
} 
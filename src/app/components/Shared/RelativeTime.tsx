import React, { useEffect, useState } from 'react'

interface RelativeTimeProps {
  date: Date
}

const RelativeTime: React.FC<RelativeTimeProps> = ({ date }) => {
  const [, forceUpdate] = useState({})

  useEffect(() => {
    const timer = setInterval(() => forceUpdate({}), 60000)
    return () => clearInterval(timer)
  }, [])

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const diff = (date.getTime() - new Date().getTime()) / 1000
  const days = Math.round(diff / 86400)
  const hours = Math.round(diff / 3600)
  const minutes = Math.round(diff / 60)

  if (Math.abs(days) >= 1) return rtf.format(days, 'day')
  if (Math.abs(hours) >= 1) return rtf.format(hours, 'hour')
  return rtf.format(minutes, 'minute')
}

export default RelativeTime

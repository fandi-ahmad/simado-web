import React from 'react'

export const BadgeFormatFile = (props) => {
  const formatColors = {
    'pdf': 'bg-red-400',
    'docx': 'bg-blue-400',
    'xls': 'bg-green-500',
    'xlsx': 'bg-green-500',
    'csv': 'bg-green-500',
    'jpg': 'bg-yellow-500',
    'png': 'bg-yellow-500',
    'jpeg': 'bg-yellow-500'
  };

  // Mendapatkan kelas warna berdasarkan ekstensi file atau default ke abu-abu jika tidak ada yang cocok
  const badgeClass = formatColors[props.text] || 'bg-gray-500';

  return <div className={`badge ${badgeClass} font-thin text-white pb-1`}>{props.text}</div>
}

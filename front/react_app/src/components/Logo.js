import React from 'react'
import { BarChart2 } from 'react-feather'

export default function Logo() {
  return (
    <div className="text-white bg-dark px-2 rounded-1 fs-5 d-inline-flex align-items-center">
      <BarChart2 color="orange" size={20} style={{ transform: 'rotate(180deg)' }} /> Kanban
    </div>
  )
}

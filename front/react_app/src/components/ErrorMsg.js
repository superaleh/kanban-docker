import React from 'react'

export default function ErrorMsg({ message }) {
  return (
    <div className="alert alert-secondary" role="alert">
      {JSON.stringify(message)}
    </div>
  )
}

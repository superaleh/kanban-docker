import React, { useEffect, useState } from 'react'
import { Loader } from 'react-feather'
import { DragDropContext } from 'react-beautiful-dnd'

import {
  authAxios,
  backendUrl,
  onDragEndItem,
  onDragEndItemBackend,
} from 'utils'
import Column from 'components/Column'
import ErrorMsg from 'components/ErrorMsg'

export default function Kanban() {
  const [columns, setColumns] = useState([])
  const [errorMsg, setErrorMsg] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        const res = await authAxios.get(backendUrl + '/kanban/')
        if (mounted) {
          setColumns(res.data)
          setLoading(false)
        }
      } catch (error) {
        if (mounted) {
          setErrorMsg(error.message)
          setLoading(false)
        }
      }
    }
    fetchData()
    return () => {
      mounted = false
    }
  }, [])

  const createCard = ({ columnId, newCard }) => {
    const newColumns = columns.map((column) =>
      column.id === columnId
        ? { ...column, cards: [...column.cards, newCard] }
        : column
    )
    setColumns(newColumns)
  }

  const deleteCard = (cardId) => {
    const newColumns = columns.map((column) => {
      return {
        ...column,
        cards: column.cards.filter((card) => card.id !== cardId),
      }
    })
    setColumns(newColumns)
  }

  const editCard = (editCard) => {
    const newColumns = columns.map((column) => {
      return {
        ...column,
        cards: column.cards.map((card) =>
          card.id === editCard.id ? editCard : card
        ),
      }
    })
    setColumns(newColumns)
  }

  const onDragEnd = (result) => {
    onDragEndItem(columns, setColumns, result)
    onDragEndItemBackend(columns, result)
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Loader /> Загрузка...
      </div>
    )
  }

  return (
    <div className="px-4 mt-3">
      {errorMsg && <ErrorMsg message={errorMsg} />}
      <div className="row">
        <DragDropContext onDragEnd={onDragEnd}>
          {columns.map((col) => (
            <Column
              column={col}
              createCard={createCard}
              deleteCard={deleteCard}
              editCard={editCard}
              key={col.id}
            />
          ))}
        </DragDropContext>
      </div>
    </div>
  )
}

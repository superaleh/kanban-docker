import React, { useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { Droppable } from 'react-beautiful-dnd'
import { Edit2 } from 'react-feather'
import { authAxios, backendUrl } from 'utils'

export default function Column({ column, createCard, deleteCard, editCard }) {
  return (
    <div className="col-6 col-md-4 col-xl-3 col-xxl-2">
      <div className="card border-0">
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{ backgroundColor: '#' + column.color }}
        >
          <div>{column.title}</div>
          <div className="fs-4">{column.cards.length}</div>
        </div>
        <div className="card-body">
          <Droppable droppableId={column.id.toString()}>
            {(provided, snapshot) => {
              return (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {column.cards.map((card, index) => (
                    <Draggable
                      key={card.id}
                      draggableId={card.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => {
                        return (
                          <div
                            key={card.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                              padding: '0.25rem 0',
                            }}
                            {...provided.dragHandleProps}
                          >
                            <div className="p-2 bg-secondary rounded-1 border border-2 border-dark position-relative">
                              <Card
                                card={card}
                                deleteCard={deleteCard}
                                editCard={editCard}
                              />
                            </div>
                          </div>
                        )
                      }}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <AddCard columnId={column.id} createCard={createCard} />
                </div>
              )
            }}
          </Droppable>
        </div>
      </div>
    </div>
  )
}

function AddCard({ columnId, createCard }) {
  const [addingCard, setAddingCard] = useState(false)
  const [cardTitle, setCardTitle] = useState('')

  const onAddCard = async (e) => {
    e.preventDefault()
    if (cardTitle.trim() === '') return
    const { data: newCard } = await authAxios.post(
      `${backendUrl}/kanban/cards/`,
      {
        column: columnId,
        title: cardTitle,
      }
    )
    setAddingCard(false)
    setCardTitle('')
    createCard({ columnId, newCard })
  }

  const onAddingCard = (e) => {
    e.preventDefault()
    setAddingCard(true)
  }

  if (addingCard) {
    return (
      <div className="mt-1">
        <textarea
          value={cardTitle}
          onChange={(e) => setCardTitle(e.target.value)}
          className="form-control mb-2 border-dark"
          rows="2"
        />
        <div className="d-flex align-items-center">
          <button
            onClick={onAddCard}
            type="button"
            className="btn btn-success btn-sm"
          >
            Добавить карточку
          </button>
          <button
            onClick={() => setAddingCard(false)}
            type="button"
            className="btn-close ms-auto"
            aria-label="Отменить"
          />
        </div>
      </div>
    )
  } else {
    return (
      <button
        onClick={onAddingCard}
        type="button"
        className="btn btn-warning btn-sm mt-1"
      >
        Добавить карточку
      </button>
    )
  }
}

function Card({ card, deleteCard, editCard }) {
  const [cardTitle, setCardTitle] = useState(card.title)
  const [editing, setEditing] = useState(false)

  const onEditCard = async (e) => {
    e.preventDefault()
    if (cardTitle.trim() === '') return
    const { data } = await authAxios.put(
      `${backendUrl}/kanban/cards/${card.id}/`,
      {
        title: cardTitle,
        column: card.column,
      }
    )
    setEditing(false)
    editCard(data)
  }

  const onDelCard = async (e) => {
    e.preventDefault()
    await authAxios.delete(`${backendUrl}/kanban/cards/${card.id}/`)
    setEditing(false)
    deleteCard(card.id)
  }

  return (
    <div>
      {editing ? (
        <div>
          <textarea
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            className="form-control mb-2 border-0"
            rows="2"
          />
          <div className="d-flex align-items-center">
            <button
              onClick={onEditCard}
              type="button"
              className="btn btn-success btn-sm"
            >
              Редактировать
            </button>
            <button
              onClick={onDelCard}
              type="button"
              className="btn btn-secondary btn-sm ms-2"
            >
              Удалить
            </button>
            <button
              onClick={() => setEditing(false)}
              type="button"
              className="btn-close ms-auto"
              aria-label="Отменить"
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="text-light d-flex justify-content-between align-items-center">
            <div>
              <strong>id:</strong> {card.id}
            </div>
            <div
              onClick={() => setEditing(true)}
              className="link-light"
              style={{ cursor: 'pointer' }}
            >
              <Edit2 size={18} />
            </div>
          </div>
          <div className="text-white-50" style={{ whiteSpace: 'pre-wrap' }}>
            {card.title}
          </div>
        </div>
      )}
    </div>
  )
}

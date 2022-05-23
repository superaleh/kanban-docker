import axios from 'axios'

export const backendUrl = 'http://127.0.0.1/rest'

export const authAxios = axios.create()

authAxios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers['Authorization'] = 'JWT ' + accessToken
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

authAxios.interceptors.response.use(
  (response) => {
    return response
  },
  async function (error) {
    const originalRequest = error.config
    const refreshToken = localStorage.getItem('refreshToken')
    if (
      error.response.status === 401 &&
      refreshToken &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      try {
        const url = backendUrl + '/dj-rest-auth/token/refresh/'
        const { data: resData } = await axios.post(url, {
          refresh: refreshToken,
        })
        localStorage.setItem('accessToken', resData.access)
        const accessToken = localStorage.getItem('accessToken')
        authAxios.defaults.headers.common['Authorization'] =
          'JWT ' + accessToken
        return authAxios(originalRequest)
      } catch (error) {
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export const onDragEndItem = (columns, setColumns, result) => {
  const { source, destination, draggableId } = result
  if (!destination) return
  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  )
    return

  const sourceColumn = columns.find(
    (col) => col.id.toString() === source.droppableId
  )
  const card = sourceColumn.cards.find(
    (col) => col.id.toString() === draggableId
  )
  const destinationColumn = columns.find(
    (col) => col.id.toString() === destination.droppableId
  )

  const newCards = [...sourceColumn.cards]
  let newCards2
  if (source.droppableId === destination.droppableId) {
    newCards2 = newCards
  } else {
    newCards2 = [...destinationColumn.cards]
  }
  newCards.splice(source.index, 1)
  newCards2.splice(destination.index, 0, card)

  const newColumn = {
    ...sourceColumn,
    cards: newCards,
  }
  const newColumn2 = {
    ...destinationColumn,
    cards: newCards2,
  }

  const newColumns = columns.map((col) => {
    if (col.id === newColumn.id) return newColumn
    else if (col.id === newColumn2.id) return newColumn2
    return col
  })

  setColumns(newColumns)
}

export const onDragEndItemBackend = async (columns, result) => {
  const { source, destination, draggableId } = result
  if (!destination) return
  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  )
    return

  const sourceColumn = columns.find(
    (col) => col.id.toString() === source.droppableId
  )
  const card = sourceColumn.cards.find(
    (card) => card.id.toString() === draggableId
  )
  const destinationColumn = columns.find(
    (col) => col.id.toString() === destination.droppableId
  )

  const newOrder = getNewOrder(
    source.index,
    destination.index,
    destinationColumn.cards
  )
  await authAxios.put(`${backendUrl}/kanban/cards/${card.id}/`, {
    title: card.title,
    order: newOrder,
    column: destinationColumn.id,
  })
}

const getNewOrder = (sourceIndex, destinationIndex, arr) => {
  let newOrder
  if (destinationIndex === 0) {
    if (arr.length) newOrder = arr[0].order / 2
    else newOrder = 65535
  } else if (destinationIndex < arr.length - 1) {
    const isAdjacent = Math.abs(sourceIndex - destinationIndex) === 1
    const neighbourOneOrder = parseFloat(
      isAdjacent
        ? arr[destinationIndex - 1].order
        : arr[destinationIndex + 1].order
    )
    const neighbourTwoOrder = parseFloat(arr[destinationIndex].order)
    newOrder = (neighbourOneOrder + neighbourTwoOrder) / 2
  } else if (destinationIndex >= arr.length - 1)
    newOrder = parseFloat(arr[arr.length - 1].order) + 65535
  return newOrder.toFixed(15)
}

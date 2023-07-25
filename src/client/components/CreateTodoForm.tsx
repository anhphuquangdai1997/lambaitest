import { useState } from 'react'

import { api } from '@/utils/client/api'

export const CreateTodoForm = () => {
  const [todoBody, setTodoBody] = useState('')

  const apiContext = api.useContext()

  const { mutate: createTodo, isLoading: isCreatingTodo } =
    api.todo.create.useMutation({
      onSuccess: () => {
        apiContext.todo.getAll.refetch()
      },
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!todoBody.trim()) {
      return
    }
    createTodo({
      body: todoBody,
    })
    setTodoBody('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="group flex items-center justify-between rounded-12 border border-gray-200 py-2 pr-4 focus-within:border-gray-400"
    >
      <label htmlFor={TODO_INPUT_ID} className="sr-only">
        Add todo
      </label>

      <input
        id={TODO_INPUT_ID}
        type="text"
        placeholder="Add todo"
        value={todoBody}
        onChange={(e) => {
          setTodoBody(e.target.value)
        }}
        className="flex-1 px-4 text-base placeholder:text-gray-400 focus:outline-none"
      />

      <button
        className="flex items-center justify-center gap-2 rounded-full bg-gray-700 px-5 py-2 text-sm text-white hover:bg-gray-800 focus:outline-none"
        type="button"
        disabled={isCreatingTodo}
        onClick={() => {
          createTodo({
            body: todoBody,
          })
          setTodoBody('')
        }}
      >
        Add
      </button>
    </form>
  )
}

const TODO_INPUT_ID = 'todo-input-id'

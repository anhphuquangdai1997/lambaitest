import { type SVGProps } from 'react'

import * as Checkbox from '@radix-ui/react-checkbox'
import { useState } from 'react';
import { api } from '@/utils/client/api';

// interface Todo {
//   id: number;
//   title: string;
// }

export const TodoList = () => {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'completed' | 'pending'>('all');
  
  const { data: todos = [] } = api.todo.getAll.useQuery({
    statuses: ['completed', 'pending'],
  })
  
  const { mutate: deleteTodo } = api.todo.delete.useMutation();
  const handleDeleteTodo = (id: string) => {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      console.error("Invalid value for id:", id);
      return;
    }
    deleteTodo({ id: parsedId });
  };
  const handleItemClick = (id: string) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter(itemId => itemId !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filterType === 'completed') {
      return selectedItemIds.includes(todo.id.toString());
    } else if (filterType === 'pending') {
      return !selectedItemIds.includes(todo.id.toString());
    }
    return true;
  });

  return (
    <>
      <div className="flex pb-10 gap-2">
      <button
          className={`px-6 py-3 rounded-full text-sm ${
            filterType === 'all' ? 'bg-gray-700 text-white' : 'bg-white'
          }`}
          onClick={() => setFilterType('all')}
        >
          All
        </button>
        <button
          className={`px-6 py-3 rounded-full text-sm ${
            filterType === 'pending' ? 'bg-gray-700 text-white' : 'bg-white'
          }`}
          onClick={() => setFilterType('pending')}
        >
          Pending
        </button>
        <button
          className={`px-6 py-3 rounded-full text-sm ${
            filterType === 'completed' ? 'bg-gray-700 text-white' : 'bg-white'
          }`}
          onClick={() => setFilterType('completed')}
        >
          Completed
        </button>
      </div>
      <ul className="grid grid-cols-1 gap-y-3">
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <div className={`${selectedItemIds.includes(todo.id.toString())
                ? 'bg-gray-50':''} flex items-center rounded-12 border border-gray-200 px-4 py-3 shadow-sm`} 
                onClick={()=>handleItemClick(todo.id.toString())}
             
            >
              <Checkbox.Root
                id={String(todo.id)}
                className={`flex h-6 w-6 items-center justify-center rounded-6 border border-gray-300 focus:border-gray-700 focus:outline-none
                  ${
                    selectedItemIds.includes(todo.id.toString())
                      ? 'data-[state=checked] border-gray-700 bg-gray-700'
                      : ''
                  }
                `}
              >
                <Checkbox.Indicator>
                  {selectedItemIds.includes(todo.id.toString()) ? (
                    <CheckIcon className="h-4 w-4 text-white" />
                  ) : null}
                </Checkbox.Indicator>
              </Checkbox.Root>

              <label className={`block pl-3 font-medium ${selectedItemIds.includes(todo.id.toString()) ?'line-through' :''}`} htmlFor={String(todo.id)}>
                {todo.body}
              </label>
              <button
                className="flex items-center justify-center ml-auto py-1 bg-red-500 text-black text-sm"
                onClick={() => handleDeleteTodo(todo.id.toString())}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>

  )
}

const XMarkIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

const CheckIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  )
}

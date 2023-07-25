import { type SVGProps } from 'react'

import * as Checkbox from '@radix-ui/react-checkbox'
import { useState } from 'react';
import { api } from '@/utils/client/api';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import * as Tabs from '@radix-ui/react-tabs';

// interface Todo {
//   id: number;
//   title: string;
// }

export const TodoList = () => {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])
  const [filterType, setFilterType] = useState<'all' | 'completed' | 'pending'>('all')
  const { data: todos = [],refetch  } = api.todo.getAll.useQuery({
    statuses: ['completed', 'pending'],
  });
  const [parent, enableAnimations] = useAutoAnimate()

  const { mutate: deleteTodo } = api.todo.delete.useMutation();
  const handleDeleteTodo = async (id: string) => {
    const parsedId = parseInt(id);
    await deleteTodo({ id: parsedId });

    refetch();
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
       <Tabs.Root className="TabsRoot" defaultValue="tab1">
        <Tabs.List className="flex pb-10 gap-2" aria-label="Manage your account">
          <Tabs.Trigger className={` TabsTrigger px-6 py-3 rounded-full text-sm ${
            filterType === 'all' ? 'bg-gray-700 text-white' : 'bg-white'
          }`}
          onClick={() => setFilterType('all')} value="tab1">
            All
          </Tabs.Trigger>
          <Tabs.Trigger className={` TabsTrigger px-6 py-3 rounded-full text-sm ${
            filterType === 'pending' ? 'bg-gray-700 text-white' : 'bg-white'
          }`}
          onClick={() => setFilterType('pending')} value="tab2">
            Pending
          </Tabs.Trigger>
          <Tabs.Trigger className={` TabsTrigger px-6 py-3 rounded-full text-sm ${
            filterType === 'completed' ? 'bg-gray-700 text-white' : 'bg-white'
          }`}
          onClick={() => setFilterType('completed')} value="tab2">
            Completed
          </Tabs.Trigger>
        </Tabs.List>
        
        <Tabs.Content className="TabsContent" value="tab1">
          
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="tab2"></Tabs.Content>
        <Tabs.Content className="TabsContent" value="tab3"></Tabs.Content>
      </Tabs.Root>
      <ul className="grid grid-cols-1 gap-y-3" ref={parent}>
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
                onClick={() => handleDeleteTodo(todo.id)}
              >
                <XMarkIcon className="h-5 w-5" />
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

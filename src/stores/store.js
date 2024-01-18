import { ref, watch } from 'vue'

const todoList = ref(
  localStorage.getItem('todo-list') ? JSON.parse(localStorage.getItem('todo-list')) : []
)
const categoryList = ref(
  localStorage.getItem('category-list')
    ? JSON.parse(localStorage.getItem('category-list'))
    : [
        {
          id: 'default',
          name: '기본',
          isModifying: false
        }
      ]
)

/** Watcher를 통한 데이터 관리 */

watch(
  todoList,
  (newTodoList) => {
    localStorage.setItem('todo-list', JSON.stringify(newTodoList))
  },
  {
    deep: true
  }
)

watch(
  categoryList,
  (newCategoryList) => {
    localStorage.setItem('category-list', JSON.stringify(newCategoryList))
  },
  {
    deep: true
  }
)

/******************************/

/** TODO 관리 로직 */

export function getTodoList() {
  return todoList
}

export function getTodoListByCategory(categoryId) {
  const filteredTodoList = todoList.value
  return !categoryId
    ? filteredTodoList
    : filteredTodoList.filter((todo) => todo.categoryId === categoryId)
}

export function addTodo(newTodo) {
  todoList.value.push(newTodo)
}

export function deleteTodo(todoId) {
  todoList.value = todoList.value.filter((todo) => todo.id !== todoId)
}

export function deleteTodoByCategoryId(categoryId) {
  todoList.value = todoList.value.filter((todo) => todo.categoryId !== categoryId)
}

export function updateTodoList(newTodoList) {
  todoList.value = newTodoList
}

export function updateTodo(newTodo) {
  todoList.value.filter((todo) => (todo.id = newTodo.id))[0] = newTodo
}

/******************/

/** 카테고리 관리 로직 */

export function getCategoryList() {
  return categoryList
}

export function addCategory(newCategory) {
  categoryList.value.push(newCategory)
}

export function updateCategoryList(newCategoryList) {
  categoryList.value = newCategoryList
}

export function deleteCategory(categoryId) {
  /** 할일이 있는 경우에만 경고창 팝업 */
  if (todoList.value.filter((todo) => todo.categoryId === categoryId).length > 0) {
    var result = confirm(
      '카테고리를 삭제하게 된다면 포함되어있는 TODO가 모두 삭제됩니다. \n 그래도 삭제하시겠습니까?'
    )
    if (!result) return false
  }

  deleteTodoByCategoryId(categoryId)
  categoryList.value = categoryList.value.filter((category) => category.id !== categoryId)
  return true
}

/***********************/

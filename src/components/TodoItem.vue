<script setup>
import { ref, computed, watch } from 'vue'
import { addTodo, getTodoListByCategory, deleteTodo, getCategoryList, updateTodo } from '../stores/store'
import { useRoute } from 'vue-router';
import TodoCreator from './TodoCreator.vue';

const route = useRoute();

const filterId = ref("");
const searchKeyword = ref("");
const todoList = ref(getTodoListByCategory(filterId.value))
const categoryList = ref(getCategoryList())

const completedTodo = ref(todoList.value.filter(todo => todo.isCompleted))

const completedTodoRate = computed(() => {
  if(todoList.value.length === 0) return 100;
  return (completedTodo.value.length / todoList.value.length).toFixed(4) * 100
})

const dialog = ref(false)
const selectedTodo = ref({
  id: "",
  name: "",
  content: "",
  categoryId: "",
  createdTime: "",
  modifiedTime: "",
  isCompleted: false
})


watch(() => route.params.categoryId,
(newCategoryId)=> {
  filterId.value = newCategoryId;
  todoList.value = getTodoListByCategory(newCategoryId)
}); 

watch(searchKeyword, (newKeyword) => {
  if(!newKeyword) {
    todoList.value = getTodoListByCategory(filterId.value)
  } else {
    todoList.value = getTodoListByCategory(filterId.value).filter(todo => todo.name.indexOf(newKeyword) !== -1)
  }
}); 

watch(todoList, (newTodoList) => {
  completedTodo.value = getTodoListByCategory(filterId.value).filter(todo => todo.isCompleted)
})



const setTodoIsCompleted = (index) => {
  todoList.value[index].isCompleted = !todoList.value[index].isCompleted
  updateTodo(todoList.value[index]);
  todoList.value = getTodoListByCategory(filterId.value)
}

const createTodo = (newTodo) => {
  addTodo(newTodo);
  todoList.value = getTodoListByCategory(filterId.value)
}

const modifyTodo = (index) => {
  todoList.value[index] = selectedTodo.value
  dialog.value = false
}

const deleteTodoById = (todo) => {
  deleteTodo(todo);
  todoList.value = getTodoListByCategory(filterId.value)
}

const setSelectedTodo = (todo) => {
  selectedTodo.value.id = todo.id;
  selectedTodo.value.name = todo.name;
  selectedTodo.value.content = todo.content;
  selectedTodo.value.categoryId = todo.categoryId;
  selectedTodo.value.createdTime = todo.createdTime;
  selectedTodo.value.modifiedTime = todo.modifiedTime;
  selectedTodo.value.isCompleted = todo.isCompleted;
}

const getCategoryName = (categoryId) => {
  const categeoryName = categoryList.value.filter(category => category.id === categoryId)[0].name
  return categeoryName;
}
</script>

<template>

  <v-layout>
    <v-main>
    <br>
    <v-row no-gutters>
      <v-col cols="8">
        <v-sheet class="pa-2 ma-2">
          <v-expansion-panels>
            <v-expansion-panel
              v-for="(todo, index) in todoList" 
              :key=todo.id>
              <v-expansion-panel-title>
                <v-chip v-if="!filterId">{{ getCategoryName(todo.categoryId) }}</v-chip>
                <v-row no-gutters>
                  <v-col class="d-flex justify-start">
                    <div :class="{'text-decoration-line-through' : todo.isCompleted}">
                      
                      {{ todo.name }}
                    </div>
                  </v-col>
                </v-row>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row no-gutters>
                  <v-col>
                    {{ todo.content }}
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-dialog
                    v-model="dialog"
                    persistent
                    width="1024"
                  >
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-if="!todo.isCompleted"
                        variant="text"
                        @click="setTodoIsCompleted(index)"
                      >
                        확인
                      </v-btn>
                      
                      <v-btn
                        v-else
                        @click="setTodoIsCompleted(index)"
                      >
                        <v-icon
                          end
                          icon="mdi-checkbox-marked-circle"
                          color="light-green-lighten-1"
                        ></v-icon>
                      </v-btn>
                      <v-btn
                        color="primary"
                        v-bind="props"
                        @click="setSelectedTodo(todo)"
                      >
                        수정
                      </v-btn>
                    </template>
                    <!-- 여기서 부터 modal 로직 -->
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">todo 수정</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col
                              cols="12"
                              sm="6"
                              md="6"
                            >
                            <v-combobox
                                :items="categoryList"
                                item-title="name"
                                item-value="id"
                                label="카테고리"
                                persistent-hint
                                return-object
                                single-line
                                variant="solo-filled"
                                :model-value="getCategoryName(selectedTodo.categoryId)"
                            ></v-combobox>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="6"
                              md="6"
                            >
                              <v-text-field
                                label="할일 요약"
                                hint=""
                                v-model="selectedTodo.name"
                              >
                              </v-text-field>
                            </v-col>
                            <v-col
                              cols="12"
                              sm="12"
                              md="12"
                            >
                            <v-container fluid>
                              <v-textarea
                                clearable
                                clear-icon="mdi-close-circle"
                                label="상세 할일"
                                v-model="selectedTodo.content"
                              >
                              </v-textarea>
                            </v-container>
                            </v-col>
                          </v-row>
                        </v-container>
                        <small>*indicates required field</small>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="red"
                          variant="text"
                          @click="dialog = false"
                        >
                          닫기
                        </v-btn>
                        <v-btn
                          color="blue-darken-1"
                          variant="text"
                          @click="modifyTodo(index)"
                        >
                          저장
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-btn
                    variant="text"
                    color="red"
                    @click="deleteTodoById(todo.id)"
                  >
                    삭제
                  </v-btn>
                </v-card-actions>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-sheet>
      </v-col>

      <v-divider vertical></v-divider>

      <v-col cols="4">
        <div class="text-center">
          <v-sheet class="pa-2 ma-2">
            <v-progress-circular
              color="teal-darken-3"
              :model-value= completedTodoRate
              :size="100"
              :width="12"
            >
              <template v-slot:default> {{ completedTodoRate }} % </template>
            </v-progress-circular>
            
            <br>
            <br>
            <br>
            
            <v-row justify="center">
              <TodoCreator @create-todo="createTodo" />
            </v-row>
          </v-sheet>
        </div>
      </v-col>
    </v-row>

    
    <br>
    <br>
    <br>
    <hr>

    <v-card
      class="pa-4"
      flat
      img="https://cdn.vuetifyjs.com/images/toolbar/map.jpg"
    >
      <v-toolbar
        dense
        floating
      >
        <v-text-field
          hide-details
          prepend-icon="mdi-magnify"
          single-line
          v-model.lazy="searchKeyword"
        ></v-text-field>

        <v-btn icon>
          <v-icon>mdi-crosshairs-gps</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
    </v-main>
    </v-layout>
</template>

<style scoped>

</style>
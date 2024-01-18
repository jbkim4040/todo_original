<script setup>
    import { ref, defineEmits, watch } from 'vue'
    import { uid } from 'uid';
    import { useDate } from 'vuetify'
    import { getCategoryList } from '../stores/store'
    import TodoCalendar from './TodoCalendar.vue'

    const emit = defineEmits(["create-todo"]);

    const adapter = useDate()
    const dialog = ref(false)
    const categoryList = ref(getCategoryList())
    const category = ref("")
    const name = ref("")
    const content = ref("")

    const createTodo = () => {
        dialog.value = false

        const newTodo = {
            id: uid(),
            name: name.value,
            content: content.value,
            categoryId: category.value,
            createdTime: "",
            modifiedTime: "",
            isCompleted: false
        }

        emit('create-todo', newTodo)
        
        initParam();
    }

    const initParam = () => {
        name.value = "";
        content.value = "";
    }

    const setCategory = (event) => {
        category.value = event.id;
    }

    const allowedDates = (val) => {
        return val >= new Date();
    }
</script>

<template>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        width="1024"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            color="teal-darken-3"
            v-bind="props"
          >
            새로운 할 일
          </v-btn>
        </template>
        <!-- 여기서 부터 modal 로직 -->
        <v-card>
          <v-card-title>
            <span class="text-h5">새로운 할 일</span>
            <v-container>
                <v-row justify="space-around">
                <TodoCalendar />
                </v-row>
            </v-container>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
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
                    @update:modelValue="setCategory($event)"
                ></v-combobox>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="8"
                >
                  <v-text-field
                    v-model="name"
                    label="할일 요약"
                    hint=""
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="12"
                >
                <v-container fluid>
                    <v-textarea
                    clearable
                    v-model="content"
                    clear-icon="mdi-close-circle"
                    label="상세 할일"
                    ></v-textarea>
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
              @click="createTodo"
            >
              저장
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
</template>
<style>

</style>
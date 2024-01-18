<script setup>
import { ref } from 'vue'
import { addCategory, getCategoryList, deleteCategory } from '../stores/store'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { uid } from 'uid';

const router = useRouter();
const route = useRoute();

const categoryId = ref(1);
const categoryList = getCategoryList();
const selectedCategory = ref(route.params.categoryId);

const createCategory = () => {
  addCategory({
    id: uid(),
    name: "테스트" + categoryId.value++,
    isModifying: false
  });

  moveUrl("category" + categoryId.value);
}

const changeCategoryName = (event, category, index) => {
  const changedName = event.currentTarget.value
  if(!changedName.trim()) {
    alert("카테고리명에는 공백이 들어올 수 없습니다.")
    category.isModifying = false  
    return false;
  }
  categoryList.value[index].name = changedName;
  category.isModifying = false
}



const deleteCategoryById = (categoryId) => {
  console.log("selectedCategory.value :: ", route.params.categoryId)
  // if(deleteCategory(categoryId) && categoryId === route.params.categoryId ) {
  if(deleteCategory(categoryId)) {
    router.replace({ path: '/category' })
  }
}


const moveUrl = (categoryId) => {
  router.push({ path: "/category/" + categoryId })
}
</script>

<template>
  <div>
    <v-card>
      <v-tabs
        bg-color="teal-darken-3"
        show-arrows
        slider-color="teal-lighten-3"
      >
        <router-link :to="`/category`">
          <v-tab>
              전체
          </v-tab>
        </router-link>
        
        <v-tab
              v-for="(category, index) in categoryList"
              :key="category.id"
              :value="category.name"
              @click="moveUrl(category.id)"
            >
        <v-menu
          open-on-hover
        >
          <template v-slot:activator="{ props }">
              <router-link v-if="!category.isModifying" :to="`/category/${category.id}`" v-bind="props">
                {{ category.name }}
              </router-link>
              <input 
                v-else 
                type="text"
                variant="underlined" 
                :value="category.name" 
                @keypress.enter="changeCategoryName($event, category, index)" 
                @blur="changeCategoryName($event, category, index)"
              />
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title @click="category.isModifying = true">수정</v-list-item-title>
              <br>
              <v-list-item-title @click="deleteCategoryById(category.id)">삭제</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        </v-tab>
        <v-tab @click="createCategory">
            +
        </v-tab>
      </v-tabs>
    </v-card>
  </div>
</template>

<style scoped>
v-list-item {
  cursor: pointer;
}
</style>
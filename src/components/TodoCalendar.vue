<script setup>
import { ref } from 'vue'

const date =  ref((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10))
const modal = ref(false);

const dialog = ref(false);
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
            일자
          </v-btn>
        </template>
        <!-- 여기서 부터 modal 로직 -->
        <v-card>
          <v-card-title>
            <span class="text-h5">일자</span>
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
                  sm="12"
                  md="12"
                >
                <v-row justify="space-around">
                <v-date-picker
                    color="primary"
                    elevation="24"
                    :allowed-dates="allowedDates"
                ></v-date-picker>
                </v-row>
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
              @click="dialog = !dialog"
            >
              닫기
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="dialog = !dialog"
            >
              저장
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
</template>
<style scoped>

</style>
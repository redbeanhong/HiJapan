<template>
  <main class="main">
    <div class="container nav-padding">
      <div class="row mb-3 justify-content-end">
        <div class="col-4">
          <select
            class="form-select"
            aria-label="wordPage"
            v-model="page"
            @change="updatePage"
          >
            <option
              :value="pageIndex"
              v-for="pageIndex in Math.ceil(filterWords.length / 100)"
              :key="pageIndex"
            >
              {{ pageIndex }}
            </option>
          </select>
        </div>
      </div>

      <table class="table table-dark">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">拼音</th>
            <th scope="col">漢字</th>
            <th scope="col">意思</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(word, wordIndex) in currentWords" :key="wordIndex">
            <th scope="row">{{ wordIndex + 1 }}</th>
            <td>{{ word.spell }}</td>
            <td>{{ word.text }}</td>
            <td>{{ word.mean }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { words } from "@/assets/data/words.js";
let page = ref(1); // init page
let filterWords = ref([]); // 12 page
let currentWords = ref([]); // 100 row

onMounted(() => {
  init();
});

function init() {
  filterWords.value = words.filter((e) => e.text != ""); // 可能還要另外看 == ""的
  updatePage();
}

function updatePage() {
  const startIndex = (page.value - 1) * 100;
  const endIndex = page.value * 100 + 1;
  currentWords.value = filterWords.value.filter(
    (e, index) => index > startIndex && index < endIndex
  );
}
</script>

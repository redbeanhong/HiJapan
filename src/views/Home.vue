<template>
  <main class="main">
    <div class="container nav-padding">
      <div class="row mb-3 justify-content-end">
        <div class="col-12 col-lg-4 mb-3 mb-lg-0">
          <h4>單字頁數:</h4>
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
        <div class="col-12 col-lg-4">
          <h4>檢視模式:</h4>
          <select class="form-select" aria-label="wordMode" v-model="mode">
            <option :value="MODE_TYPE.TABLE">TABLE</option>
            <option :value="MODE_TYPE.CARD">CARD</option>
          </select>
        </div>
      </div>

      <table class="table table-dark" v-if="mode == MODE_TYPE.TABLE">
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

      <ul class="row" v-if="mode == MODE_TYPE.CARD">
        <li
          v-for="(word, wordIndex) in currentWords"
          :key="wordIndex"
          class="col-12 col-sm-6 col-lg-3"
        >
          <div
            class="cus-card card bg-dark border-light mb-4 text-light overflow-hidden"
          >
            <div class="card-header border-bottom border-light">
              <h2>
                {{ wordIndex + 1 }}.{{ word.spell }}
                <a href="#" @click.prevent="speakWord(word.text)"
                  ><i class="fa fa-volume-up" aria-hidden="true"></i
                ></a>
              </h2>
            </div>
            <div class="card-body position-relative">
              <div>
                <h5 class="card-title">{{ word.text }}</h5>
                <p class="card-text">
                  {{ word.mean }}
                </p>
              </div>

              <div class="answer-mask" v-if="!word.isShow">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="word.isShow = true"
                >
                  看答案
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </main>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { words } from "@/assets/data/words.js";
let MODE_TYPE = ref({
  TABLE: 0,
  CARD: 1,
});
let mode = ref(MODE_TYPE.value.CARD);
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
  const endIndex = page.value * 100;

  currentWords.value = filterWords.value
    .filter((_, index) => index >= startIndex && index < endIndex)
    .map((e) => {
      e.isShow = false;
      return e;
    });
}

function speakWord(wordToSpeak) {
  // 使用 Web Speech API
  if ("speechSynthesis" in window) {
    var synthesis = window.speechSynthesis;
    var utterance = new SpeechSynthesisUtterance(wordToSpeak);

    // 設定語言為日文
    utterance.lang = "ja-JP";

    // 設定速度為較慢，可調整這個值
    utterance.rate = 1;
    utterance.voice = speechSynthesis
      .getVoices()
      .find((voice) => voice.voiceURI === "Google 日本語");

    if (!utterance.voice) {
      utterance.voice = speechSynthesis;
    }

    // 設定音量為較大，可調整這個值
    utterance.volume = 1;
    synthesis.speak(utterance);
  } else {
    alert("抱歉，您的瀏覽器不支援語音合成功能。");
  }
}
</script>

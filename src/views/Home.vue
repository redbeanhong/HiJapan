<template>
  <main class="main">
    <div v-if="isSpeakerLoading" class="loading">
      <span
        class="spinner-border spinner-border"
        role="status"
        aria-hidden="true"
      ></span>
      <span class="text-light ms-3">Loading...</span>
    </div>
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
            <option :value="MODE_TYPE.TABLE">表格</option>
            <option :value="MODE_TYPE.CARD">單字卡</option>
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
            class="cus-card bg-dark mb-4 text-light"
            @click="word.isShow = !word.isShow"
            :class="{ flipped: word.isShow }"
          >
            <div
              class="cus-card-content card-front p-4 border border-light border-1 rounded"
            >
              <h2>
                {{ wordIndex + 1 }}.{{ word.spell }}
                <a
                  href="#"
                  @click.stop.prevent="speakWord(word.text)"
                  v-if="hasVoice"
                  ><i class="fa fa-volume-up" aria-hidden="true"></i
                ></a>
              </h2>
            </div>
            <div
              class="cus-card-content card-back p-4 border border-light border-1 rounded"
            >
              <h5 class="card-title mb-4">{{ word.text }}</h5>
              <p class="card-text">
                {{ word.mean }}
              </p>
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

let voices = [];
let utterance = new SpeechSynthesisUtterance();
let speaker = null;
let isSpeakerLoading = ref(true);
let hasVoice = ref(false);
onMounted(() => {
  init();
});

function init() {
  filterWords.value = words.filter((e) => e.text != ""); // 可能還要另外看 == ""的
  updatePage();
  initSpeaker();
}

async function initSpeaker() {
  try {
    if ("speechSynthesis" in window) {
      speaker = window.speechSynthesis;
      voices = await getVoices();
      let voiceIndex = voices.findIndex(
        (voice) => voice.voiceURI === "Google 日本語"
      );
      if (voices !== null && voices.length > 0) {
        if (voiceIndex == -1) voiceIndex = 0;
        utterance.voice = voices[voiceIndex];
        hasVoice.value = true;
      }

      // 設定語言為日文
      utterance.lang = "ja-JP";

      // 設定速度為較慢，可調整這個值
      utterance.rate = 0.8;

      // 設定音量為較大，可調整這個值
      utterance.volume = 1;
    }
  } catch (error) {
    alert(error);
  } finally {
    setTimeout(() => {
      isSpeakerLoading.value = false;
    }, 500);
  }
}
async function getVoices() {
  return new Promise((resolve, reject) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices.filter((e) => e.lang == "ja-JP"));
    } else {
      speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = speechSynthesis.getVoices();
        if (updatedVoices.length > 0) {
          resolve(updatedVoices.filter((e) => e.lang == "ja-JP"));
        }
      };
    }
  });
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
  utterance.text = wordToSpeak;
  speaker.speak(utterance);
}
</script>

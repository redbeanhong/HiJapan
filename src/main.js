import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import "./assets/scss/all.scss";
import "./assets/font-awesome-4.7.0/css/font-awesome.min.css";
import * as bootstrap from "bootstrap";
import Home from "./views/Home.vue";
const routes = [{ path: "/", component: Home }];

const router = createRouter({
  history: createWebHistory('/HiJapan/'),
  routes,
});

createApp(App).use(router).mount("#app");

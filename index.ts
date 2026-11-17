import { createRouter, createWebHistory } from "vue-router";
import Dolares from "../components/dolares.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Dolares
    }
  ]
});

export default router;
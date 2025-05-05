import { createRouter, createWebHistory } from "vue-router";
import CategoriesNew from "./categories.new/WlPage.vue";
import DefaultWallet from "./defaultWallet/WlPage.vue";
import GettingStarted from "./gettingStarted/WlPage.vue";
import { api } from "providers/api";

const routes = [
  {
    path: "/categories/new",
    name: "categoriesNew",
    component: CategoriesNew,
  },
  {
    path: "/default-wallet",
    name: "defaultWallet",
    component: DefaultWallet,
  },
  {
    path: "/getting-started",
    name: "gettingStarted",
    component: GettingStarted,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  if (await api.settings.isCreated()) {
    return true;
  }

  if (to.name === "gettingStarted") {
    return true;
  }

  return { name: "gettingStarted" };
});

router.beforeEach(async (to, from) => {
  if (await api.wallets.count()) {
    return true;
  }

  if (to.name === "defaultWallet") {
    return true;
  }

  if (from.name === "gettingStarted") {
    return true;
  }

  return { name: "defaultWallet" };
});

export default router;

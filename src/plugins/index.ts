import type { App } from "vue";

import vuetify from "./vuetify";
import pinia from "./pinia";

import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css";

export function registerPlugins(app: App) {
  app.use(vuetify)
    .use(pinia)
    .use(ToastPlugin);
}

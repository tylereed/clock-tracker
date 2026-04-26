import type { App } from "vue";

import vuetify from "./vuetify";
import pinia from "./pinia";

export function registerPlugins(app: App) {
  app.use(vuetify)
    .use(pinia);
}

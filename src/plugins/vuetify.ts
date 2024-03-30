/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { ThemeDefinition, createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          background: "#9CAFB7",
          surface: "#DCE2E5",
          "surface-lighten-1": "#E7ECEE",
          primary: "#0B6E4F",
          secondary: "#2C2A4A",
          error: "#890620",
          info: "#FCF0DA",
          success: "#20E9A9",
          warning: "#EEB244"
        },
      } as ThemeDefinition,
    },
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi
    }
  }
});

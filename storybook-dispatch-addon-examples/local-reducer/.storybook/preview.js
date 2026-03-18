import "../src/styles.css";

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "charcoal",
      values: [{ name: "charcoal", value: "#120f12" }],
    },
  },
};

export default preview;

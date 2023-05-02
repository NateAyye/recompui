module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-recompui`
  extends: ["recompui"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};

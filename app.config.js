const childProcess = require("child_process");

let commitHash = process.env.EAS_BUILD_COMMIT_HASH;

if (!commitHash) {
  try {
    commitHash = childProcess
      .execSync("git rev-parse --short HEAD")
      .toString()
      .trim();
  } catch (e) {
    commitHash = "dev";
  }
}

module.exports = {
  expo: {
    name: "gs-mobile-26",
    slug: "gs-mobile-26",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "gsmobile26",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router", "expo-secure-store"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      commitHash: commitHash,
    },
  },
};

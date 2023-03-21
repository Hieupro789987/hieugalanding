const dotenv = require("dotenv");
dotenv.config();

const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
// const withTM = require("next-transpile-modules");
// const { i18n } = require("./next-i18next.config");

module.exports = withPlugins(
  [
    [withBundleAnalyzer({})],
    // , [withTM(["lodash-es"])]
  ],
  {
    publicRuntimeConfig: {
      firebaseView: process.env.FIREBASE_VIEW,
      version: process.env.npm_package_version,
      domain: process.env.DOMAIN,
      url_google_play: process.env.URL_GOOGLE_PLAY,
      url_app_store: process.env.URL_APP_STORE,
    },
    swcMinify: true,
  }
);

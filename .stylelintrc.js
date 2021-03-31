module.exports = {
  "processors": [
    "stylelint-processor-styled-components"
  ],
  "plugins": ["stylelint-scss"],
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-recommended",
    "stylelint-config-styled-components"
  ],
  "ignoreFiles": ["node_modules/**", "dist", "build", "release.*"],
}

//import melindaConfig from "@natlibfi/eslint-config-melinda-frontend"


// Eslint configuration object for src
// - use imported ruleset for Melinda application frontend and
// - lint all .js files that are inside directory src 
const configSrc = {
  //melindaConfig,
  files: [
    "src/*"
  ],
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
  rules: {
    "no-console": "off",
    "no-plusplus": [
      "error",
      {
        "allowForLoopAfterthoughts": true
      }
    ],
    "array-callback-return": [
      "error",
      {
        "checkForEach": true
      }
    ],
    "no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "next"
      }
    ],
    "no-warning-comments": "off"
  }
}

// Eslint configuration object for globally ignoring .js files 
// - ignore all files that start with a dot
// - ignore all files inside directories named 'dist'
const configIgnores = {
  ignores: [
    "**/.*",
    "**/dist/"
  ]
}

export default [
  configSrc,
  configIgnores
];
// @ts-check
const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  root: true,
  extends: ['@pity/eslint-config-ts', '@pity/eslint-config-react'],
})

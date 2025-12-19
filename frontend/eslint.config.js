import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';


export default [
  eslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  prettierConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    rules: {
      'no-unused-vars': 'off', // Temporarily disable this rule
    },
  },
  {
    // Files to ignore
    ignores: ['dist/**', 'node_modules/**', 'pnpm-lock.yaml'],
  }
];

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import airbnbPlugin from 'eslint-config-airbnb';
import prettierPlugin from 'eslint-plugin-prettier';
import nodePlugin from 'eslint-plugin-node';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ['node_modules/', 'public/js/'],
  },
  {
    files: ['**/*.{js,ts}'],
    plugins: {
      airbnb: airbnbPlugin,
      prettier: prettierPlugin,
      node: nodePlugin,
      import: importPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'spaced-comment': 'off',
      'no-console': 'off',
      'consistent-return': 'off',
      'func-names': 'off',
      'object-shorthand': 'off',
      'no-process-exit': 'off',
      'no-param-reassign': 'off',
      'no-return-await': 'off',
      'no-underscore-dangle': 'off',
      'class-methods-use-this': 'off',
      'import/extensions': ['error', { js: 'never' }],
      'prefer-destructuring': ['error', { object: true, array: false }],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // '@typescript-eslint/no-unsafe-function-type': 'off',
      // 'no-unused-vars': ['error', { argsIgnorePattern: 'req|res|next|val' }],
    },
  },
]);

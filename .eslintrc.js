// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    'parser': 'babel-eslint'
  },
  env: {
    'browser': true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: ['vue'],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'semi': ['error', 'always'], //加分号不报错
    // 'quotes': ['error', 'double'], //单引号改成双引号
    'eol-last': 0,// 不检测新文件末尾是否存在空行
    'space-before-function-paren': 0,// 是否在函数左括号前加空格
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': [0, { "vars": "all", "args": "after-used" }] // 能有声明后未被使用的变量或参数
  }
};

module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    parserOptions: {
        ecmaVersion: 13,
        sourceType: 'module',
    },
    extends: ['eslint:recommended'],
    rules: {
        'max-len': ['error', { code: 50 }],
    },
    settings: {},
}

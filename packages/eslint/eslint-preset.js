module.exports = {
  extends: ['next', 'prettier'],
  settings: {
    next: {
      rootDir: [
        'apps/nextjs-auth-example/',
        'packages/auth/',
        'packages/eslint/',
        'packages/storage/',
        'packages/tsconfig/',
        'packages/types'
      ]
    }
  }
}

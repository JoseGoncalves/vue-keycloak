export default {
  input: 'dist-transpiled/index.js',
  output: [
    {
      dir: 'dist/',
      entryFileNames: '[name].mjs',
      format: 'es',
      sourcemap: true,
    },
    {
      dir: 'dist/',
      entryFileNames: '[name].cjs',
      format: 'cjs',
      generatedCode: {
        constBindings: true,
      },
      interop: 'compat',
      sourcemap: true,
    },
  ],
  external: ['keycloak-js', 'vue'],
}

export default {
  input: 'dist-transpiled/index.js',
  output: [
    {
      dir: 'dist/',
      entryFileNames: '[name].esm.js',
      chunkFileNames: '[name]-[hash].esm.js',
      format: 'es',
      sourcemap: true,
    },
    {
      dir: 'dist/',
      format: 'commonjs',
      generatedCode: {
        constBindings: true,
      },
      interop: 'compat',
      sourcemap: true,
    },
  ],
  external: ['keycloak-js', 'jwt-decode', 'vue'],
}

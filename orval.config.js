module.exports = {
  'agends-file': {
    input: './src/shared/http/schema.yaml',
    output: {
      mode: 'tag-split',
      target: './src/shared/http/http.ts',
      client: 'swr',
      baseUrl: 'http://localhost:8000',
      mock: true,
    },
  },
};

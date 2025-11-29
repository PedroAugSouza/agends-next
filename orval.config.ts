import 'dotenv/config';

export default {
  'agends-file': {
    input: './src/shared/http/schema.yaml',
    output: {
      mode: 'tag-split',
      target: './src/shared/http/http.ts',
      client: 'swr',
      baseUrl: process.env.API_BASE,
      mock: true,
    },
  },
};

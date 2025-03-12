import { resolve } from 'node:path';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // DockerとNode.jsサーバーで動作させるためにadapter-nodeを使用
    adapter: adapter({
      // Docker環境のパスに合わせた出力先
      out: 'build',
      precompress: true,
      envPrefix: 'VITE_',
    }),

    // パスエイリアスの設定
    alias: {
      '@shared': resolve('./..', 'shared'),
    },
  },
};

export default config;

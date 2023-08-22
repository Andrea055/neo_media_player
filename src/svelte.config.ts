const sveltePreprocess = require('svelte-preprocess');

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte'], 
    preprocess: sveltePreprocess()
};
module.exports = config;
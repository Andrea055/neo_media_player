import { writable } from 'svelte/store';

export const channel = writable({
  name: "",
  url: new URL('https://example.com')  // Just a mock
});

export const groups = writable([]);

export const channels = writable([]);
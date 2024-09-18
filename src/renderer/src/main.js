import './assets/main.css'
import '@fontsource/montserrat'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')
})

if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark')
}

export default app

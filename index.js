import LoaderComponent from './src/component.vue'

const Options = {
  theme: 'default',
  icon: { icon: ['fas', 'circle-notch'], size: '2x' },
  message: 'Loading...',
  delay: 0,
}

const install = Vue => {
  Vue.component('loader-component', LoaderComponent)
}

const setup = options => {
  for (let key in options) {
    if (!(key in Options)) return
    Options[key] = options[key]
  }
}

export default {
  install,
}

export { LoaderComponent, install as LoaderComponentInstaller, setup, Options }

import { createApp } from 'vue'

const relativeCls = 'g-relative'

export default function createDirective(com) {

  return {

    mounted(el, binding) {
      // com创建的dom，el挂载的dom
      const app = createApp(com)
      const instance = app.mount(document.createElement('div'))

      const name = com.name
      if (!el[name]) {
        el[name] = {}
      }

      el[name].instance = instance

      const title = binding.arg
      if (title) {
        instance.setTitle(title)
      }
      if (binding.value) {
        append(el)
      }
    },
    updated(el, binding) {
      const title = binding.arg
      const name = com.name
      if (title) {
        el[name].instance.setTitle(title)
      }
      if (binding.value !== binding.oldValue) {

        binding.value ? append(el) : remove(el)
      }
    },
  }
  function append(el) {
    const name = com.name
    const style = getComputedStyle(el)
    if (!['absolute', 'fixed', 'relative'].includes(style.position)) {
      if (!el.classList.contains(relativeCls)) {
        el.classList.add(relativeCls)
      }
    }
    el.appendChild(el[name].instance.$el)
  }

  function remove(el) {
    const name = com.name
    el.classList.remove(relativeCls)
    el.removeChild(el[name].instance.$el)
  }

}


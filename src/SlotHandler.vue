<template>
  <component :is="tag" v-bind="$attrs" v-html="content" />
</template>

<script>
export default {
  props: {
    value: [String, Object],
  },
  computed: {
    content() {
      return typeof this.value === 'string' ? this.value : undefined
    },
    tag() {
      return typeof this.value === 'string' ? 'div' : this.value
    },
  },
}
</script>

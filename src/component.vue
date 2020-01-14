<template lang="html">
  <div
    class="elder-loader"
    :class="[
      'elder-loader--' + theme,
      { 'elder-loader--active': isLoading, ['elder-loader--' + state]: state },
    ]"
  >
    <slot v-if="showDefaultSlot" />
    <div v-if="showSuccessSlot" class="elder-loader__success">
      <slot name="success"></slot>
    </div>
    <div v-if="showErrorSlot" class="elder-loader__error">
      <slot name="error" :error="error"></slot>
    </div>

    <div v-if="isLoading" class="elder-loader__element">
      <FontAwesomeIcon class="elder-loader__loading-icon" v-bind="content.icon" spin />
      <div class="elder-loader__loading-message">
        <slot name="message">{{ content.message }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Options } from '../index'
import { iconBinding } from './utils'
import './icons'

export default {
  props: {
    value: [Boolean, Promise],
    theme: {
      type: String,
      enum: ['overlay', 'default'],
      default: 'default',
    },
    message: String,
    icon: [String, Object, Array],
    delay: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isLoading: false,
      state: null,
      error: null,
      timeout: null,
    }
  },
  watch: {
    value: {
      handler(value) {
        if (value instanceof Promise) {
          this.start()

          value
            .then(() => this.stop('success'))
            .catch(err => {
              this.error = err
              this.stop('error')
              throw err
            })
        } else {
          if (!value) this.stop('success')
          else this.start()
        }
      },
      immediate: true,
    },
  },
  methods: {
    reset() {
      this.state = undefined
      this.error = undefined
      this.isLoading = false
    },
    start() {
      this.reset()

      if (!this.delay) this.isLoading = true
      else this.timeout = setTimeout(() => (this.isLoading = true), this.delay)
    },
    stop(result) {
      this.state = result
      this.isLoading = false
      this.timeout = clearTimeout(this.timeout)
    },
  },
  computed: {
    showDefaultSlot() {
      if (this.theme === 'overlay') return true
      return !this.isLoading && !this.showSuccessSlot && !this.showErrorSlot
    },
    showSuccessSlot() {
      return this.state === 'success' && this.$slots.success
    },
    showErrorSlot() {
      return this.state === 'error' && (this.$slots.error || this.$scopedSlots.error)
    },
    content() {
      return {
        icon: iconBinding(this.icon || Options.icon),
        message: this.message || Options.message,
      }
    },
  },
  components: {
    FontAwesomeIcon,
  },
}
</script>

<style lang="scss">
.elder-loader {
  @import './variables.scss';

  flex-grow: 1;

  &--default {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__element {
    text-align: center;
    border-radius: $border-radius;
    padding: 1rem 2rem;
    margin: 2rem 0;
    min-width: 200px;
  }

  &--overlay {
    position: relative;

    .elder-loader__element,
    .elder-loader__error,
    .elder-loader__success {
      position: absolute;
      background-color: rgba(white, 0.9);
      width: 100%;
      height: 100%;
      max-height: 100vh;
      top: 0;
      left: 0;
      margin: 0;
      padding: 1rem 2rem;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .elder-loader__element {
      .elder-loader__loading-message {
        opacity: 1;
      }
    }
  }

  &__loading-icon {
    color: $primary;
  }

  &__loading-message {
    opacity: 0.5;
    margin-top: 0.5rem;
  }

  .fa-spin {
    animation-duration: $vue-elder-loader-animation-duration;
  }
}
</style>

<template lang="html">
  <div
    class="elder-loader"
    :class="[
      'elder-loader--' + content.theme,
      { 'elder-loader--active': isLoading, ['elder-loader--' + state]: state },
    ]"
  >
    <slot v-if="showDefaultSlot" />
    <slot v-if="showSuccessSlot && content.theme === 'default'" name="success" />
    <slot v-if="showErrorSlot && content.theme === 'default'" name="error" :error="error" />

    <div v-if="showLoaderElement" class="elder-loader__element">
      <div class="elder-loader__element-content">
        <div class="elder-loader__element-content-inner">
          <slot v-if="showSuccessSlot && content.theme === 'overlay'" name="success" />
          <slot v-if="showErrorSlot && content.theme === 'overlay'" name="error" :error="error" />
          <template v-if="isLoading">
            <FontAwesomeIcon class="elder-loader__loading-icon" v-bind="content.icon" spin />
            <div class="elder-loader__loading-message">
              <slot name="message">{{ content.message }}</slot>
            </div>
          </template>
        </div>
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
    },
    message: String,
    icon: [String, Object, Array],
    delay: Number,
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

      if (!this.content.delay) this.isLoading = true
      else this.timeout = setTimeout(() => (this.isLoading = true), this.content.delay)
    },
    stop(result) {
      this.state = result
      this.isLoading = false
      this.timeout = clearTimeout(this.timeout)
    },
  },
  computed: {
    showLoaderElement() {
      if (this.isLoading) return true
      if (this.showStateSlot && this.content.theme === 'overlay') return true
      return false
    },
    showDefaultSlot() {
      if (this.content.theme === 'overlay') return true
      return !this.isLoading && !this.showSuccessSlot && !this.showErrorSlot
    },
    showStateSlot() {
      return this.showErrorSlot || this.showSuccessSlot
    },
    showSuccessSlot() {
      return Boolean(this.state === 'success' && this.$slots.success)
    },
    showErrorSlot() {
      return Boolean(
        this.state === 'error' && (this.$slots.error || this.$scopedSlots.error),
      )
    },
    content() {
      return {
        icon: iconBinding(this.icon || Options.icon),
        message: this.message || Options.message,
        theme: this.theme || Options.theme,
        delay: this.delay || Options.delay,
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
    &.elder-loader--active {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  &--overlay {
    position: relative;

    .elder-loader__element,
    .elder-loader__error,
    .elder-loader__success {
      position: absolute;
      background-color: rgba(white, $vue-elder-loader-theme-overlay-transparency);
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 2;
    }

    .elder-loader__element-content-inner {
      border: 1px solid $border-color;
      background-color: white;
    }
  }

  &__element {
    &-content {
      &-inner {
        text-align: center;
        border-radius: $border-radius;
        margin: 2rem 0;
        padding: 1rem 2rem;
        min-width: 200px;
      }

      .elder-loader--overlay & {
        position: sticky;
        top: 0;
        height: 100%;
        max-height: 95vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
  }

  &__loading-icon {
    color: $primary;
  }

  &__loading-message {
    margin-top: 0.5rem;
  }

  .fa-spin {
    animation-duration: $vue-elder-loader-animation-duration;
  }
}
</style>

<template>
  <LineBase
    v-bind="$attrs"
    curve="smooth"
    fill="fade"
    :show-grid="false"
    :show-points="false"
    :show-end-dot="false"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </LineBase>
</template>

<script setup>
import LineBase from 'src/components/widgets/LineBase.vue'

defineOptions({
  inheritAttrs: false,
  aspect: 3,
  minHeight: 32
})
</script>

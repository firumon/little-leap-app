<template>
  <LineBase
    v-bind="$attrs"
    curve="smooth"
    fill="none"
    :show-grid="true"
    :show-points="true"
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
  aspect: 1.78,
  minHeight: 120
})
</script>

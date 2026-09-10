<template>
  <AgeingBase
    v-bind="$attrs"
    bucket-style="staircase"
    danger-tint="last-only"
    :show-baseline="false"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </AgeingBase>
</template>

<script setup>
import AgeingBase from 'src/components/widgets/AgeingBase.vue'

defineOptions({
  inheritAttrs: false,
  aspect: 1.78,
  minHeight: 100
})
</script>

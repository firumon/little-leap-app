<template>
  <MetricBase
    v-bind="$attrs"
    sentiment="auto"
    :invert="false"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </MetricBase>
</template>

<script setup>
import MetricBase from 'src/components/widgets/MetricBase.vue'

defineOptions({
  inheritAttrs: false,
  minHeight: 48
})
</script>

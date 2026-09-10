<template>
  <ProportionBase
    v-bind="$attrs"
    orientation="horizontal"
    split-style="gap"
    bar-height="thick"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </ProportionBase>
</template>

<script setup>
import ProportionBase from 'src/components/widgets/ProportionBase.vue'

defineOptions({
  inheritAttrs: false,
  aspect: 6,
  minHeight: 64
})
</script>

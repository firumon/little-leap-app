<template>
  <ProportionBase
    v-bind="$attrs"
    orientation="vertical"
    split-style="continuous"
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
  aspect: 0.25,
  minHeight: 90
})
</script>

<template>
  <ProgressBase
    v-bind="$attrs"
    orientation="vertical"
    shape="flat"
    :show-track="true"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </ProgressBase>
</template>

<script setup>
import ProgressBase from 'src/components/widgets/ProgressBase.vue'

defineOptions({
  inheritAttrs: false,
  aspect: 0.25,
  minHeight: 80
})
</script>

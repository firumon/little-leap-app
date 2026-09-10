<template>
  <ProgressBase
    v-bind="$attrs"
    orientation="horizontal"
    shape="segmented"
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
  aspect: 6,
  minHeight: 64
})
</script>

<template>
  <RadialBase
    v-bind="$attrs"
    cap-style="round"
    sweep="full"
    :track-background="true"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </RadialBase>
</template>

<script setup>
import RadialBase from 'src/components/widgets/RadialBase.vue'

defineOptions({
  inheritAttrs: false,
  aspect: 1,
  minHeight: 110
})
</script>

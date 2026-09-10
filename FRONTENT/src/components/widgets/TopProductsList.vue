<template>
  <RankedListBase
    v-bind="$attrs"
    row-spacing="tight"
    bar-style="fill"
    :show-rank-number="true"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}" />
    </template>
  </RankedListBase>
</template>

<script setup>
import RankedListBase from 'src/components/widgets/RankedListBase.vue'

defineOptions({
  inheritAttrs: false,
  aspect: 1.33,
  minHeight: 120
})
</script>

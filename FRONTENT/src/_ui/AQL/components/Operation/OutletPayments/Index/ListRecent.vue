<template>
  <AppList
    v-bind="preset"
    empty-text="No payments recorded yet."
    empty-icon="history"
    @click="onOpen"
  />
</template>

<script setup>
import { computed } from 'vue'
import AppList from 'components/app/AppList.vue'
import { useOutletPaymentIndexContext } from 'src/_ui/AQL/composables/Operation/OutletPayments/Index/useOutletPaymentIndexContext'
import { paymentRowPreset } from 'src/_ui/AQL/composables/Operation/OutletPayments/Index/usePaymentRowPresets'

defineOptions({ name: 'OutletPaymentsListRecent', inheritAttrs: false })

const { views, filterPayments, openPayment } = useOutletPaymentIndexContext()

const preset = computed(() => paymentRowPreset(filterPayments(views.value.Recent || [])))

const onOpen = (item) => openPayment(item?.code)
</script>

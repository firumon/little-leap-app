<template>
  <AppList
    v-bind="preset"
    empty-text="No payments have been cancelled."
    empty-icon="task_alt"
    @click="onOpen"
  />
</template>

<script setup>
import { computed } from 'vue'
import AppList from 'components/app/AppList.vue'
import { useOutletPaymentIndexContext } from 'src/_ui/AQL/composables/Operation/OutletPayments/Index/useOutletPaymentIndexContext'
import { paymentRowPreset } from 'src/_ui/AQL/composables/Operation/OutletPayments/Index/usePaymentRowPresets'

defineOptions({ name: 'OutletPaymentsListCancelledPayments', inheritAttrs: false })

const { views, filterPayments, openPayment } = useOutletPaymentIndexContext()

const preset = computed(() => paymentRowPreset(filterPayments(views.value.CancelledPayments || [])))

const onOpen = (item) => openPayment(item?.code)
</script>

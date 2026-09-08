<template>
  <AppList
    v-bind="preset"
    empty-text="Nothing overdue."
    empty-icon="task_alt"
    @click="onOpen"
  />
</template>

<script setup>
// Every invoice past its due date, longest overdue first. Same set the Overdue metric card
// counts — one derivation, two consumers.
import { computed } from 'vue'
import AppList from 'components/app/AppList.vue'
import { useInvoiceIndexContext } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Index/useInvoiceIndexContext'
import { invoiceDueRowPreset } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Index/useInvoiceRowPresets'

defineOptions({ name: 'OutletConsumptionInvoicesListOverdue', inheritAttrs: false })

const { storedViews, filterInvoices, openInvoice } = useInvoiceIndexContext()

const preset = computed(() => invoiceDueRowPreset(filterInvoices(storedViews.value.Overdue), { chipColor: 'negative' }))

const onOpen = (item) => openInvoice(item?.code)
</script>

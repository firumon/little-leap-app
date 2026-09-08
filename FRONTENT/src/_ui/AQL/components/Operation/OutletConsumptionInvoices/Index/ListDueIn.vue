<template>
  <AppList
    v-bind="preset"
    empty-text="Nothing falls due this week."
    empty-icon="task_alt"
    @click="onOpen"
  />
</template>

<script setup>
// Open invoices falling due within a week, soonest first. Overdue rows are NOT here — they
// have their own pill, so the two queues never blur into one list.
import { computed } from 'vue'
import AppList from 'components/app/AppList.vue'
import { useInvoiceIndexContext } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Index/useInvoiceIndexContext'
import { invoiceDueRowPreset } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Index/useInvoiceRowPresets'

defineOptions({ name: 'OutletConsumptionInvoicesListDueIn', inheritAttrs: false })

const { storedViews, filterInvoices, openInvoice } = useInvoiceIndexContext()

const preset = computed(() => invoiceDueRowPreset(filterInvoices(storedViews.value.DueIn), { short: true }))

const onOpen = (item) => openInvoice(item?.code)
</script>

<template>
  <AppList
    :items="rows"
    item-key="outletCode"
    empty-text="Every consumption has been invoiced."
    empty-icon="task_alt"
    label="label"
    caption="caption"
  >
    <!-- THE PRIMARY ACTION OF THIS VIEW. Every other list here opens something to read;
         this one starts work. -->
    <template #btn="{ item }">
      <q-btn
        v-if="canCreate"
        flat round dense
        icon="add"
        color="primary"
        :aria-label="`Generate invoice for ${item.label}`"
        @click.stop="onStart(item)"
      />
    </template>
  </AppList>
</template>

<script setup>
// Outlets carrying consumptions that were recorded but never billed. It reads
// `OutletConsumptions`, not this resource, so it cannot be a plain column filter.
import { computed } from 'vue'
import AppList from 'components/app/AppList.vue'
import { useInvoiceIndexContext } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Index/useInvoiceIndexContext'

defineOptions({ name: 'OutletConsumptionInvoicesListInvoiceable', inheritAttrs: false })

const { invoiceableOutlets, canCreate, startInvoice } = useInvoiceIndexContext()

const rows = computed(() => invoiceableOutlets.value.map((entry) => ({
  outletCode: entry.outletCode,
  label: entry.outletName,
  caption: `Consumptions: ${entry.consumptionCount}`
})))

const onStart = (item) => startInvoice(item?.outletCode)
</script>

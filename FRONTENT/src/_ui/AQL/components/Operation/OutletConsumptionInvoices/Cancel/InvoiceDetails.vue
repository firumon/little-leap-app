<template>
  <div :class="gutterClass">
    <SectionDividerLabel label="INVOICE DETAILS" />

    <q-banner v-if="blockedMessage" dense rounded class="bg-orange-1 text-body2">
      <template #avatar><q-icon name="lock" color="warning" /></template>
      {{ blockedMessage }}
    </q-banner>

    <q-card flat bordered :class="ui.cardClass">
      <q-card-section>
        <div class="row items-center no-wrap q-col-gutter-sm">
          <div class="col" :class="ui.flexWrapTextClass">
            <div class="text-caption text-grey-7">CANCELLING</div>
            <div class="text-subtitle1 text-weight-medium">{{ code }}</div>
            <div class="text-caption text-grey-8">{{ outletName }}</div>
          </div>
          <div class="col-auto">
            <q-badge rounded :color="progressMeta.color" :label="progressMeta.label" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-py-sm">
        <div class="aql-detail-grid">
          <div v-for="line in figures" :key="line.key" class="aql-detail-line">
            <div class="aql-detail-key">{{ line.label }}</div>
            <div class="aql-detail-val" :class="line.negative ? 'text-negative' : ''">
              {{ line.negative ? '−' : '' }}{{ money(line.value) }}
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="row items-center justify-between q-py-sm">
        <div class="text-subtitle2 text-weight-bold">Net Payable</div>
        <div class="text-h6 text-weight-bolder text-primary">{{ money(netPayable) }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
// Cancel > what is being voided. The route's hydration point: this card opens the sources
// and keeps the live cancellation batch cut, so submit only validates.
import { computed, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import { useInvoiceCancelSeed } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Cancel/useInvoiceCancelContext'

defineOptions({ name: 'OutletConsumptionInvoicesCancelInvoiceDetails', inheritAttrs: false })

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const {
  ui, money, record, code, outletName, progressMeta, blockedMessage, netPayable
} = useInvoiceCancelSeed()

const num = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0)

const figures = computed(() => {
  const row = record.value || {}
  return [
    { key: 'subtotal', label: 'Subtotal', value: num(row.Subtotal) },
    { key: 'taxable', label: 'Taxable Amount', value: num(row.TotalTaxableAmount) },
    { key: 'tax', label: 'Tax Amount', value: num(row.TotalTaxAmount) },
    { key: 'discount', label: 'Discount', value: num(row.Discount), negative: num(row.Discount) > 0 },
    {
      key: 'returns',
      label: 'Returns Deducted',
      value: num(row.ReturnDeductionTotal),
      negative: num(row.ReturnDeductionTotal) > 0
    }
  ]
})
</script>

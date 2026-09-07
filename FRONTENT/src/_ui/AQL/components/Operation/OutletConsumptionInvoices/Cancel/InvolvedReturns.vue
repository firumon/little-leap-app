<template>
  <div v-if="rows.length" :class="gutterClass">
    <SectionDividerLabel label="INVOLVED RETURNS" />

    <q-card flat bordered :class="ui.cardClass">
      <q-list separator>
        <q-item v-for="entry in rows" :key="entry.code">
          <q-item-section :class="ui.flexWrapTextClass">
            <q-item-label class="text-weight-medium">
              {{ entry.date }} · {{ entry.username || entry.code }}
            </q-item-label>
            <q-item-label caption>
              {{ entry.qty }} x {{ entry.sku }}
              <span v-if="entry.reason"> · {{ entry.reason }}</span>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center no-wrap q-gutter-x-xs">
              <q-chip dense square outline color="blue-8" class="q-my-none">
                {{ money(entry.amount) }}
              </q-chip>
              <q-chip dense square outline color="grey-7" class="q-my-none">{{ entry.age }}</q-chip>
            </div>
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator />

      <div class="text-caption text-grey-7 q-px-md q-py-sm">
        These returns will be marked as pending adjustment.
      </div>
    </q-card>
  </div>
</template>

<script setup>
// Cancel > what credit is handed back. A cancelled bill credits nothing, so every return it
// took goes back to waiting for adjustment.
import { computed, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import { useInvoiceCancelContext } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Cancel/useInvoiceCancelContext'
import { elapsedLabel } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Index/useInvoiceRowPresets'

defineOptions({ name: 'OutletConsumptionInvoicesCancelInvolvedReturns', inheritAttrs: false })

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const { ui, money, returnRows } = useInvoiceCancelContext()

const text = (value) => (value == null ? '' : String(value).trim())
const num = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0)

const rows = computed(() => returnRows.value.map((row) => ({
  code: text(row.Code),
  date: text(row.Date),
  username: text(row.Username),
  sku: text(row.SKU),
  qty: num(row.Qty),
  amount: num(row.Qty) * num(row.Price),
  reason: text(row.Reason),
  age: elapsedLabel(row.Date)
})))
</script>

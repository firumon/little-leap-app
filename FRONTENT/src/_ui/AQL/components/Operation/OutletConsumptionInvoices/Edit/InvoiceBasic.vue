<template>
  <div :class="gutterClass">
    <SectionDividerLabel label="INVOICE" />

    <!-- Read-only facts, not disabled inputs: a greyed box invites a dead click. -->
    <q-card flat bordered :class="ui.cardClass">
      <q-card-section class="q-py-sm">
        <div class="aql-detail-grid">
          <div v-for="line in facts" :key="line.key" class="aql-detail-line">
            <div class="aql-detail-key">{{ line.label }}</div>
            <div class="aql-detail-val">{{ line.value }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import {
  useInvoiceEditContext,
  useInvoiceEditSeed
} from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Edit/useInvoiceEditContext'

defineOptions({ name: 'OutletConsumptionInvoicesEditInvoiceBasic', inheritAttrs: false })

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const { ui, record, outletName } = useInvoiceEditContext()

// The page's one hydration point, in the first card only.
useInvoiceEditSeed()

const text = (value) => (value == null ? '' : String(value).trim())

// OutletConsumptionCode is left out on purpose: some rows hold an unresolved batch ref.
const facts = computed(() => {
  const row = record.value || {}

  return [
    { key: 'code', label: 'Invoice', value: text(row.Code) || '—' },
    { key: 'outlet', label: 'Outlet', value: outletName.value || '—' },
    { key: 'date', label: 'Issued', value: text(row.Date) || '—' },
    { key: 'user', label: 'Raised By', value: text(row.Username) || '—' }
  ]
})
</script>

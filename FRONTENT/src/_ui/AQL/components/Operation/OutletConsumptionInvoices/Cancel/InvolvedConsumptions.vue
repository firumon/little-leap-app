<template>
  <div v-if="consumptions.length" :class="gutterClass">
    <SectionDividerLabel label="INVOLVED CONSUMPTIONS" />

    <q-card flat bordered :class="ui.cardClass">
      <q-list separator>
        <q-item v-for="entry in rows" :key="entry.code">
          <q-item-section :class="ui.flexWrapTextClass">
            <q-item-label class="text-weight-medium">
              {{ entry.date }} · {{ entry.username || '—' }}
            </q-item-label>
            <q-item-label caption>
              {{ entry.itemCount }} Items X {{ entry.totalQty }} Quantities
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-chip dense square outline color="blue-8" class="q-my-none">{{ entry.age }}</q-chip>
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator />

      <div class="text-caption text-grey-7 q-px-md q-py-sm">
        These consumptions will be marked as GENERATE INVOICE PENDING.
      </div>
    </q-card>
  </div>
</template>

<script setup>
// Cancel > what goes back. Every consumption this bill carried returns to the invoiceable
// queue, so the operator sees the list before agreeing to it.
import { computed, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import { useInvoiceCancelContext, elapsedLabel } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Cancel/useInvoiceCancelContext'

defineOptions({ name: 'OutletConsumptionInvoicesCancelInvolvedConsumptions', inheritAttrs: false })

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const { ui, consumptions } = useInvoiceCancelContext()

const rows = computed(() => consumptions.value.map((entry) => ({
  ...entry,
  age: elapsedLabel(entry.at)
})))
</script>

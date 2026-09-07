<template>
  <div v-if="creditedReturns.length" :class="gutterClass">
    <SectionDividerLabel label="CREDITED RETURNS" />

    <q-card flat bordered :class="ui.cardClass">
      <q-list separator>
        <q-item v-for="entry in creditedReturns" :key="entry.code">
          <q-item-section :class="ui.flexWrapTextClass">
            <q-item-label class="text-weight-medium">
              {{ entry.qty }} x {{ entry.primary }}
            </q-item-label>
            <q-item-label caption>{{ entry.secondary }}</q-item-label>
            <q-item-label caption>
              {{ entry.date }} · {{ money(entry.price) }} each
              <span v-if="entry.reason"> · {{ entry.reason }}</span>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-chip dense square outline color="blue-8" class="q-my-none">
              {{ money(entry.amount) }}
            </q-chip>
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator />

      <div class="text-caption text-grey-7 q-px-md q-py-sm">
        Already credited on this invoice. Edit the return itself to change them.
      </div>
    </q-card>
  </div>
</template>

<script setup>
// Read-only. Which returns a bill credits was settled when it was raised; an edit only
// re-prices what is on it.
import { computed, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import { useInvoiceEditContext } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Edit/useInvoiceEditContext'

defineOptions({ name: 'OutletConsumptionInvoicesEditInvoiceReturns', inheritAttrs: false })

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const { ui, money, creditedReturns } = useInvoiceEditContext()
</script>

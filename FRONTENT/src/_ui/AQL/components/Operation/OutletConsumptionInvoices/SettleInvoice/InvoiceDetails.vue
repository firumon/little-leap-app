<template>
  <div :class="gutterClass">
    <SectionDividerLabel label="INVOICE DETAILS" />

    <!-- The invoice moved on since the link was opened. Said ABOVE the form, not at the
         sticky bar after a reason has already been chosen. -->
    <q-banner v-if="!gate.allowed" dense rounded class="bg-orange-1 text-body2">
      <template #avatar><q-icon name="lock" color="warning" /></template>
      {{ gate.reason }}
    </q-banner>

    <q-card flat bordered :class="ui.cardClass">
      <q-card-section>
        <div class="row items-center no-wrap q-col-gutter-sm">
          <div class="col" :class="ui.flexWrapTextClass">
            <div class="text-caption text-grey-7">SETTLING</div>
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
          <div class="aql-detail-line">
            <div class="aql-detail-key">Billed</div>
            <div class="aql-detail-val">{{ money(gate.total) }}</div>
          </div>
          <div class="aql-detail-line">
            <div class="aql-detail-key">Collected</div>
            <div class="aql-detail-val text-positive">{{ money(gate.collected) }}</div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="row items-center justify-between q-py-sm">
        <div class="text-subtitle2 text-weight-bold">Outstanding Balance</div>
        <div class="text-h6 text-weight-bolder text-orange-9">{{ money(gate.balance) }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
// Settle > what is being written off, before it is named. The route's hydration point: this
// card opens the payments and keeps the live settlement node standing.
import { computed, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import { useInvoiceSettleSeed } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/SettleInvoice/useInvoiceSettleContext'

defineOptions({ name: 'OutletConsumptionInvoicesSettleInvoiceInvoiceDetails', inheritAttrs: false })

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const { ui, code, outletName, progressMeta, gate, money } = useInvoiceSettleSeed()
</script>

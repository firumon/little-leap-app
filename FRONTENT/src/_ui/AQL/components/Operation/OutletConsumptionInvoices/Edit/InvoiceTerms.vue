<template>
  <div v-if="live" :class="gutterClass">
    <SectionDividerLabel label="TERMS" />

    <q-card flat bordered :class="ui.cardClass">
      <q-card-section :class="gutterClass">
        <component
          :is="SelectField"
          :model-value="priceListCode"
          :record="{}"
          :config="priceListConfig"
          header="PriceListCode"
          @update:model-value="(value) => (priceListCode = value)"
        />

        <q-banner v-if="priceListSwitched" dense rounded class="bg-blue-1 text-body2">
          <template #avatar><q-icon name="sync_alt" color="primary" /></template>
          Every line is now billed at <strong>{{ priceListName }}</strong> prices, and this
          list's own tax and discount rules apply. Check the totals below before saving.
        </q-banner>

        <component
          :is="DateField"
          :model-value="dueDate"
          :record="{}"
          :config="dueDateConfig"
          header="DueDate"
          @update:model-value="(value) => (dueDate = value)"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
// The commercial terms. Each control writes ONE column on the live node; Layer 2 re-prices
// the lines and restates every total.
import { computed, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import { resolveFieldComponent } from 'src/_fields/useFieldResolver'
import { useInvoiceEditContext } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Edit/useInvoiceEditContext'

defineOptions({ name: 'OutletConsumptionInvoicesEditInvoiceTerms', inheritAttrs: false })

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const DateField = resolveFieldComponent('date', 'edit')
const SelectField = resolveFieldComponent('select', 'edit')

const {
  ui, live, locked, priceListName, priceListSwitched, priceListOptions,
  dueDate, priceListCode
} = useInvoiceEditContext()

const priceListConfig = computed(() => ({
  options: priceListOptions.value,
  label: 'Price list',
  clearable: false,
  disable: locked.value
}))

const dueDateConfig = computed(() => ({
  label: 'Due date',
  clearable: false,
  disable: locked.value
}))
</script>

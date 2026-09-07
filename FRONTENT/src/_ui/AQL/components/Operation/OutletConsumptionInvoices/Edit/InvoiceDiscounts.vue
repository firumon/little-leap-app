<template>
  <div v-if="live" :class="gutterClass">
    <SectionDividerLabel label="DISCOUNT" />

    <q-card flat bordered :class="ui.cardClass">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <component
              :is="SelectField"
              :model-value="discountType"
              :record="{}"
              :config="discountTypeConfig"
              header="DiscountType"
              @update:model-value="(value) => (discountType = value || 'FLAT')"
            />
          </div>
          <div class="col-6">
            <component
              :is="discountType === 'PERCENT' ? NumberField : CurrencyField"
              :model-value="discountValue"
              :record="{}"
              :config="discountConfig"
              header="Discount"
              @update:model-value="(value) => (discountValue = Number(value) || 0)"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
// Both are controls, never columns: they decide what the stored figures become, and
// Layer 2 re-prices every line as they change.
import { computed, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import { resolveFieldComponent } from 'src/_fields/useFieldResolver'
import { useInvoiceEditContext } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Edit/useInvoiceEditContext'

defineOptions({ name: 'OutletConsumptionInvoicesEditInvoiceDiscounts', inheritAttrs: false })

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const SelectField = resolveFieldComponent('select', 'edit')
const NumberField = resolveFieldComponent('number', 'edit')
const CurrencyField = resolveFieldComponent('currency', 'edit')

const { ui, live, locked, discountType, discountValue } = useInvoiceEditContext()

const discountTypeConfig = computed(() => ({
  options: [
    { value: 'FLAT', label: 'Flat amount' },
    { value: 'PERCENT', label: 'Percentage' }
  ],
  label: 'Discount type',
  clearable: false,
  disable: locked.value
}))

const discountConfig = computed(() => (discountType.value === 'PERCENT'
  ? { label: 'Discount %', suffix: '%', min: 0, max: 100, disable: locked.value }
  : { label: 'Discount amount', min: 0, disable: locked.value }))
</script>

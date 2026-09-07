<template>
  <div v-if="visible" :class="gutterClass">
    <SectionDividerLabel label="DISCOUNT" />

    <q-card flat bordered :class="ui.cardClass">
      <q-card-section :class="gutterClass">
        <component
          :is="SelectField"
          :model-value="discountType"
          :record="{}"
          :config="{ options: discountTypes, label: 'Discount type', clearable: false }"
          header="DiscountType"
          @update:model-value="(value) => (discountType = value || 'FLAT')"
        />

        <component
          :is="discountType === 'PERCENT' ? NumberField : CurrencyField"
          :model-value="discountValue"
          :record="{}"
          :config="discountConfig"
          header="Discount"
          @update:model-value="(value) => (discountValue = Number(value) || 0)"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
// Step 3 - the discount terms. Both are controls, never columns: they decide what the
// stored figures become, and Layer 2 re-prices every line as they change.
import { computed, useAttrs } from 'vue'
import SectionDividerLabel from 'components/shared/SectionDividerLabel.vue'
import { resolveFieldComponent } from 'src/_fields/useFieldResolver'
import {
  useInvoiceAddContext,
  NODE,
  CTRL,
  stepVisible
} from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Add/useInvoiceAddContext'

defineOptions({ name: 'OutletConsumptionInvoicesAddInvoiceDiscounts', inheritAttrs: false })

const props = defineProps({ step: { type: [Number, String], default: 3 } })

const attrs = useAttrs()
const gutterClass = computed(() => `q-gutter-y-${attrs.gutter || 'sm'}`)

const { pageState, ui } = useInvoiceAddContext()

const SelectField = resolveFieldComponent('select', 'add')
const NumberField = resolveFieldComponent('number', 'add')
const CurrencyField = resolveFieldComponent('currency', 'add')

const visible = computed(() => stepVisible(pageState, props.step))

const discountType = pageState.useControls(CTRL.DISCOUNT_TYPE, 'FLAT', NODE)
const discountValue = pageState.useControls(CTRL.DISCOUNT_VALUE, 0, NODE)

const discountTypes = [
  { value: 'FLAT', label: 'Flat amount' },
  { value: 'PERCENT', label: 'Percentage' }
]

const discountConfig = computed(() => (discountType.value === 'PERCENT'
  ? { label: 'Discount %', suffix: '%', min: 0, max: 100 }
  : { label: 'Discount amount', min: 0 }))
</script>

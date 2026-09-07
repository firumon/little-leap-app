// The wizard keeps the whole submission live in pageState, so this bar only gates the steps
// and reads Layer 2's verdict. `actions` must stay a getter, or the step read is not tracked
// (UI_ACTION_SYSTEM.md §1.3).
import { INVOICE_GENERATED_MESSAGE } from 'src/_resource/Operation/OutletConsumptionInvoices/composables/useInvoicePayload'
import {
  invoiceDraftBlock,
  invoiceDraftLines
} from 'src/_resource/Operation/OutletConsumptionInvoices/composables/useInvoiceDraft'

const NODE = 'OutletConsumptionInvoices'

const text = (value) => (value == null ? '' : String(value).trim())

export default (props, { pageState }) => {
  const node = pageState.useNode(NODE)

  // Defaults to 1: an unset step would fall past the step-1 branch into the item check.
  const step = () => pageState.meta?.currentStep || 1
  const outlet = () => text(node.record.value?.OutletCode)

  return {
    get actions () {
      if (step() === 2) return ['back', 'next']
      if (step() === 3) return ['back', 'submit']
      return ['cancel', 'next']
    },

    submitLabel: 'Generate Invoice',

    // The user may have come from an Invoiceable Outlets row, so go to the list, not back.
    cancel: (name, { nav }) => {
      nav.goTo('index')
      return false
    },

    next: () => {
      if (step() === 1) {
        if (!outlet()) return { valid: false, message: 'Select an outlet to continue.' }
        return undefined
      }
      if (!invoiceDraftLines(pageState).length) {
        return { valid: false, message: 'Add at least one item with a quantity before continuing.' }
      }
      return undefined
    },

    // Validation only. The live nodes ARE the batch, so nothing is built here.
    submit: () => {
      const refused = invoiceDraftBlock(pageState)
      if (refused) return { valid: false, message: refused }
      return { successMsg: INVOICE_GENERATED_MESSAGE }
    }
  }
}

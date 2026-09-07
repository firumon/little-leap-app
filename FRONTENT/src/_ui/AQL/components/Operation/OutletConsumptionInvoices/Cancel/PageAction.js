// OutletConsumptionInvoices > Cancel > PageAction. The card keeps the whole cancellation
// live in pageState, so this bar assembles nothing: it checks the reason, re-checks the
// gate, and sends what is already standing.
import { canCancelInvoice } from 'src/_resource/Operation/OutletConsumptionInvoices/composables/useInvoiceWorkflow'
import { CANCEL_COMMENT } from 'src/_ui/AQL/composables/Operation/OutletConsumptionInvoices/Cancel/useInvoiceCancelContext'

const NODE = 'OutletConsumptionInvoices'

const text = (value) => (value == null ? '' : String(value).trim())
const asRow = (value) => (value && typeof value === 'object' ? value : {})

export default (props, { pageState, resourceRecord }) => {
  const record = () => asRow(resourceRecord?.record?.value)
  const comment = () => text(pageState?.getControls(CANCEL_COMMENT, '', NODE))
  const eligible = () => canCancelInvoice(record())

  return {
    actions: ['cancel', 'submit'],
    submitLabel: 'Confirm',

    // Destructive, so the button reads as such rather than as the page's neutral primary.
    submitColor: 'negative',

    // Function form, so the bar re-reads the gate on every keystroke.
    disabled: () => !eligible() || !comment(),

    cancel: (name, { nav }) => {
      nav.goTo('view')
      return false
    },

    submit: (name, { nav }) => {
      if (!text(record().Code)) return { valid: false, message: 'This invoice could not be loaded.' }
      // Re-checked here: a payment may have settled the invoice while this page was open.
      if (!eligible()) return { valid: false, message: 'This invoice can no longer be cancelled.' }
      if (!comment()) return { valid: false, message: 'A cancellation comment is required.' }

      return {
        successMsg: 'Invoice cancelled.',
        onSuccess: () => {
          pageState.reset()
          nav.goTo('view')
        }
      }
    }
  }
}

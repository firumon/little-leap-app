// The live nodes ARE the batch, so this bar only checks the invariants and lets the
// framework send what is already standing in pageState (UI_PAGE_STATE_NODES.md §5.7D).
import { invoiceEditBlock } from 'src/_resource/Operation/OutletConsumptionInvoices/composables/useInvoiceDraft'

const NODE = 'OutletConsumptionInvoices'

export default (props, { pageState, resourceRecord }) => {
  // The sticky bar mounts against the page's node and renders nothing without one.
  pageState.useNode(NODE)

  const record = () => resourceRecord?.record?.value || {}

  return {
    actions: ['cancel', 'submit'],
    submitLabel: 'Save Invoice',

    // false stops the built-in goBack() popping a second history entry.
    cancel: (name, { nav }) => {
      nav.goTo('view')
      return false
    },

    submit: () => {
      const refused = invoiceEditBlock(pageState, record())
      if (refused) return { valid: false, message: refused }
      return { successMsg: 'Invoice updated.' }
    },

    successRoute: 'view'
  }
}

import {
  buildInvoiceInitNodes,
  invoiceDraftDerivations
} from 'src/_resource/Operation/OutletConsumptionInvoices/composables/useInvoiceDraft'

const RESOURCE = 'OutletConsumptionInvoices'

// OutletConsumptionInvoices > Add - the 3-step invoice generator. One card per decision;
// the button table per step lives in `Add/PageAction.js`.
export default {
  sections: ['PageHeader'],
  contents: [
    'SelectOutlet',
    'SelectConsumptions',
    'InvoiceBasic',
    'InvoiceItems',
    'InvoiceDiscounts',
    'InvoiceReturns',
    'InvoiceSummary'
  ],

  PropsPageHeader: {
    title: 'Generate Invoice',
    reload: false
  },

  PropsSelectOutlet: { step: 1 },
  PropsSelectConsumptions: { step: 1 },
  PropsInvoiceBasic: { step: 1 },
  PropsInvoiceItems: { step: 2 },
  PropsInvoiceDiscounts: { step: 3 },
  PropsInvoiceReturns: { step: 3 },
  PropsInvoiceSummary: { step: 3 },

  // Page.vue keeps ONE pageState per Page mount and never clears it, so the nodes and
  // DERIVES of the last page visited are still here. Flush them, then mount the draft the
  // domain builds. This contract lists no columns of its own (UI_PAGE_STATE_NODES §5.7A).
  ready ({ pageState, routeInfo }) {
    const query = routeInfo.value.query || {}
    pageState.resetForResource(RESOURCE)
    pageState.derive(invoiceDraftDerivations())
    pageState.applyNodes(buildInvoiceInitNodes({
      outletCode: String(query.outletCode || '').trim(),
      consumptionCode: String(query.consumptionCode || '').trim()
    }))
  }
}

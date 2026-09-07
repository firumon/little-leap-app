import { useResourceNav } from 'src/composables/resources/useResourceNav'
import { useRecord } from 'src/composables/resources/useRecord'
import { useAQLConfig } from 'src/_ui/AQL/composables/useAQLConfig'
import { useCurrencyResource } from 'src/_resource/Master/Currencies/composables/useCurrencyResource'
import { useOutletPaymentIndex } from 'src/_resource/Operation/OutletPayments/composables/useOutletPaymentIndex'

/**
 * OutletPayments › Index — the Core-composable relay for the Index page
 * (UI_RESOURCE_DOMAIN_LOGIC.md §6.1). Lists may not import `useResourceNav` or
 * `useCurrencyResource` themselves, so those imports live here.
 */

const text = (value) => (value == null ? '' : String(value).trim())

// Module-scoped so one page visit fires one load, however many lists call the relay.
let pending = null

export function useOutletPaymentIndexContext () {
  const nav = useResourceNav()
  const ui = useAQLConfig()
  const { _C } = useCurrencyResource()

  const index = useOutletPaymentIndex()

  const sources = ['OutletConsumptionInvoices', 'Outlets']
    .map((name) => useRecord(name))

  /** Renders from cache and syncs the delta in the background — never blocks first paint. */
  const loadSources = () => Promise.all(sources.map((resource) => resource.reload()))

  if (!pending) {
    pending = loadSources().finally(() => { pending = null })
  }

  return {
    loadSources,
    ui,
    nav,
    money: (value) => _C(Number(value) || 0, true),

    overdueMetrics: index.overdueMetrics,
    todayCollectionsMetrics: index.todayCollectionsMetrics,
    linearProgressData: index.linearProgressData,
    views: index.views,
    openInvoices: index.openInvoices,

    /** Open one payment receipt. */
    openPayment: (code) => {
      const next = text(code)
      if (next) nav.goTo('view', { code: next })
    },

    /**
     * Start a payment. The invoice code is optional: the Outlets queue opens the
     * form on the outlet and lets the collector pick the invoices there.
     */
    startPayment: (outletCode, invoiceCode) => {
      const query = { outletCode: text(outletCode) }
      if (text(invoiceCode)) query.invoiceCode = text(invoiceCode)
      nav.goTo('add', { query })
    }
  }
}

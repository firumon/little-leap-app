import { useInvoiceIndex } from 'src/_resource/Operation/OutletConsumptionInvoices/composables/useInvoiceIndex'

// Eight pills, in work order. `OutletPendings` groups by outlet and `Invoiceable` reads
// another resource, so both are runtime views; the other six are plain column filters.
// `items` must stay a FUNCTION — a cached array would freeze at zero counts.
export default function () {
  return {
    items: () => {
      const { runtimeViews, storedViews } = useInvoiceIndex()
      const runtime = runtimeViews.value
      const stored = storedViews.value

      // The count is folded into the LABEL rather than passed as its own field:
      // `ListSwitcherItem.vue` renders `name`/`label`/`icon`/`color` and nothing else. A
      // `null` count means "no number on this pill" — used for the archives, where a total
      // is a fact about history rather than a call to action.
      const view = (name, label, icon, color, count) => ({
        name,
        label: count === null || count === undefined ? label : `${label} (${count})`,
        icon,
        color,
        count
      })

      return [
        view('Recent', 'Recent', 'history', 'indigo-7', null),
        view('DueIn', 'Due In', 'event', 'primary', stored.DueIn.length),
        view('Overdue', 'Overdue', 'running_with_errors', 'negative', stored.Overdue.length),
        view('PartiallyPaid', 'Partially Paid', 'incomplete_circle', 'info', stored.PartiallyPaid.length),
        view('OutletPendings', 'Outlet Pendings', 'storefront', 'indigo-6', runtime.OutletPendings.length),
        view('Invoiceable', 'Invoiceable', 'request_quote', 'warning', runtime.Invoiceable.length),
        view('Completed', 'Completed', 'task_alt', 'positive', null),
        view('Cancelled', 'Cancelled', 'block', 'grey-7', null)
      ]
    }
  }
}

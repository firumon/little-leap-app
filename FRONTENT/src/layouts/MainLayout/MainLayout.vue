<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <q-header elevated class="bg-primary text-white" height-hint="64">
      <q-toolbar class="q-py-sm">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="text-weight-bold row no-wrap items-center">
          <q-icon name="auto_graph" size="28px" class="q-mr-sm" />
          <span>Little Leap AQL</span>
        </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-input
            dark
            dense
            standout
            v-model="search"
            input-class="text-right"
            class="q-ml-md desktop-only"
            placeholder="Search resources..."
            style="width: 250px"
          >
            <template v-slot:append>
              <q-icon v-if="search === ''" name="search" />
              <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
            </template>
          </q-input>

          <q-btn round flat icon="notifications">
            <q-badge floating color="red" rounded />
          </q-btn>
          
          <q-btn round flat>
            <q-avatar size="32px">
              <img src="https://cdn.quasar.dev/img/avatar.png">
            </q-avatar>
            <q-menu>
              <q-list style="min-width: 150px">
                <q-item clickable v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="person" />
                  </q-item-section>
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="settings" />
                  </q-item-section>
                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup class="text-negative">
                  <q-item-section avatar>
                    <q-icon name="logout" />
                  </q-item-section>
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="260"
      class="bg-white"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item to="/dashboard" active-class="bg-blue-1 text-primary" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>Dashboard</q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <!-- Masters Group -->
          <q-expansion-item
            icon="admin_panel_settings"
            label="Masters"
            header-class="text-weight-medium"
            :default-opened="false"
          >
            <q-list class="q-pl-lg">
              <q-item to="/masters/products" clickable v-ripple>
                <q-item-section avatar><q-icon name="inventory_2" size="xs" /></q-item-section>
                <q-item-section>Products</q-item-section>
              </q-item>
              <q-item to="/masters/warehouses" clickable v-ripple>
                <q-item-section avatar><q-icon name="warehouse" size="xs" /></q-item-section>
                <q-item-section>Warehouses</q-item-section>
              </q-item>
              <q-item to="/masters/outlets" clickable v-ripple>
                <q-item-section avatar><q-icon name="storefront" size="xs" /></q-item-section>
                <q-item-section>Outlets</q-item-section>
              </q-item>
              <q-item to="/masters/salesmen" clickable v-ripple>
                <q-item-section avatar><q-icon name="badge" size="xs" /></q-item-section>
                <q-item-section>Salesmen</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!-- Logistics Group -->
          <q-expansion-item
            icon="local_shipping"
            label="Logistics"
            header-class="text-weight-medium"
          >
            <q-list class="q-pl-lg">
              <q-item to="/logistics/shipments" clickable v-ripple>
                <q-item-section avatar><q-icon name="ship" size="xs" /></q-item-section>
                <q-item-section>Shipment Booking</q-item-section>
              </q-item>
              <q-item to="/logistics/clearance" clickable v-ripple>
                <q-item-section avatar><q-icon name="assignment_turned_in" size="xs" /></q-item-section>
                <q-item-section>Port Clearance</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!-- Inventory Group -->
          <q-expansion-item
            icon="inventory"
            label="Inventory"
            header-class="text-weight-medium"
          >
            <q-list class="q-pl-lg">
              <q-item to="/inventory/stock-report" clickable v-ripple>
                <q-item-section avatar><q-icon name="summarize" size="xs" /></q-item-section>
                <q-item-section>Stock Report</q-item-section>
              </q-item>
              <q-item to="/inventory/transfers" clickable v-ripple>
                <q-item-section avatar><q-icon name="swap_horiz" size="xs" /></q-item-section>
                <q-item-section>WH Transfers</q-item-section>
              </q-item>
              <q-item to="/inventory/received" clickable v-ripple>
                <q-item-section avatar><q-icon name="download_done" size="xs" /></q-item-section>
                <q-item-section>Received Items</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!-- Sales Group -->
          <q-expansion-item
            icon="receipt_long"
            label="Sales & Orders"
            header-class="text-weight-medium"
          >
            <q-list class="q-pl-lg">
              <q-item to="/sales/invoices" clickable v-ripple>
                <q-item-section avatar><q-icon name="description" size="xs" /></q-item-section>
                <q-item-section>Invoices</q-item-section>
              </q-item>
              <q-item to="/sales/refill" clickable v-ripple>
                <q-item-section avatar><q-icon name="autofps_select" size="xs" /></q-item-section>
                <q-item-section>Stock Refill</q-item-section>
              </q-item>
              <q-item to="/sales/purchase-orders" clickable v-ripple>
                <q-item-section avatar><q-icon name="shopping_cart" size="xs" /></q-item-section>
                <q-item-section>Purchase Orders</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-item to="/reports" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="picture_as_pdf" />
            </q-item-section>
            <q-item-section>Reports & Exports</q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item to="/settings" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>App Settings</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)
const search = ref('')

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style lang="scss">
.q-drawer {
  .q-item {
    border-radius: 0 24px 24px 0;
    margin-right: 12px;
    &.q-router-link--active {
      background: rgba($primary, 0.1);
      color: $primary;
      font-weight: bold;
    }
  }
}
</style>

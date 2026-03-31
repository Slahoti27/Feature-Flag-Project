<template>
  <v-app :theme="isDark ? 'dark' : 'light'">

    <!-- Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      app
      :rail="mini"
      width="230"
      class="ff-sidebar"
    >
      <!-- Branding -->
      <div class="ff-brand" :class="{ 'ff-brand--mini': mini }">
        <div class="ff-brand__icon">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            <rect x="1" y="1" width="9" height="9" rx="2" fill="#6366f1"/>
            <rect x="12" y="1" width="9" height="9" rx="2" fill="#06b6d4"/>
            <rect x="1" y="12" width="9" height="9" rx="2" fill="#06b6d4"/>
            <rect x="12" y="12" width="9" height="9" rx="2" fill="#6366f1" opacity="0.4"/>
          </svg>
        </div>
        <span v-if="!mini" class="ff-brand__name">FlagForge</span>
      </div>

      <v-divider class="mx-3 mb-2" />

      <v-list nav density="comfortable" class="ff-nav">
        <v-list-item
          prepend-icon="mdi-view-dashboard-outline"
          title="Dashboard"
          rounded="lg"
          :active="activePage === 'dashboard'"
          active-color="primary"
          @click="activePage = 'dashboard'"
        />
        <v-list-item
          prepend-icon="mdi-chart-line"
          title="Analytics"
          rounded="lg"
          :active="activePage === 'analytics'"
          active-color="primary"
          @click="activePage = 'analytics'"
        />
      </v-list>

      <template #append>
        <v-divider class="mx-3 mb-2" />
        <div class="pa-2">
          <v-btn
            :icon="mini ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            variant="text"
            size="small"
            block
            @click="mini = !mini"
          />
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Topbar -->
    <v-app-bar app flat height="60" class="ff-topbar">
      <v-btn icon variant="text" size="small" @click="drawer = !drawer">
        <v-icon size="20">mdi-menu</v-icon>
      </v-btn>

      <v-toolbar-title class="ff-topbar__title">
        {{ activePage === 'dashboard' ? 'Dashboard' : 'Analytics' }}
        <span class="ff-topbar__dot" />
      </v-toolbar-title>

      <v-spacer />

      <v-btn icon variant="text" size="small" @click="isDark = !isDark">
        <v-icon size="18">{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <v-avatar size="32" class="ml-2" style="cursor:pointer">
        <v-img src="https://i.pravatar.cc/40" />
      </v-avatar>
    </v-app-bar>

    <!-- Main -->
    <v-main class="ff-main">
      <v-container fluid class="pa-6">

        <Analytics v-if="activePage === 'analytics'" />

        <div v-else>

          <!-- Stats -->
          <v-row class="mb-5">
            <v-col v-for="stat in stats" :key="stat.label" cols="12" sm="6" md="3">
              <v-card class="ff-stat-card" rounded="xl" flat>
                <v-card-text class="pa-5">
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <div class="ff-stat-label">{{ stat.label }}</div>
                      <div class="ff-stat-value" :class="stat.valueClass">{{ stat.value }}</div>
                    </div>
                    <v-avatar :color="stat.color" rounded="lg" size="48">
                      <v-icon color="white" size="22">{{ stat.icon }}</v-icon>
                    </v-avatar>
                  </div>
                </v-card-text>
                <div class="ff-stat-bar" :style="{ background: `rgb(var(--v-theme-${stat.color}))` }" />
              </v-card>
            </v-col>
          </v-row>

          <!-- Controls -->
          <v-row class="mb-3" align="center">
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="search"
                placeholder="Search flags by name or key…"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                hide-details
                clearable
              />
            </v-col>

            <v-col cols="12" sm="4">
              <v-btn-toggle
                v-model="filter"
                mandatory
                rounded="lg"
                density="comfortable"
                class="ff-filter-toggle"
              >
                <v-btn value="All" size="small">All</v-btn>
                <v-btn value="Active" size="small">Active</v-btn>
                <v-btn value="Disabled" size="small">Disabled</v-btn>
              </v-btn-toggle>
            </v-col>

            <v-col cols="12" sm="3" class="d-flex justify-end">
              <v-btn
                color="primary"
                rounded="lg"
                prepend-icon="mdi-plus"
                class="ff-create-btn"
                @click="dialog = true"
              >
                New Flag
              </v-btn>
            </v-col>
          </v-row>

          <!-- Table -->
          <v-card rounded="xl" flat class="ff-table-card">
            <v-data-table
              :headers="headers"
              :items="filteredFlags"
              :loading="loading"
              hover
              class="ff-table"
            >
              <template #item.key="{ item }">
                <code class="ff-flag-key">{{ item.key }}</code>
              </template>

              <template #item.is_enabled="{ item }">
                <div class="d-flex align-center gap-3">
                  <v-chip
                    :color="item.is_enabled ? 'success' : 'default'"
                    variant="tonal"
                    size="small"
                    class="ff-status-chip"
                  >
                    <template #prepend>
                      <v-icon size="8">mdi-circle</v-icon>
                    </template>
                    {{ item.is_enabled ? 'Active' : 'Disabled' }}
                  </v-chip>
                  <v-switch
                    v-model="item.is_enabled"
                    color="primary"
                    density="compact"
                    hide-details
                    inset
                    @change="toggleFlag(item)"
                  />
                </div>
              </template>

              <template #item.rollout_percentage="{ item }">
                <div class="d-flex align-center gap-2 ff-rollout-wrap">
                  <v-progress-linear
                    :model-value="item.rollout_percentage"
                    color="primary"
                    bg-color="surface-variant"
                    rounded
                    height="5"
                    style="min-width: 70px; flex: 1"
                  />
                  <v-text-field
                    v-model="item.rollout_percentage"
                    type="number"
                    density="compact"
                    variant="outlined"
                    rounded="lg"
                    hide-details
                    suffix="%"
                    style="max-width: 80px"
                    @blur="updateRollout(item)"
                  />
                </div>
              </template>

              <template #item.target_users="{ item }">
                <div v-if="item.target_users?.length" class="d-flex flex-wrap gap-1">
                  <v-chip
                    v-for="user in item.target_users.slice(0, 2)"
                    :key="user"
                    size="x-small"
                    color="secondary"
                    variant="tonal"
                    rounded="lg"
                  >{{ user }}</v-chip>
                  <v-chip
                    v-if="item.target_users.length > 2"
                    size="x-small"
                    variant="tonal"
                    rounded="lg"
                  >+{{ item.target_users.length - 2 }}</v-chip>
                </div>
                <span v-else class="text-medium-emphasis text-body-2">—</span>
              </template>

              <template #item.actions="{ item }">
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  color="error"
                  @click="openDeleteDialog(item.id)"
                >
                  <v-icon size="18">mdi-delete-outline</v-icon>
                </v-btn>
              </template>

              <template #no-data>
                <div class="ff-empty">
                  <v-icon size="44" color="medium-emphasis">mdi-flag-off-outline</v-icon>
                  <p class="text-medium-emphasis mt-3 text-body-2">No flags found</p>
                </div>
              </template>
            </v-data-table>
          </v-card>

        </div>
      </v-container>
    </v-main>

    <!-- Create Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card rounded="xl" flat class="ff-dialog">
        <v-card-title class="pa-5 pb-3">
          <div class="d-flex align-center gap-3">
            <v-avatar color="primary" rounded="lg" size="36">
              <v-icon color="white" size="18">mdi-flag-plus</v-icon>
            </v-avatar>
            <span class="ff-dialog-title">Create Feature Flag</span>
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-5">
          <div class="ff-field-label mb-1">Flag Name</div>
          <v-text-field
            v-model="form.name"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            hide-details
            class="mb-4"
          />

          <div class="ff-field-label mb-1">Flag Key</div>
          <v-text-field
            v-model="form.key"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            hide-details
            class="mb-4 ff-key-input"
          />

          <v-row dense>
            <v-col cols="6">
              <div class="ff-field-label mb-1">Rollout %</div>
              <v-text-field
                v-model="form.rollout_percentage"
                type="number"
                placeholder="0"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                hide-details
                suffix="%"
              />
            </v-col>
            <v-col cols="6">
              <div class="ff-field-label mb-1">Default State</div>
              <v-switch
                v-model="form.is_enabled"
                color="primary"
                inset
                hide-details
                :label="form.is_enabled ? 'Enabled' : 'Disabled'"
                class="mt-1"
              />
            </v-col>
            <v-select
              v-model="env"
              :items="['dev', 'staging', 'prod']"
              density="compact"
              variant="outlined"
              hide-details
              class="mr-2"
              style="max-width: 140px"
            />
          </v-row>

          <div class="ff-field-label mb-1 mt-4">
            Target Users
            <span class="text-caption text-medium-emphasis font-weight-regular ml-1">(comma separated)</span>
          </div>
          <v-text-field
            v-model="form.target_users_input"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            hide-details
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" rounded="lg" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" rounded="lg" prepend-icon="mdi-flag-plus" @click="handleCreate">
            Create Flag
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card rounded="xl" flat class="ff-dialog">
        <v-card-title class="pa-5 pb-3">
          <div class="d-flex align-center gap-3">
            <v-avatar color="error" rounded="lg" size="36">
              <v-icon color="white" size="18">mdi-alert-outline</v-icon>
            </v-avatar>
            <span class="ff-dialog-title">Delete Flag</span>
          </div>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-5">
          <p class="text-body-2 text-medium-emphasis" style="line-height:1.7">
            This will permanently delete the flag and clear all cached evaluations.
            This action <strong>cannot be undone</strong>.
          </p>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" rounded="lg" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" rounded="lg" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :timeout="2500" rounded="lg" location="bottom right">
      <div class="d-flex align-center gap-2">
        <v-icon color="success" size="18">mdi-check-circle</v-icon>
        {{ snackbar.text }}
      </div>
    </v-snackbar>

  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { watch } from 'vue';
import Analytics from './components/Analytics.vue';
import { getFlags, createFlag, updateFlag, deleteFlag } from './services/api';

const isDark = ref(false);
const drawer = ref(true);
const mini = ref(false);
const activePage = ref('dashboard');
const flags = ref([]);
const loading = ref(false);
const dialog = ref(false);
const deleteDialog = ref(false);
const selectedFlagId = ref(null);
const search = ref('');
const filter = ref('All');
const snackbar = ref({ show: false, text: '' });
const env = ref('prod');

const form = ref({
  name: '', key: '', rollout_percentage: 0, is_enabled: false, target_users_input: ''
});

const headers = [
  { title: 'Name',    key: 'name',               sortable: true  },
  { title: 'Key',     key: 'key',                sortable: false },
  { title: 'Status',  key: 'is_enabled',          sortable: true  },
  { title: 'Rollout', key: 'rollout_percentage',  sortable: true  },
  { title: 'Targets', key: 'target_users',        sortable: false },
  { title: '',        key: 'actions',             sortable: false },
];

const activeCount   = computed(() => flags.value.filter(f => f.is_enabled).length);
const disabledCount = computed(() => flags.value.filter(f => !f.is_enabled).length);
const avgRollout    = computed(() => {
  if (!flags.value.length) return 0;
  return Math.round(flags.value.reduce((s, f) => s + (f.rollout_percentage || 0), 0) / flags.value.length);
});

const stats = computed(() => [
  { label: 'Total Flags', value: flags.value.length, color: 'primary',   icon: 'mdi-flag-variant',        valueClass: '' },
  { label: 'Active',      value: activeCount.value,  color: 'success',   icon: 'mdi-check-circle-outline', valueClass: 'text-success' },
  { label: 'Disabled',    value: disabledCount.value,color: 'secondary', icon: 'mdi-minus-circle-outline', valueClass: '' },
  { label: 'Avg Rollout', value: avgRollout.value + '%', color: 'info',  icon: 'mdi-percent-outline',      valueClass: 'text-info' },
]);

const filteredFlags = computed(() => {
  const q = (search.value || '').toLowerCase();
  return flags.value.filter(flag => {
    const matchSearch = !q || flag.name?.toLowerCase().includes(q) || flag.key?.toLowerCase().includes(q);
    const matchFilter =
      filter.value === 'All' ||
      (filter.value === 'Active' && flag.is_enabled) ||
      (filter.value === 'Disabled' && !flag.is_enabled);
    return matchSearch && matchFilter;
  });
});

const showMessage = (text) => { snackbar.value = { show: true, text }; };

const loadFlags = async () => {
  loading.value = true;

  try {
    flags.value = await getFlags(env.value);
  } catch (err) {
    showMessage('Failed to load flags');
  }

  loading.value = false;
};

const handleCreate = async () => {
  await createFlag({
    name: form.value.name, key: form.value.key,
    rollout_percentage: Number(form.value.rollout_percentage),
    is_enabled: form.value.is_enabled,
    target_users: form.value.target_users_input
      ? form.value.target_users_input.split(',').map(u => u.trim()).filter(Boolean) : []
  });
  dialog.value = false;
  form.value = { name: '', key: '', rollout_percentage: 0, is_enabled: false, target_users_input: '' };
  showMessage('Flag created successfully');
  await loadFlags();
};

const toggleFlag = async (flag) => {
  await updateFlag(flag.id, { is_enabled: flag.is_enabled });
  showMessage(flag.is_enabled ? 'Flag enabled' : 'Flag disabled');
  await loadFlags();
};

const updateRollout = async (flag) => {
  await updateFlag(flag.id, { rollout_percentage: flag.rollout_percentage });
  showMessage('Rollout updated');
  await loadFlags();
};

const openDeleteDialog = (id) => { selectedFlagId.value = id; deleteDialog.value = true; };

const confirmDelete = async () => {
  await deleteFlag(selectedFlagId.value);
  deleteDialog.value = false;
  showMessage('Flag deleted');
  await loadFlags();
  loadFlags();
};

watch(env, () => {
  loadFlags();
});

onMounted(loadFlags);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

:deep(*) { font-family: 'Plus Jakarta Sans', sans-serif; }

/* Sidebar */
:deep(.ff-sidebar) {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}
.ff-brand {
  display: flex; align-items: center; gap: 10px;
  padding: 20px 16px 14px;
}
.ff-brand--mini { justify-content: center; padding: 20px 12px 14px; }
.ff-brand__icon {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: rgba(var(--v-theme-surface-variant), 1);
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  display: flex; align-items: center; justify-content: center;
}
.ff-brand__name { font-size: 16px; font-weight: 700; letter-spacing: -0.3px; }
:deep(.ff-nav .v-list-item) { font-size: 14px; margin-bottom: 2px; }
:deep(.ff-nav .v-list-item--active) { font-weight: 600; }

/* Topbar */
:deep(.ff-topbar) {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}
.ff-topbar__title {
  font-size: 15px !important; font-weight: 600 !important;
  display: flex; align-items: center; gap: 8px;
}
.ff-topbar__dot {
  display: inline-block; width: 6px; height: 6px;
  background: rgb(var(--v-theme-primary)); border-radius: 50%;
}
.ff-env-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: rgb(var(--v-theme-success));
  display: inline-block; margin-right: 4px;
  animation: blink 2s ease-in-out infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }

/* Stats */
.ff-stat-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  position: relative; overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.ff-stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.07) !important; }
.ff-stat-label {
  font-size: 11px; font-weight: 600; letter-spacing: 0.5px;
  text-transform: uppercase; margin-bottom: 6px;
  color: rgba(var(--v-theme-on-surface), 0.5);
}
.ff-stat-value { font-size: 28px; font-weight: 700; line-height: 1; letter-spacing: -0.5px; }
.ff-stat-bar {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 3px; border-radius: 0 0 12px 12px; opacity: 0.8;
}

/* Controls */
:deep(.ff-filter-toggle) {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
:deep(.ff-filter-toggle .v-btn) {
  text-transform: none; letter-spacing: 0; font-size: 13px; font-weight: 500;
}
:deep(.ff-filter-toggle .v-btn--active) {
  background: rgb(var(--v-theme-primary)); color: white;
}
.ff-create-btn { text-transform: none !important; letter-spacing: 0 !important; font-weight: 600 !important; }

/* Table */
.ff-table-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
:deep(.ff-table .v-data-table-header__content span) {
  font-size: 11px !important; font-weight: 600 !important;
  text-transform: uppercase; letter-spacing: 0.6px;
  color: rgba(var(--v-theme-on-surface), 0.45);
}
:deep(.ff-table .v-data-table__td) { padding-top: 13px !important; padding-bottom: 13px !important; }
:deep(.ff-table tbody tr:hover > td) { background: rgba(var(--v-theme-primary), 0.04) !important; }

.ff-flag-key {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; font-weight: 500;
  color: rgb(var(--v-theme-info));
  background: rgba(var(--v-theme-info), 0.1);
  padding: 3px 8px; border-radius: 6px;
}
.ff-status-chip { font-weight: 600 !important; }
.ff-rollout-wrap { min-width: 160px; }
.ff-empty { padding: 52px 0; display: flex; flex-direction: column; align-items: center; }

/* Dialogs */
.ff-dialog { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.ff-dialog-title { font-size: 16px; font-weight: 600; }
.ff-field-label {
  font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
  color: rgba(var(--v-theme-on-surface), 0.5); display: block;
}
:deep(.ff-key-input .v-field__prefix) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px; color: rgba(var(--v-theme-on-surface), 0.4);
}
</style>
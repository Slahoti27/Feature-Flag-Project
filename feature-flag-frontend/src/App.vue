<template>
  <v-app>
    <v-container class="pa-6">

      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <h1 class="text-h4">🚀 Feature Flags</h1>

        <v-btn color="primary" @click="dialog = true">
          + New Flag
        </v-btn>
      </div>

      <!-- Table -->
      <v-card>
        <v-data-table :headers="headers" :items="flags">

          <!-- Status Chip -->
          <template #item.is_enabled="{ item }">
            <v-chip :color="item.is_enabled ? 'green' : 'grey'" dark>
              {{ item.is_enabled ? 'ON' : 'OFF' }}
            </v-chip>

            <v-switch
              v-model="item.is_enabled"
              @change="toggleFlag(item)"
              inset
            />
          </template>

          <!-- Editable Rollout -->
          <template #item.rollout_percentage="{ item }">
            <v-text-field
              v-model="item.rollout_percentage"
              type="number"
              density="compact"
              style="max-width: 80px"
              @blur="updateRollout(item)"
            />
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <v-btn color="red" icon @click="removeFlag(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>

        </v-data-table>
      </v-card>

      <!-- Create Dialog -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title>Create Feature Flag</v-card-title>

          <v-card-text>
            <v-text-field v-model="form.name" label="Name" />
            <v-text-field v-model="form.key" label="Key" />
            <v-text-field
              v-model="form.rollout_percentage"
              label="Rollout %"
              type="number"
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn text @click="dialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="handleCreate">
              Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar -->
      <v-snackbar v-model="snackbar.show" timeout="2000">
        {{ snackbar.text }}
      </v-snackbar>

    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  getFlags,
  createFlag,
  updateFlag,
  deleteFlag
} from './services/api';

const flags = ref([]);
const dialog = ref(false);

const snackbar = ref({
  show: false,
  text: '',
});

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Key', key: 'key' },
  { title: 'Status', key: 'is_enabled' },
  { title: 'Rollout %', key: 'rollout_percentage' },
  { title: 'Actions', key: 'actions' },
];

const form = ref({
  name: '',
  key: '',
  rollout_percentage: 0,
  is_enabled: false,
});

const loadFlags = async () => {
  flags.value = await getFlags();
};

const showMessage = (text) => {
  snackbar.value.text = text;
  snackbar.value.show = true;
};

const handleCreate = async () => {
  await createFlag(form.value);

  dialog.value = false;
  showMessage('Flag created ✅');

  form.value = {
    name: '',
    key: '',
    rollout_percentage: 0,
    is_enabled: false,
  };

  loadFlags();
};

const toggleFlag = async (flag) => {
  await updateFlag(flag.id, {
    is_enabled: flag.is_enabled,
  });

  showMessage('Flag updated');
};

const updateRollout = async (flag) => {
  await updateFlag(flag.id, {
    rollout_percentage: flag.rollout_percentage,
  });

  showMessage('Rollout updated');
};

const removeFlag = async (id) => {
  await deleteFlag(id);
  showMessage('Flag deleted 🗑️');
  loadFlags();
};

onMounted(loadFlags);
</script>
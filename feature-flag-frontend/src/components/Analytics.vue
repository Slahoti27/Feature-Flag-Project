<template>
  <v-row class="mb-6">

    <v-col cols="12" md="6">
      <v-card class="pa-4 rounded-xl">
        <div style="height: 250px;">
            <BarChart :data="usageData" />
        </div>
        </v-card>
    </v-col>

    <v-col cols="12" md="6">
      <v-card class="pa-4 rounded-xl">
        <div style="height: 250px;">
            <PieChart :data="statusData" />
        </div>
        </v-card>
    </v-col>

  </v-row>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BarChart from './BarChart.vue';
import PieChart from './PieChart.vue';

const usageData = ref([]);
const statusData = ref([]);

const loadAnalytics = async () => {
  const res = await fetch('http://localhost:5000/api/flags/analytics');
  const data = await res.json();

  usageData.value = data.usage.map(item => ({
    name: item.flagKey,
    value: Number(item.count),
  }));

  statusData.value = data.status.map(item => ({
    name: item.enabled ? 'Enabled' : 'Disabled',
    value: Number(item.count),
  }));
};

onMounted(loadAnalytics);
</script>
<template>
  <Pie :data="chartData" :options="options" />
</template>

<script setup>
import { computed } from 'vue';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

import { Pie } from 'vue-chartjs';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const props = defineProps(['data']);

const COLORS = [
  '#22C55E',
  '#EF4444',
];

const chartData = computed(() => ({
  labels: props.data.map(d => d.name),
  datasets: [
    {
      data: props.data.map(d => d.value),
      backgroundColor: COLORS,
      borderColor: '#00000020',
        borderWidth: 1,
      borderRadius: 8,
    }
  ]
}));

const options = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: '#9CA3AF',
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#9CA3AF',
      }
    },
    y: {
      ticks: {
        color: '#9CA3AF',
      }
    }
  }
};
</script>
<template>
  <Bar :data="chartData" :options="options" />
</template>

<script setup>
import { computed } from 'vue';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

import { Bar } from 'vue-chartjs';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const props = defineProps(['data']);

const COLORS = [
  '#6366F1',
  '#22C55E',
  '#F59E0B',
  '#EF4444',
  '#06B6D4',
  '#A855F7',
];


const chartData = computed(() => ({
  labels: props.data.map(d => d.name),
  datasets: [
    {
      label: 'Usage Count',
      data: props.data.map(d => d.value),
      backgroundColor: props.data.map((_, i) => COLORS[i % COLORS.length]),
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
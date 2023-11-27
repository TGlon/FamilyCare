import { createApp } from 'vue';
import './assets/styles/global.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import vClickOutside from 'vue-click-outside'; // Import vue-click-outside

import App from './App.vue';
import router from './router';
import { Chart, registerables } from "chart.js";
import * as ChartJSDateAdapter from 'chartjs-adapter-date-fns';

// Register the date-fns adapter
Chart.register(ChartJSDateAdapter);

// Register any additional chart.js plugins
Chart.register(...registerables);
const app = createApp(App);

app.use(vClickOutside); // Đăng ký plugin vue-click-outside

app.use(router);
app.mount('#app');


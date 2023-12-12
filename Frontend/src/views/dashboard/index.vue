<template>
  <div style="border: 1px solid var(--gray); border-radius: 5px">
    <div class="button-container" style="padding-top: 28px">
      <button @click="toggleChart('medical')" class="custom-button">
        <span
          class="material-symbols-outlined"
          style="font-size: 70px; margin-right: 20px; color: #ec8f5e"
        >
          blood_pressure
        </span>
        TIỀN SỬ BỆNH TẬT
      </button>
      <button @click="toggleChart('vaccination')" class="custom-button">
        <span
          class="material-symbols-outlined"
          style="font-size: 70px; margin-right: 20px; color: #a6cf98"
        >
          vaccines
        </span>
        LỊCH SỬ TIÊM NGỪA
      </button>
      <button class="custom-button" @click="togglePieChart()">
        <span
          class="material-symbols-outlined"
          style="font-size: 70px; margin-right: 20px; color: #ce5a67"
        >
          prescriptions
        </span>
        THUỐC HAY SỬ DỤNG
      </button>
      <button class="custom-button" @click="toggleLineChart()">
        <span
          class="material-symbols-outlined"
          style="font-size: 70px; margin-right: 20px; color: #00a9ff"
        >
          diagnosis
        </span>
        HỒ SƠ SỨC KHỎE
      </button>
    </div>
    <div class="lineChart-container" v-if="lineChartVisible">
      <canvas id="healthChart" :width="600" :height="300"></canvas>
    </div>
    <div class="piechart-container">
      <canvas id="pieChart"></canvas>
    </div>
    <div class="chart-container">
      <canvas id="myChart" :width="600" :height="220"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from "vue";
import {
  http_getAllMedicalByUserId,
  http_getAll,
} from "../../assets/js/common.http";
import Medical from "../../services/medical.service";
import Vaccination from "../../services/vaccination.service";
import Chart from "chart.js/auto";
import Medicine from "../../services/medicine.service";
import Health from "../../services/health_statistics.service";
import { format } from "date-fns";

export default {
  setup() {
    const chartData = ref([]);
    const chartLabels = ref([]);
    const chartVisible = ref(false);
    const chartType = ref("medical"); // Added to track which chart is currently displayed

    const loadData = async (type) => {
      const id = sessionStorage.getItem("UserId");
      let data;

      if (type === "medical") {
        data = await http_getAllMedicalByUserId(Medical, id);
        // Lọc dữ liệu để chỉ bao gồm các mục có Appointment không null
        data = data.filter((item) => item.Appointment !== null);
      } else {
        data = await http_getAll(Vaccination);
        // Lọc dữ liệu để chỉ bao gồm các mục có UserId trùng với id
        data = data.filter((item) => item.Appointment.UserId === id);
      }

      const countData = {};

      if (Array.isArray(data)) {
        data.forEach((item) => {
          const label = type === "medical" ? item.diagnosis : item.vaccination;
          if (countData[label]) {
            countData[label]++;
          } else {
            countData[label] = 1;
          }
        });

        chartLabels.value = Object.keys(countData);
        chartData.value = Object.values(countData);
      }
    };
    const loadMedicineData = async () => {
      const id = sessionStorage.getItem("UserId");
      const data = await http_getAll(Medicine);
      const medical = await http_getAllMedicalByUserId(Medical, id);
      const medicalWithAppointments = medical.filter(
        (record) => record.Appointment !== null
      );

      const filteredData = data.filter((item) =>
        medicalWithAppointments.some(
          (record) => record._id === item.MedicalHistoryId
        )
      );
      console.log(filteredData);
      const chartData = [];
      const chartLabels = [];
      const chartColors = [
        "#FF5733",
        "#FFC300",
        "#33FF57",
        "#FF33A6",
        "#33A6FF",
        "#33FFA6",
        "#FF33C3",
        "#33C3FF",
        "#33FFC3",
        "#FF3366",
        "#3366FF",
        "#33FF66",
        "#6633FF",
        "#33FF33",
        "#FF6633",
        "#FF3366",
        "#66FF33",
        "#3366FF",
        "#FF5733",
        "#FFC300",
        "#33FF57",
        "#FF33A6",
        "#33A6FF",
        "#33FFA6",
        "#FF33C3",
        "#33C3FF",
        "#33FFC3",
        "#FF3366",
        "#3366FF",
        "#33FF66",
        "#6633CC",
        "#FF9900",
        "#99FF33",
        "#CC33FF",
        "#FF0066",
        "#33CCFF",
        "#FFCC00",
        "#00FF66",
        "#9966FF",
        "#FF6600",
        "#00FFCC",
        "#FF6666",
        "#66CCFF",
        "#FFCC33",
        "#33FF99",
        "#CC66FF",
        "#FF99FF",
        "#FF3300",
        "#66FF99",
        "#FF3399",
        "#99FF66",
        "#FF9933",
        "#0099FF",
        "#FF6666",
        "#33FF99",
        "#FF66CC",
        "#66FFCC",
        "#FF99CC",
        "#3399FF",
        "#FFCC66",
        "#FF3366",
        "#66FF33",
        "#33CCFF",
        "#FF6633",
        "#FF9933",
        "#99FF66",
        "#FF33A6",
        "#33A6FF",
        "#33FFA6",
        "#FF33C3",
        "#33C3FF",
        "#33FFC3",
        "#FF3366",
        "#3366FF",
        "#33FF66",
      ];

      if (Array.isArray(filteredData)) {
        const labelCountMap = new Map();

        filteredData.forEach((item) => {
          const label = item.name.trim().toLowerCase(); // Trim whitespace and convert to lowercase
          const originalLabel = item.name;

          if (labelCountMap.has(label)) {
            // Use the lowercase label for comparison
            labelCountMap.set(label, labelCountMap.get(label) + 1);
          } else {
            labelCountMap.set(label, 1);
          }
        });

        labelCountMap.forEach((count, label) => {
          chartLabels.push(label);
          chartData.push(count);
        });
      }

      console.log("Filtered Data:", filteredData);
      console.log("Chart Labels:", chartLabels);
      console.log("Chart Data:", chartData);

      // console.log("Chart data:", chartData);

      const canvas = document.getElementById("pieChart");
      // console.log("Canvas element:", canvas);

      if (canvas) {
        const ctx = canvas.getContext("2d");

        if (window.myPieChart) {
          if (typeof window.myPieChart.destroy === "function") {
            window.myPieChart.destroy();
            // console.log("Previous pie chart destroyed.");
          } else {
            console.warn("Pie Chart already exists but has no destroy method.");
          }
        }

        window.myPieChart = new Chart(ctx, {
          type: "pie",
          data: {
            labels: chartLabels,
            datasets: [
              {
                data: chartData,
                backgroundColor: chartColors,
              },
            ],
          },
          options: {
            plugins: {
              title: {
                display: true,
                text: "Biểu Đồ Phân Phối Thuốc Hay Sử Dụng", // Đặt tên cho biểu đồ tròn ở đây
                position: "bottom",
                fontSize: 50,
              },
              legend: {
                display: true,
                // position: "right",
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const data = context.chart.data.datasets[0].data;
                    const total = data.reduce((acc, value) => acc + value, 0);
                    const value = data[context.dataIndex];
                    const percentage = ((value / total) * 100).toFixed(2);
                    return `${context.label}: ${value} (${percentage}%)`;
                  },
                },
              },
            },
          },
        });
      }
    };

    const togglePieChart = () => {
      chartVisible.value = !chartVisible.value;
      const pieChartCanvas = document.getElementById("pieChart");

      if (chartVisible.value) {
        if (!pieChartCanvas) {
          // Tạo chart hoặc hiển thị chart đã tồn tại
          loadMedicineData();
        } else {
          pieChartCanvas.style.display = "block"; // Hiển thị lại chart nếu đã tồn tại
        }
      } else {
        if (pieChartCanvas) {
          pieChartCanvas.style.display = "none"; // Ẩn chart nếu chart đã tồn tại và trạng thái là false
        }
      }
    };
    const createChart = () => {
      const canvas = document.getElementById("myChart");
      if (canvas) {
        const ctx = canvas.getContext("2d");

        if (window.myChart) {
          if (typeof window.myChart.destroy === "function") {
            window.myChart.destroy();
          } else {
            console.warn("Chart already exists but has no destroy method.");
          }
        }

        window.myChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: chartLabels.value,
            datasets: [
              {
                label: "Số Lần",
                data: chartData.value,
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                borderColor: "red",
                borderWidth: 1,
                barPercentage: 0.5,
                categoryPercentage: 0.7,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Số Lần",
                },
              },
              x: {
                title: {
                  display: true,
                  text:
                    chartType.value === "medical"
                      ? "Biểu Đồ Thống Kê Số Lần Bệnh"
                      : "Biểu Đồ Thống Kê Số Lần Tiêm Ngừa",
                },
              },
            },
          },
        });
      }
    };

    const toggleChart = async (type) => {
      chartType.value = type; // Set the chart type to the selected type

      chartVisible.value = !chartVisible.value;

      const canvas = document.getElementById("myChart");

      if (chartVisible.value) {
        if (!canvas) {
          const canvasContainer = document.querySelector(".chart-container");
          canvas = document.createElement("canvas");
          canvas.id = "myChart";
          canvasContainer.appendChild(canvas);
        }

        const id = sessionStorage.getItem("UserId");
        await loadData(type);
        createChart();
      } else {
        if (canvas) {
          canvas.style.display = "none";
        }
      }
    };

    const healthData = ref([]);
    const id = sessionStorage.getItem("UserId");
    const loadHealthData = async () => {
      // Assuming http_getAll returns an array of Health objects
      healthData.value = await http_getAll(Health);
      healthData.value = healthData.value.filter((item) => item.UserId === id);
      // healthData.value.filter(item => item.UserId === id);
      // console.log(healthData.value);
    };

    const createHealthChart = () => {
      const canvas = document.getElementById("healthChart");

      if (canvas) {
        const ctx = canvas.getContext("2d");
        // console.log(healthData.value);
        // Extracting data for the chart
        // const filteredHealthData = healthData.value;
        // console.log(filteredHealthData);
        const labels = healthData.value.map((entry) => entry.recording_date);
        const bloodPressureData = healthData.value.map(
          (entry) => entry.blood_pressure
        );
        const heartRateData = healthData.value.map((entry) => entry.heart_rate);
        const heightData = healthData.value.map((entry) => entry.height);
        const weightData = healthData.value.map((entry) => entry.weight);

        if (window.myHealthChart) {
          window.myHealthChart.destroy();
        }

        window.myHealthChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Huyết Áp",
                data: bloodPressureData,
                borderColor: "#EE9322",
                borderWidth: 2,
                fill: false,
              },
              {
                label: "Nhịp Tim",
                data: heartRateData,
                borderColor: "rgba(255, 0, 0, 1)",
                borderWidth: 2,
                fill: false,
              },
              {
                label: "Chiều Cao",
                data: heightData,
                borderColor: "rgba(0, 0, 255, 1)",
                borderWidth: 2,
                fill: false,
              },
              {
                label: "Cân Nặng",
                data: weightData,
                borderColor: "#79AC78", // Adjust color as needed
                borderWidth: 2,
                fill: false,
              },
              // Add more datasets for other health metrics if needed
            ],
          },
          options: {
            scales: {
              x: {
                type: "time",
                time: {
                  unit: "day",
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Health Metrics",
                },
              },
            },
            plugins: {
              title: {
                display: true,
                text: "Biểu Đồ Thống Kê Sức Khỏe Cá Nhân",
                position: "bottom",
              },
            },
          },
        });
      }
    };
    const lineChartVisible = ref(false);
    const toggleLineChart = async () => {
      lineChartVisible.value = !lineChartVisible.value;
      if (lineChartVisible.value) {
        await loadHealthData();
        createHealthChart();
      }
    };

    onMounted(async () => {
      // Load medical data by default when the component is mounted
      loadData("medical");
      loadMedicineData();
      await loadHealthData();
      createHealthChart();
    });

    return {
      toggleChart,
      togglePieChart,
      lineChartVisible,
      toggleLineChart,
    };
  },
};
</script>

<style scoped>
.button-container {
  display: flex;
  flex-direction: row; /* Hiển thị các button cùng một hàng ngang */
  /* border-bottom: 1px solid var(--gray); */
}
.custom-button {
  /* background-color: #007bff; */
  background-color: #fff;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  border: 1px solid var(--gray);
  align-items: center;
  height: 100px;
  margin-left: 55px;
  margin-bottom: 30px;
  /* box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.5); */
  font-weight: bold;
  max-width: 300px;
}
.custom-button:hover {
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.5);
}
.chart-container {
  text-align: center !important; /* Center the chart horizontally */
  display: flex !important;
  justify-content: center !important; /* Center the chart vertically and horizontally */
  align-items: center !important;
  /* margin-top: 20px !important; Add top margin for spacing */
}

#myChart {
  max-width: 100%; /* Ensure the chart doesn't exceed its container */
  /* transition: width 0.3s, height 0.3s; Add a smooth transition for resizing */
}

#pieChart {
  width: 550px !important; /* Đặt chiều rộng mong muốn */
  height: 550px !important; /* Đặt chiều cao mong muốn */
  margin-left: 380px;
  margin-top: 20px;
}
.piechart-container {
  /* border: 1px solid var(--gray); */
  /* border-radius: 5px; */
  margin: 0px 10px;
  margin-bottom: 10px;
  /* box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5); */
}
#healthChart {
  width: 1200px !important;
  height: 500px !important;
  margin-left: 50px;
}
#lineChart-container {
  text-align: center !important; /* Center the chart horizontally */
  display: flex !important;
  justify-content: center !important; /* Center the chart vertically and horizontally */
  align-items: center !important;
}
</style>

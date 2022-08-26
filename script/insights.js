import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-database.js"

const firebaseConfig = {
  apiKey: "AIzaSyDRHTl7hx5umlfi2HFnXt2kCDbNZPCw4iI",
  authDomain: "happiness-f3909.firebaseapp.com",
  projectId: "happiness-f3909",
  storageBucket: "happiness-f3909.appspot.com",
  messagingSenderId: "833703649555",
  appId: "1:833703649555:web:c56123255b7bb49e023ae6",
  databaseURL: "https://happiness-f3909-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const resultRef = ref(database, 'average/state');
const cityRef = ref(database, 'average/school');
var myChart = null

const selectData = $("#select-data");
selectData.append(`<option>${"score"}</option>`);
selectData.append(`<option>${"users"}</option>`);
selectData.append(`<option>${"city"}</option>`);

const selectChart = $("#select-chart");
selectChart.append(`<option>${"bar"}</option>`);
selectChart.append(`<option>${"line"}</option>`);
selectChart.append(`<option>${"pie"}</option>`);

// To detect change in data dropdown
$(() => {
  $("#select-data").change(() => {
    const optionData = $("#select-data").find("option:selected");
    const optionChart = $("#select-chart").find("option:selected");
    const isDefault = optionData.attr("data-default") !== undefined;

    if (isDefault) {
      return;
    }

    const data = optionData.val();
    const chart = optionChart.val()
    representData(data, chart)
  })
});

// To detect change in chart dropdown
$(() => {
  $("#select-chart").change(() => {
    const optionData = $("#select-data").find("option:selected");
    const optionChart = $("#select-chart").find("option:selected");
    const isDefault = optionData.attr("data-default") !== undefined;

    if (isDefault) {
      return;
    }

    const data = optionData.val();
    const chart = optionChart.val()
    representData(data,chart)
  })
});


function createChart(xValues, yValues, barColors, type) {
  if(myChart){
    myChart.destroy()
  }
  myChart = new Chart("myChart", {
    type: type,
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues
      }]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: "Happiness Report"
      }
    }
  });
}

function representData(data, ChartType) {
  const barColors = ["red", "green", "blue", "orange", "brown", "chartreuse", "crimson", "cyan", "darkblue", "darkgrey", "darkorange", "darkslateblue", "darkorchid", "forestgreen", "dodgerblue", "deeppink", "turquoise", "greenyellow", "teal", "lightsalmon", "lightseagreen", "lime", "magenta", "maroon", "mediumblue", "mediumspringgreen", "orange", "navy", "peru", "plum", "red", "royalblue", "silver", "slateblue", "yellow"];

  switch (data) {
    case 'score':
      get(resultRef).then((snap) => {
        const average = snap.val();
        const score = Object.values(average)
        const averageScore = score.map(function (item) { return item["averageScore"] })

        createChart(Object.keys(average), score.map(function (item) { return item["averageScore"] }), barColors, ChartType)
      });
      break
    case 'users':
      get(resultRef).then((snap) => {
        const average = snap.val();
        const score = Object.values(average)
        const averageScore = score.map(function (item) { return item[""] })

        createChart(Object.keys(average), score.map(function (item) { return item["totalUsers"] }), barColors, ChartType)
      });
      case 'city':
        get(cityRef).then((snap) => {
          const average = snap.val();
          const score = Object.values(average)
          const averageScore = score.map(function (item) { return item["averageScore"] })
  
          createChart(Object.keys(average), score.map(function (item) { return item["averageScore"] }), barColors, ChartType)
        });
        break
  }

}
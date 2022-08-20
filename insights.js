import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
import { getDatabase, set, ref, get,push } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-database.js"

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
  const quizRef = ref(database, '/');


var xValues = ["Italy", "France", "Spain", "USA", "Argentina","dttrht","ejkfwwi","rjhrh","rjhrh","rjhrh","rjhrh","rjhrh","rjhrh"];
var yValues = [55, 49, 44, 24, 15];
var barColors = ["red", "green","blue","orange","brown"];



new Chart("myChart", {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "Happiness Report"
    }
  }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
import { getDatabase, ref, get, query, equalTo, orderByChild, onChildAdded } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-database.js"

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
const resultRef = ref(database, 'result');
var x = {};

const  stateRef= query(resultRef,orderByChild("info/state"), equalTo("Maharashtra"));
onChildAdded(stateRef,(snap) => {
  const stateData = snap.val()
  representData(stateData)
});

function representData(data){
  const scores = data["info"]["score"]
  // const averagScore = scores.reduce((a,b) => a+b) / scores.length()
  console.log([11,2,3].reduce((a,b)=>a+b))
  console.log(scores)
}

var xValues = ["Italy", "France", "Spain", "USA", "Argentina", "dttrht", "ejkfwwi", "rjhrh", "rjhrh", "rjhrh", "rjhrh", "rjhrh", "rjhrh"];
var yValues = [5,60,0,0];
var barColors = ["red", "green", "blue", "orange", "brown"];



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
    legend: { display: false },
    title: {
      display: true,
      text: "Happiness Report"
    }
  }
});

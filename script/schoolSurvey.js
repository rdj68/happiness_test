import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-database.js"

//to check if id exists
const id = localStorage.getItem("id")
checkId()
// list of question IDs in the order which they must be shown
var questionIds = null;

// mapping of question ids to question objects
var questions = null;

// mapping of question id to answer
const selections = {};

//total score
var totalScore = 0;
var maxScore = 5;

const happinessScore = localStorage.getItem("score")

// Index of question ID in `questionIds` of the question currently being displayed
var currentQuestionIndex = 0;

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
const quizRef = ref(database, 'schoolSurvey/');

const resultRef = ref(database, 'result/' + id)

// Read questions from database
get(quizRef).then((snap) => {
    const questions = snap.val();
    presentQuestions(questions);
});


/**
 * Starts presenting questions received from Firebase
 *
 * @param {*} q the questions object from Firebase
 */
function presentQuestions(q) {
    questions = q;
    questionIds = Object.keys(q);
    currentQuestionIndex = 0;

    displayQuestion();
}

function getAnswerForCurrentQuestion() {
    return +$('input[name="answer"]:checked').val();
}

// set handlers for buttons on window load
window.onload = () => {
    const quizView = $('#quiz');

    $('#next').on('click', function (e) {
        e.preventDefault();

        // Suspend click listener during fade animation
        if (quizView.is(':animated')) {
            return false;
        }

        const currentQuestionId = questionIds[currentQuestionIndex];
        selections[currentQuestionId] = getAnswerForCurrentQuestion();

        // If no user selection, progress is stopped
        if (isNaN(selections[currentQuestionId])) {
            alert('Please make a selection!');
            return;
        }

        currentQuestionIndex = Math.min(questionIds.length - 1, currentQuestionIndex + 1);
        displayQuestion();
    });

    $('#prev').on('click', function (e) {
        e.preventDefault();
        if (quizView.is(':animated')) {
            return false;
        }

        const currentQuestionId = questionIds[currentQuestionIndex];
        selections[currentQuestionId] = getAnswerForCurrentQuestion();

        if (isNaN(selections[currentQuestionId])) {
            alert('Please make a selection!');
            return;
        }

        currentQuestionIndex = Math.max(0, currentQuestionIndex - 1);
        displayQuestion();
    });

    $('#submit').on('click', function (e) {
        e.preventDefault();
        if (quizView.is(':animated')) {
            return false;
        }

        const currentQuestionId = questionIds[currentQuestionIndex];
        selections[currentQuestionId] = getAnswerForCurrentQuestion();


        if (isNaN(selections[currentQuestionId])) {
            alert('Please make a selection!');
            return;
        }

        //Calculation of total score
        // var summationWeight = 0;
        // const weightedScores = questionIds.map((questionId) => {
        //     const invert = questions[questionId].invert;
        //     const weight = questions[questionId].weight;
        //     const selection = selections[questionId];

        //     summationWeight = summationWeight + weight;

        //     return ((invert ? selection + 1 : maxScore - selection) / 5) * weight;
        // });
        // const weightedMean = weightedScores.reduce((a, b) => a + b) / summationWeight;


        // console.log(weightedMean);
        displayResult(Number(happinessScore));
        updateResult(selections, resultRef);
        localStorage.clear("id","score")
    });
};

/** 
 * Creates a list of the answer choices as radio inputs
 */
function createOptions() {
    const radioList = $('<ul>');
    const options = ["⭐","⭐⭐","⭐⭐⭐","⭐⭐⭐⭐","⭐⭐⭐⭐⭐"];

    options.forEach((option, inx) => {
        const item = $('<li>');
        const input = `
            <label class="radio">
                <input type="radio" name="answer" value="${inx}"/>
                ${option}
            </label>
        `
        item.append(input);
        radioList.append(item);
    });

    return radioList;
}

/** 
 * Creates and returns the div that contains the questions and 
 * the answer selections
 */
function createQuestionElement(question, questionNumber) {
    const qElement = $('<div>', {
        id: 'question'
    });

    const header = $(`<h2 class="subtitle is-size-4">Question #${questionNumber}</h2>`);
    qElement.append(header);
    qElement.append($('<h3 class="is-size-5 has-text-weight-bold mb-3">').append(question.question));

    const radioButtons = createOptions();
    qElement.append(radioButtons);

    return qElement;
}

/**
 * Removes any question currently being displayed from view and display 
 * the one required according to `currentQuestionIndex`
 */
function displayQuestion() {

    const quizView = $('#quiz');
    const currentQuestionId = questionIds[currentQuestionIndex];
    const question = questions[currentQuestionId];

    const progress = $("#progress");
    progress.attr("max", questionIds.length);
    progress.val(currentQuestionIndex);

    quizView.fadeOut(function () {
        $('#question').remove();

        quizView.append(createQuestionElement(question, currentQuestionIndex + 1)).fadeIn();

        const selectedOption = selections[currentQuestionId];

        // Make the appropriate radio button checked if this question was previously answered
        if (!(isNaN(selectedOption))) {
            $('input[value=' + selectedOption + ']').prop('checked', true);
        }

        // Show/hide prev and next buttons depending on
        // whether or not we are at first or last question
        if (currentQuestionIndex > 0) {
            $('#prev').show();
        } else {
            $('#prev').hide();
        }
        if (currentQuestionIndex < questionIds.length - 1) {
            $('#next').show();
            $('#submit').hide()
        } else {
            $('#next').hide();
            $('#submit').show();
        }
    });
}

//To display the final result
function displayResult(score) {

    $('#title').hide()
    const quizView = $('#quiz');

    quizView.fadeOut(function () {
        $('#question').remove();

        quizView.append(`Your score is ${score * 100}`).fadeIn();
        $('#prev').hide();
        $('#submit').hide();
    });
}

//Update result to database
function updateResult(result, resultReference) {
    console.log(result)
    update(resultReference, {
        survey: result
    });
}
//to redirect to login page if id doesnot exist
function checkId() {
    if (!id) {
        window.location = "/login.html"
    }
}
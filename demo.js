// list of question IDs in the order which they must be shown
var questionIds = null;

// mapping of question ids to question objects
var questions = null;

// mapping of question id to answer
const selections = {};
const selectionsWeight = {};

//total score
var totalScore = 0;
var maxScore = 5;


// Index of question ID in `questionIds` of the question currently being displayed
var currentQuestionIndex = 0;

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
        selectionsWeight[currentQuestionId] = questions[currentQuestionId].weight

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
        selectionsWeight[currentQuestionId] = questions[currentQuestionId].weight

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
        //total no of questions
        totalQuestion = Object.keys(questions).length

        const currentQuestionId = questionIds[currentQuestionIndex];
        selections[currentQuestionId] = getAnswerForCurrentQuestion();
        selectionsWeight[currentQuestionId] = questions[currentQuestionId].weight
        

        if (isNaN(selections[currentQuestionId])) {
            alert('Please make a selection!');
            return;
        }

        //Calculation of total score
        for (let i=1; i<=currentQuestionId; i++){
            totalScore = totalScore + (selections[i] +1) * selectionsWeight[i];
            console.log(totalScore)
        }
        totalScore = totalScore/totalQuestion
        console.log(totalScore)
        
        currentQuestionIndex = Math.max(0, currentQuestionIndex - 1);

        displayResult(totalScore,5)
        
    });
};

/** 
 * Creates a list of the answer choices as radio inputs
 */
function createOptions() {
    var radioList = $('<ul>');
    var item;
    var input = '';

    const options = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

    for (var i = 0; i < options.length; i++) {
        item = $('<li>');
        input = '<input type="radio" name="answer" value=' + i + ' />';
        input += options[i];
        item.append(input);
        radioList.append(item);
    }
    return radioList;
}

/** 
 * Creates and returns the div that contains the questions and 
 * the answer selections
 */
function createQuestionElement(question, questionNumber) {
    var qElement = $('<div>', {
        id: 'question'
    });

    var header = $('<h2>Question ' + questionNumber + ':</h2>' );
    qElement.append(header);

    qElement.append($('<p>').append(question.question));

    var radioButtons = createOptions();
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
            $('#submit').show()
        }
    });
}

//To display the final result
function displayResult(score,maxScore){

    const quizView = $('#quiz');

    quizView.fadeOut(function () {
        $('#question').remove();

        quizView.append("Your score is "+ score/maxScore * 100).fadeIn();
        $('#prev').hide();
        $('#submit').hide()

    });
}
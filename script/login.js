import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";
import * as db from "https://www.gstatic.com/firebasejs/9.9.2/firebase-database.js"

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
const database = db.getDatabase(app);
var id = localStorage.getItem("id");
var resultRef = db.ref(database, 'result/' + id);

const regionsRef = db.ref(database, 'regions');
const statesRef = db.ref(database, 'states');
db.get(statesRef).then((snap) => {

    // Remove any existing state options
    $("#select-state > option:not([data-default])").remove();
    const selectState = $("#select-state");

    snap.val().forEach((state) => {
        selectState.append(`<option>${state}</option>`);
    });
});

//Append options to class
$("#select-class > option:not([data-default])").remove();
const selectClass = $("#select-class");
selectClass.append(`<option>${"1-4"}</option>`);
selectClass.append(`<option>${"5-8"}</option>`);
selectClass.append(`<option>${"9-12"}</option>`);
selectClass.append(`<option>${"staff"}</option>`);

$(() => {
    $("#select-state").change(() => {
        const option = $("#select-state").find("option:selected");
        const isDefault = option.attr("data-default") !== undefined;

        if (isDefault) {
            $("#district-box").addClass("is-hidden");
            return;
        }

        $("#help-state").addClass("is-hidden");

        const state = option.val();
        const districtRef = getDistrictRef(state);
        loadDistricts(districtRef);

        $("#district-box").removeClass("is-hidden");
    });

    $("#select-district").change(() => {
        $("#help-district").addClass("is-hidden");
    });

    $("#input-name").change(() => {
        $("#help-name").addClass("is-hidden");
    });

    $("#input-school").change(() => {
        $("#help-name").addClass("is-hidden");
    });

    $("#input-email").change(() => {
        $("#help-email").addClass("is-hidden");
    });
    $("#select-class").change(() => {
        $("#help-class").addClass("is-hidden");
    });


    $("#login-button").on("click", onClickLogin);
});

function getDistrictRef(state) {
    return db.child(regionsRef, state);
}

async function loadDistricts(ref) {
    // Remove any existing district options
    $("#select-district > option:not([data-default])").remove();

    const snap = await db.get(ref);
    const selectDistrict = $("#select-district");

    snap.val().forEach((district) => {
        selectDistrict.append(`<option>${district}</option>`);
    });
}

function onClickLogin() {
    const selectedState = $("#select-state").find("option:selected");
    const selectedDistrict = $("#select-district").find("option:selected");
    const selectedClass = $("#select-class").find("option:selected");
    const name = $("#input-name").val();
    const email = $("#input-email").val();
    const school = $("#input-school").val();

    const isSelectedStateDefault = selectedState.attr("data-default") !== undefined;
    const isSelectedDistrictDefault = selectedDistrict.attr("data-default") !== undefined;
    const isSelectedClassDefault = selectedDistrict.attr("data-default") !== undefined;

    var hasErrors = false;

    if (isSelectedStateDefault) {
        $("#help-state").removeClass("is-hidden");
        hasErrors = true;
    }
    if (isSelectedClassDefault) {
        $("#help-class").removeClass("is-hidden");
        hasErrors = true;
    }
    if (isSelectedDistrictDefault) {
        $("#help-district").removeClass("is-hidden");
        hasErrors = true;
    }
    if (typeof name === "string" && name.trim() === "") {
        $("#help-name").removeClass("is-hidden");
        hasErrors = true;
    }
    if (typeof email === "string" && email.trim() === "") {
        $("#help-email").removeClass("is-hidden");
        hasErrors = true;
    }
    if (typeof school === "string" && school.trim() === "") {
        $("#help-school").removeClass("is-hidden");
        hasErrors = true;
    }

    if (!hasErrors) {
        finishLogin(
            name,
            email,
            selectedState.val(),
            selectedDistrict.val(),
            selectedClass.val(),
            school
        );
    }
}

//Update result to database
function updateResult(result, resultReference) {
    db.set(resultReference, {
        info: result
    });
}

function finishLogin(name, email, state, district,classChoice,school) {
    const obj = {
        name: name,
        email: email,
        school:school,
        state: state,
        district: district,
        class:classChoice
    };

    if (!id) {
        resultRef = db.push(db.ref(database, 'result'));
        id = resultRef.key
        localStorage.setItem("id", id);
        localStorage.setItem("class", classChoice);
    };
    updateResult(obj, resultRef);
    window.location = "mentalHealth.html";
};

function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

function openNav2() {
    document.getElementById("myNav2").style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

function closeNav2() {
    document.getElementById("myNav2").style.height = "0%";
}
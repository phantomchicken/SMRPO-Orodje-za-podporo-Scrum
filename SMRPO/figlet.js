var figlet = require("figlet");
figlet.text("SMRPO", (napaka, podatki) => {
    if (napaka) {
        console.error(napaka);
    } else {
        console.log(podatki);
    }
});

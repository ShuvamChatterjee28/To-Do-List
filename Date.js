exports.getDate = function (){
    let date = new Date();

    let locale = {
        weekday: "long",
        month: "long",
        day: "numeric"};

    return date.toLocaleString("en-GB", locale);
}
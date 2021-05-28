const load = (className, timeout) => {
    $(className).addClass("position-relative");

    setTimeout(function () {
        $(className).addClass("loaded position-relative");
    }, timeout);
    $(className).removeClass("loaded");
};

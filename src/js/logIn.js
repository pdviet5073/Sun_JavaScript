document.addEventListener("DOMContentLoaded", function () {
    Validator({
        form: "#logIn",
        formGroupSelector: ".form-group",
        errorSelector: ".form-message",
        rules: [
            Validator.isFullName("#name", "Vui lòng nhập tên đầy đủ của bạn"),
            Validator.isPhone("#phone"),
            Validator.isRequired("input[name='remember']"),
        ],
        onSubmit: function (data) {
            console.log("file: logIn_register.js > line 26 > data", data);
        },
    });
});

document.addEventListener("DOMContentLoaded", function () {
    $("label[for='url']").children()[0].remove();

    Validator({
        form: "#register",
        formGroupSelector: ".form-group",
        errorSelector: ".form-message",
        rules: [
            Validator.isFullName("#name", "Vui lòng nhập tên đầy đủ của bạn"),
            Validator.isPhone("#phone"),
            Validator.isEmail("#email"),
            Validator.isRequired("input[name='checkNote']"),
            Validator.minLength("#password", 6),
            Validator.isRequired("#rePassword"),
            Validator.isConfirmed(
                "#rePassword",
                function () {
                    return $("#register #password").val();
                },
                "Mật khẩu nhập lại không chính xác"
            ),
        ],
        onSubmit: function (data) {
            console.log("file: logIn_register.js > line 26 > data", data);
        },
    });
});

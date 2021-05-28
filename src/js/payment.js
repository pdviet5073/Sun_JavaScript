const getDataCustomer = async () => {
    try {
        const phoneNumber = $(".payment__infoCustomer-phone").text();
        const response = await axios.get(`${apiUrl}/payments?phone=${phoneNumber}&isPayment=false`);
        const data = response.data;
        let infoCustomer = data[0].infoCustomer;
        $(".payment__infoCustomer-name").html(`${infoCustomer.fullName}`);
        $(".payment__infoCustomer-address").html(`${infoCustomer.address}`);
        $(".payment__infoCustomer-email").html(`${infoCustomer.email}`);
        $(".payment__infoCustomer-phone").html(`${infoCustomer.phone}`);
        $(".payment__infoCustomer-note").html(`${infoCustomer.note === "" ? "Không có" : infoCustomer.note}`);

        return data[0];
    } catch (error) {
        return error;
    }
};

const onSubmitPayment = async (modeOfPayment) => {
    try {
        let now = new Date();
        let updatedAt = now.toLocaleString("fr-FR");

        const phoneNumber = $(".payment__infoCustomer-phone").text();
        const response = await axios.get(`${apiUrl}/payments?phone=${phoneNumber}&isPayment=false`);
        const data = response.data;

        await axios.put(`${apiUrl}/payments/${data[0].id}`, {
            ...data[0],
            ...modeOfPayment,
            isPayment: true,
            updatedAt,
        });

        localStorage.removeItem("product");

        window.location.href = `http://localhost:3000/paymentSuccess.html`;
    } catch (error) {
        return error;
    }
};

const handelView = () => {
    $(".step-2+.process-label").remove();
    $(".step-3+.process-label").html("Thanh Toán & đặt mua");
    $(" .process-wrap").removeClass("active-step2").addClass("active-step3");
    $(".infoPayment__product-left h3").removeClass("col-lg-12");
    $(".infoPayment__product-left p").removeClass("col-lg-12");
    $(".infoPayment__product-left .infoPayment__product-amount--text").removeClass("d-lg-inline");
    $(".infoPayment__product-left").addClass("h-100");
    $(".infoPayment__product-img").parent().removeClass("col-lg-4 ");
    $(".infoPayment form").removeAttr("id").prop("id", "form-payment");
    $(".button-prev").removeAttr("href").prop("href", "http://localhost:3000/infoPayment.html");
};

document.addEventListener("DOMContentLoaded", function () {
    handelView();
    getDataCustomer();
    Validator({
        form: "#form-payment",
        formGroupSelector: ".form-group",
        errorSelector: ".form-message",
        rules: [Validator.isRequired("input[name='modeOfPayment']", "Vui lòng chọn hình thức thanh toán")],
        onSubmit: function (data) {
            onSubmitPayment(data);
        },
    });
});

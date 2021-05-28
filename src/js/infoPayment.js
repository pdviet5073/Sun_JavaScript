const PORT = 3002;
const apiUrl = `http://localhost:${PORT}`;

const renderProduct = () => {
    const arrProduct = JSON.parse(localStorage.getItem("product"));
    let totalMoney = 0;
    $(".infoPayment__product").html(function () {
        return arrProduct
            .map((item) => {
                const { id, src, amount, currentPrice, nameProduct } = item;
                totalMoney += amount * currentPrice;
                return `
                <div class="infoPayment__product-item">
                    <div class="row">
                        <div class="col-lg-4 col-3">
                            <div class="infoPayment__product-img"> <img src="./assets/images/${src}.png" alt="infoPayment__product-img " /></div>
                        </div>
                        <div class="col-lg-8 col-9">
                            <div class="row align-items-center infoPayment__product-left">
                                <h3 class="col-lg-12 col-6"> <a href="#">${nameProduct}</a></h3>
                                <p class="col-lg-12 col-2 infoPayment__product-amount">
                                    <span class="d-lg-inline d-none infoPayment__product-amount--text">Số lượng: </span>
                                    <span class="infoPayment__product-amount--number">${amount}</span></p>
                                <p class="col-lg-12 col-4"> ${(currentPrice * amount).toLocaleString()} đ</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            })
            .join("");
    });
    renderMoney(totalMoney);
};

const renderMoney = (totalMoney) => {
    $(".infoPayment__total-tempPrice .infoPayment__total-number ").html(`${totalMoney.toLocaleString()} đ`);
    $(".infoPayment__total-money  .infoPayment__total-number ").html(`${totalMoney.toLocaleString()} đ`);
};

const createPayment = async (payload) => {
    try {
        const arrProduct = JSON.parse(localStorage.getItem("product"));
        const responseGET = await axios.get(`${apiUrl}/payments?phone=${payload.phone}&isPayment=false`);
        const dataCustomer = responseGET.data;
        let now = new Date();
        let createdAt = now.toLocaleString("fr-FR");
        let updatedAt = createdAt;
        if (dataCustomer.length) {
            await axios.put(`${apiUrl}/payments/${dataCustomer[0].id}`, {
                ...dataCustomer[0],
                infoCustomer: payload,
                products: [...arrProduct],
                updatedAt,
            });
        } else {
            await axios.post(`${apiUrl}/payments`, {
                infoCustomer: payload,
                products: [...arrProduct],
                isPayment: false,
                createdAt,
                updatedAt,
            });
        }

        window.location.href = `http://localhost:3000/payment.html`;
    } catch (error) {
        return error;
    }
};

document.addEventListener("DOMContentLoaded", function () {
    // Mong muốn của chúng ta
    Validator({
        form: "#form-infoPayment",
        formGroupSelector: ".form-group",
        errorSelector: ".form-message",
        rules: [
            Validator.isFullName("#fullname", "Vui lòng nhập tên đầy đủ của bạn"),
            Validator.isEmail("#email"),
            Validator.isPhone("#phone"),
            Validator.isRequired("#address"),
        ],
        onSubmit: function (data) {
            createPayment(data);
        },
    });

    renderProduct();
});

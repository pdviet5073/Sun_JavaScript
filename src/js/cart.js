const PORT = 3002;
const apiUrl = `http://localhost:${PORT}`;

const handelNonProduct = () => {
    $(".cart__content form").addClass("d-none");
    $(".cart__content .cart__nonProduct").addClass("d-block");
};

const renderProductList = (arrProduct) => {
    if (!arrProduct || !arrProduct.length) {
        handelNonProduct();
    } else
        return arrProduct
            .map((item) => {
                const { id, src, nameProduct, currentPrice, amount } = item;
                return `
                    <tr>
                        <td> <img src='./assets/images/${src}.png' alt="cart-img"></td>
                        <td class="cart__name">${nameProduct}</td>
                        <td><span class="cart__price">${currentPrice.toLocaleString()} </span><span class="d-md-inline d-none">đ</span></td>
                        <td> 
                            <div class="cart__amount">
                            <input type="number" value="${amount}" min="1" max="99" onkeyup="handelChangeAmount(event, ${id}, ${currentPrice},'${src}' )">
                            </div>
                        </td>
                        <td class="cart__total-price"><span class="cart__total-price-span">${(
                            currentPrice * amount
                        ).toLocaleString()}</span> <span class="d-md-inline d-none">đ</span></td>
                        <td>
                            <button class="button" type="button" onclick="showModalCart(${id},  '${src}', '${nameProduct}', ${currentPrice})"> <i class="fas fa-trash-alt" aria-hidden="true" ></i></button>
                        </td>
                        </tr>
                `;
            })
            .join("");
};

const handelChangeAmount = (e, id, currentPrice, src) => {
    let arrProduct = JSON.parse(localStorage.getItem("product"));
    let indexId = arrProduct.findIndex((item) => item.id === id);
    let value = e.target.value;
    let trParent = $(e.target).closest("tr");
    let spanTotalPrice = trParent.find(".cart__total-price-span");
    let productName = trParent.find(".cart__name")[0].innerHTML;
    let tempPrice = trParent.find(".cart__price")[0].innerHTML;
    let productPrice = parseInt(tempPrice.split(".").join(""));

    if ((value > 0 && value <= 99) || value === "") {
        spanTotalPrice.text((currentPrice * value).toLocaleString());
        renderTotalPayment();
        setTimeout(function () {
            if (value) {
                let productUpdate = {
                    id,
                    src,
                    nameProduct: productName,
                    currentPrice: productPrice,
                    amount: parseInt(value),
                };
                arrProduct.splice(indexId, 1, productUpdate);
                localStorage.setItem("product", JSON.stringify(arrProduct));
            }
        }, 1500);
    } else if (value <= 0) {
        showModalCart(id, src, productName, productPrice);

        $("#cartModal").on("hidden.bs.modal", function () {
            $(e.target)[0].value = 1;
            value = 1;
            spanTotalPrice.text((currentPrice * value).toLocaleString());
            renderTotalPayment();
        });
    } else {
        $("#exampleModalLabel").html("");
        $(".modal-body").html(`
        <i class="fas fa-exclamation-triangle icon-warning"></i>
               <p class="modal__warning">Rất tiếc, bạn chỉ có thể mua tối đa 99  sản phẩm này.</p>
            `);
        $(".modal-footer").html(`
             <button class=" btn bg-success bg-gradient text-white w-100 " type='button' data-dismiss='modal'> OK</button>
        `);
        $("#cartModal").modal("show");
        $("#cartModal").on("hidden.bs.modal", function () {
            $(e.target)[0].value = 99;
            value = 99;
            spanTotalPrice.text((currentPrice * value).toLocaleString());
            renderTotalPayment();
            setTimeout(function () {
                if (value) {
                    let productUpdate = {
                        id,
                        src,
                        nameProduct: productName,
                        currentPrice: productPrice,
                        amount: 99,
                    };
                    arrProduct.splice(indexId, 1, productUpdate);
                    localStorage.setItem("product", JSON.stringify(arrProduct));
                }
            }, 1500);
        });
    }

    $("#cartModal").on("hidden.bs.modal", function () {
        setTimeout(function () {
            if (value) {
                let productUpdate = {
                    id,
                    src,
                    nameProduct: productName,
                    currentPrice: productPrice,
                    amount: value,
                };
                arrProduct.splice(indexId, 1, productUpdate);
                localStorage.setItem("product", JSON.stringify(arrProduct));
            }
        }, 1500);
    });
};

const showModalCart = (id, productImg, productName, productPrice) => {
    $("#exampleModalLabel").html("Bạn chắc chắn muốn xoá bỏ sản phẩm này?");
    $("#cartModal .modal-body").html(`
                <div class="modal__img"><img src='./assets/images/${productImg}.png'></img></div>
                <div class="pt-4">
                 <p class="cart__name modal__cart-name">${productName}</p>
                 <p class="pt-4"> <span class="pr-2">Giá sản phẩm:</span><span>${productPrice} đ</span>
                </div>
            `);
    $("#cartModal .modal-footer").html(`
    <button class="button__delete-cart btn bg-success bg-gradient text-white" type="button" onclick="handelDeleteCart('single',${id})" >Có</button>
    <button class="btn bg-light bg-gradient" type="button" data-dismiss="modal">Không</button>

    `);
    $("#cartModal").modal("show");
};

const renderTotalPayment = () => {
    let cartTotalMoney = 0;
    let arrPrice = $(".cart__total-price-span");
    for (let i = 0; i < arrPrice.length; i++) {
        let tempPrice = arrPrice[i].innerHTML;
        cartTotalMoney += parseInt(tempPrice.split(".").join(""));
    }
    $(".cart__total-money").html(cartTotalMoney.toLocaleString());
    $(".cart__VAT").html((cartTotalMoney * 0.1).toLocaleString());
    $(".cart__total-payment").html((cartTotalMoney * 1.1).toLocaleString());
};

const handelDeleteCart = (type, id) => {
    let arrProduct = JSON.parse(localStorage.getItem("product"));
    if (type === "single") {
        let indexId = arrProduct.findIndex((item) => item.id === id);
        arrProduct.splice(indexId, 1);
    } else arrProduct = "";
    localStorage.setItem("product", JSON.stringify(arrProduct));
    $(".cart__product").html(renderProductList(arrProduct));
    $(".header__cart-amount").html(arrProduct.length);
    renderTotalPayment();
    $("#cartModal").modal("hide");

    !arrProduct && handelNonProduct(arrProduct.length);
};

// delete all product
$(".btn-deleteAll").click(function () {
    $("#exampleModalLabel").html("");
    $(".modal-body").html(`
        <i class="fas fa-exclamation-triangle icon-warning"></i>
               <p class="modal__warning ">Hãy chắc chắn rằng bạn muốn huỷ đơn hàng này</p>
            `);
    $(".modal-footer").html(`
        <button class="button__delete-cart btn bg-success bg-gradient text-white" type="button" onclick="handelDeleteCart( 'all')" >Đồng ý</button>
        <button class="btn bg-light bg-gradient" type="button" data-dismiss="modal">Không</button>
        `);
    $("#cartModal").modal("show");
});

$("#cart__form").submit(function (e) {
    e.preventDefault();
    console.log("file: cart.js > line 140 > e", e.target);
});

$(document).ready(function () {
    let arrProduct = JSON.parse(localStorage.getItem("product"));

    $(".cart__product").html(renderProductList(arrProduct));
    renderTotalPayment();
});

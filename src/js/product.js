const PORT = 3002;
const apiUrl = `http://localhost:${PORT}`;
let limit = 12,
    sort,
    typeProduct;
let paginationArr = [],
    rangePrice = [];

const handleChangeSelect = (e) => {
    let value = e.target.value;
    if (e.target.name === "show") limit = parseInt(value);
    else sort = value;
    renderPagination({});
    getProductList({ page: 1, limit, sort });
};

const getProductList = async (payload) => {
    try {
        $("html, body").animate({ scrollTop: 225 }, "slow");
        load(".products", 1500);
        // scroll to top

        const { page, limit, sort, typeProduct, rangePrice } = payload;
        const response = await axios({
            method: "GET",
            url: `${apiUrl}/products`,
            params: {
                ...(page && { _page: page }),
                ...(limit && { _limit: limit }),
                ...(sort && { _sort: "currentPrice", _order: sort }),
                ...(typeProduct && { typeProduct }),
                ...(rangePrice && { currentPrice_gte: rangePrice[0], currentPrice_lte: rangePrice[1] }),
            },
        });
        const data = response.data;

        $("#menu1Products").html(renderProductList(data, "productVertical"));
        $("#menu2").html(renderProductList(data, "productHorizontal"));
    } catch (error) {
        return error;
    }
};

const renderProductList = (productData, type, size) => {
    return productData
        .map((item) => {
            const { id, src, nameProduct, discount, rate, currentPrice, oldPrice, desc } = item;

            if (type == "productVertical") {
                return `
                <div class= "col-lg-4 col-6 ">
                    <div class="product__item " >
                        ${
                            discount
                                ? `<div class="product__discount ${
                                      discount == "New" && "product__discount-green"
                                  }">${discount}</div>`
                                : ""
                        }
                        <div class="product__image">
                            <img src="./assets/images/${src}.png" alt="anh">
                            <div class="product__widget">
                                <button class="button button-round button-green" onclick="handleAddCart(${id}, '${src}', '${nameProduct}', ${currentPrice})" > Mua ngay </button>
                                <div class="product__icon icon icon-round" onclick="nextPage(${id})">
                                    <i class="fas fa-search" aria-hidden="true"></i>
                                </div>
                            </div>
                        </div>
                        <div class="product__content">
                            <div class="product__name"> 
                                <h4 class="text-clamp text-clamp--1">${nameProduct}</h4>
                            </div>
                            <div class="product__rate">
                                ${renderStar(rate)}
                            </div>
                            <div class="product__price">
                                <span class="product__price-current">${currentPrice.toLocaleString()} đ</span>
                                <span class="product__price-old">${oldPrice.toLocaleString()} đ</span>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }
            return `
            <div class=" ${
                size == "small" ? "product__horizontal-small" : "product__horizontal "
            } " onclick="nextPage(${id})">
                <div class="row">
                    <div class=" ${size == "small" ? "col-5  " : "col-4 "}"> 
                        <div class="product__image h-100">
                            <img src="./assets/images/${src}.png" alt="anh">
                        </div>
                    </div>
                    <div class=" ${size == "small" ? "col-6 p-0 " : "col-8 "} my-auto"> 
                        <div class="product__content ${size == "small" && "product__content-small"}">
                            <div class="product__name"> 
                                <h4 class="text-clamp text-clamp--1">${nameProduct}</h4>
                            </div>
                            <div class="product__rate">
                                ${renderStar(rate)}
                            </div>
                            ${
                                !size &&
                                `<div class="product__decs"> 
                                <p class="text-clamp text-clamp--2">${desc}</p></div>`
                            }
                        <div class="product__price">
                                <span class="product__price-current">${currentPrice.toLocaleString()} đ</span>
                                <span class="product__price-old">${oldPrice.toLocaleString()} đ</span>
                            </div>
                            <div class="product__widget-horizontal">
                                <button class="button button-round button-green" onclick="handleAddCart(${id}, '${src}', '${nameProduct}', ${currentPrice})" > Mua ngay </button>
                            <div class="product__icon icon icon-round" onclick="nextPage(${id})">
                                <i class="fas fa-search" aria-hidden="true"></i></div>
                            <div class="product__icon icon icon-round">
                                <i class="fas fa-heart" aria-hidden="true"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        `;
        })
        .join("");
};

const renderPagination = async (payload) => {
    try {
        const { typeProduct, rangePrice } = payload;
        const response = await axios({
            method: "GET",
            url: `${apiUrl}/products`,
            params: {
                ...(typeProduct && { typeProduct }),
                ...(rangePrice && { currentPrice_gte: rangePrice[0], currentPrice_lte: rangePrice[1] }),
            },
        });
        const data = response.data;
        let totalProduct = data.length;
        const temp = totalProduct % limit;
        let amount = Math.floor(totalProduct / limit);
        if (!temp) {
            amount;
        } else if (temp && amount == 0) {
            amount;
        } else {
            amount += 1;
        }
        paginationArr = [];
        for (let i = 0; i < amount; i++) {
            paginationArr[i] = i + 1;
        }
        if (paginationArr.length > 3) paginationArr = ["Trang đầu", ...paginationArr, "Trang cuối"];
        $(".pagination__content").html(
            paginationArr
                .map((item, index) => {
                    return `
                        <li class="pagination__item ${item === 1 ? "pagination__item-active" : ""}">
                            <button class="pagination__button button  ${
                                item == "Trang đầu" ? "disabled" : ""
                            }" type="button" onclick="onClickPagination(event)" aria-disabled="true">${item}</button>
                        </li>
                        `;
                })
                .join("")
        );
    } catch (error) {
        return error;
    }
};

const onClickPagination = (e) => {
    let page = e.target.innerHTML;
    $(".pagination__item").removeClass("pagination__item-active");
    $(e.target).parent().addClass("pagination__item-active");

    switch (page) {
        case "Trang đầu":
            getProductList({ page: 1, limit, ...(sort && { sort }), ...(rangePrice && { rangePrice }) });
            break;
        case "Trang cuối":
            page = paginationArr.length - 2;
            getProductList({ page, limit, ...(sort && { sort }), ...(rangePrice && { rangePrice }) });
            break;
        default:
            getProductList({ page, limit, ...(sort && { sort }), ...(rangePrice && { rangePrice }) });
    }
};

$(".portfolio-product__item").click((e) => {
    rangePrice = "";
    sort = "";
    typeProduct = e.target.value;
    getProductList({ page: 1, limit, typeProduct });
    renderPagination({ typeProduct });
});

$(".portfolio-price__item").click((e) => {
    let value = e.target.value;

    switch (value) {
        case 1:
            rangePrice = [200000, 400000];
            break;
        case 2:
            rangePrice = [400000, 600000];
            break;
        case 3:
            rangePrice = [600000, 800000];
            break;
        case 4:
            rangePrice = [800000, 1000000];
            break;
        case 5:
            rangePrice = [1000000, 1200000];
            break;
    }
    getProductList({ page: 1, limit, rangePrice, ...(typeProduct && { typeProduct }) });
    renderPagination({ rangePrice, typeProduct });
});

const handleAddCart = (id, src, nameProduct, currentPrice) => {
    let ArrProduct = [];
    let product = { id, src, nameProduct, currentPrice, amount: 1 };
    let productStorage = JSON.parse(localStorage.getItem("product"));

    if (productStorage) {
        let findId = productStorage.find((item) => item.id === id);
        let indexId = productStorage.findIndex((item) => item.id === id);
        if (findId) {
            productStorage.splice(indexId, 1, { ...findId, amount: findId.amount + 1 });
            ArrProduct = [...productStorage];
        } else ArrProduct = [...productStorage, product];
    } else ArrProduct.push(product);

    localStorage.setItem("product", JSON.stringify(ArrProduct));
    showSuccessToast();
    $(".header__cart-amount").html(ArrProduct.length);
};

const nextPage = (id) => {
    window.location.href = `http://localhost:3000/productDetail.html?${id}`;
};

$(document).ready(function () {
    renderPagination({});
    getProductList({ page: 1, limit });
});

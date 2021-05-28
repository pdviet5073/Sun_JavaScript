const PORT = 3002;
const apiUrl = `http://localhost:${PORT}`;

const getProductDetail = async () => {
    const currentUrl = window.location.href;
    const productId = currentUrl.slice(currentUrl.lastIndexOf("?") + 1);
    const response = await axios({
        method: "GET",
        url: `${apiUrl}/products`,
        params: {
            id: productId,
        },
    });
    const data = response.data;

    renderProductDetail(data[0]);
};

const renderProductDetail = ({ id, src, slideImages, nameProduct, rate, currentPrice, oldPrice, info }) => {
    load("main ", 1800);

    $(".product-detail__image-thumbnail img")[0].src = `./assets/images/${src}.png`;
    $(".product__name h2").html(nameProduct);
    $(".product__rate").html(renderStar(rate));
    $(".product__price-current").html(`${currentPrice.toLocaleString()} đ`);
    $(".product__price-old").text(`${oldPrice.toLocaleString()} đ`);
    $(".product-detail__info-content .commonName").html(info.commonName);
    $(".product-detail__info-content .scienceName").html(info.scienceName);
    $(".product-detail__info-content .plantFamily").html(info.plantFamily);
    $(".product-detail__info-content .roots").html(info.roots);
    $(".product-detail__info-content .desc").html(info.desc);
    let carouselImg4 = $(".product-detail__image-slide .carousel-img-4 ");
    let carouselImg5 = $(".product-detail__image-slide .carousel-img-5 ");

    for (let i = 0; i < carouselImg5.length; i++) {
        carouselImg5[i].src = `./assets/images/${slideImages[i].src}.png`;
    }
    for (let i = 0; i < carouselImg4.length; i++) {
        carouselImg4[i].src = `./assets/images/${slideImages[i].src}.png`;
    }

    $(".product-detail__button button").click(function () {
        handleAddCart(id, src, nameProduct, currentPrice);
    });
};

const handleAddCart = (id, src, nameProduct, currentPrice) => {
    let product = { id, src, nameProduct, currentPrice, amount: 1 };
    let productStorage = JSON.parse(localStorage.getItem("product"));

    if (productStorage) {
        let findId = productStorage.find((item) => item.id === id);
        let indexId = productStorage.findIndex((item) => item.id === id);
        if (findId) {
            productStorage.splice(indexId, 1, { ...findId, amount: findId.amount + 1 });
        } else productStorage = [...productStorage, product];
    } else productStorage.push(product);

    localStorage.setItem("product", JSON.stringify(productStorage));
    showSuccessToast();
    $(".header__cart-amount").html(productStorage.length);
};

$(document).ready(function () {
    getProductDetail();
});

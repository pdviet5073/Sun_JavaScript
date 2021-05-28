const renderStar = (rate) => {
    let star = ``;
    rate = parseInt(rate);
    if (Math.floor(rate) < 5) {
        for (var i = 0; i < Math.floor(rate); i++) star += ` <i class="fas fa-star"></i>`;

        for (var i = 0; i < 5 - Math.floor(rate); i++)
            if (i == 0) star += `<i class="fas fa-star-half-alt"></i>`;
            else star += `<i class="far fa-star"></i>`;
    } else for (var i = 0; i < 5; i++) star += ` <i class="fas fa-star"></i>`;
    return star;
};

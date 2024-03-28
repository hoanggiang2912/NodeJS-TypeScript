const recentOrderTable = document.querySelector('.recent-order__table');

export const billAPI = 'http://localhost:3000/Bill';
export const bills = await fetch(billAPI).then(response => response.json());

export const renderOrder = (bill) => {
    const { id, products: billProducts, status} = bill;

    const html = billProducts.map(product => {
        return `
            <!-- single product start -->
            <tr>
                <td>${id}</td>
                <td>${product.title}</td>
                <td>___</td>
                <td>
                    <span class="status status--${status} ttc">${status}</span>
                </td>
                <td>
                    <a href="/src/template/admin_orderDetail.html?billId=${id}" class="btn primary-text-btn detail-btn" data-id="${id}">Detail</a>
                </td>
            </tr>
            <!-- single product end -->
        `
    });

    return html.join('');
}

bills.forEach(bill => {
    if (recentOrderTable) {
        recentOrderTable.insertAdjacentHTML("beforeend", renderOrder(bill));
    }
});
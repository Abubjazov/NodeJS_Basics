document.querySelectorAll('.price').forEach(node => {
    node.textContent = new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(node.textContent)
})

const $cart = document.querySelector('#cart')

if ($cart) {
    $cart.addEventListener('click', e => {
        if (e.target.classList.contains('js-remove')) {
            const id = e.target.dataset.id

            fetch('/cart/remove/' + id, {
                method: 'delete'
            })
        }
    })
}

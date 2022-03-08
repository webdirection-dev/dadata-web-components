window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
    const token = "0942518e753e88745cd945cf0bd40269b0b9a937";

    const searchInput = document.querySelector('#search')
    const shortNameInput = document.querySelector('#short-name')
    const fullNameInput = document.querySelector('#full-name')
    const innInput = document.querySelector('#inn')
    const addressInput = document.querySelector('#address')
    const variantList = document.querySelector('.variant__list')
    const legal = document.querySelector('.organization__search')

    let daData = []
    if (daData.length === 0) {
        searchInput.value = ''
        shortNameInput.value = ''
        fullNameInput.value = ''
        innInput.value = ''
        addressInput.value = ''
    }

    // строка поиска
    searchInput.addEventListener('input', async (event) => {
        const {value} = event.target
        await getData(value)

        if (value !== '') {
            renderVariantList(value)
            variantList.classList.remove('hidden')
        }

        if (value === '') {
            variantList.classList.add('hidden')
        }
    })

    // Скрыть выпадающий список при пустом input
    searchInput.addEventListener('keydown', async () => {
        variantList.classList.add('hidden')
    })

    // выбрать из вариантов
    window.addEventListener('click', (event) => {
        const {id} = event.target
        if (id !== 'search') variantList.classList.add('hidden')
    })

    // основная логика
    function renderVariantList(valueInput) {
        const arr = []
        const removeLegal = document.querySelector('.organization__type')
        const list = document.querySelectorAll('.variant__item')

        // удалить предыдущие варианты
        list.forEach(item => {
            item.remove()
        })

        // выбрать 5 топовых варианта
        if (daData.length > 0) {
            daData.forEach((item, index) => {
                if (index < 5) {
                    arr.push(item)
                }
            })
        }

        // general
        arr.forEach((item, index) => {
            const {value, data} = item

            if (index < 5) {
                const elem = document.createElement('div')
                elem.classList.add('variant__item')

                elem.innerHTML = `
                        <div class="variant__title">${markLetters(value, valueInput)}</div>
                        <div class="variant__description">
                            <p class="variant__inn">${data.inn}</p>
                            <p class="variant__own">${data.address === null ? '' : data.address.value}</p>
                        </div>
                    `
                elem.addEventListener('click', (event) => {
                    if (removeLegal !== null) removeLegal.remove()

                    const legalType = document.createElement('div');
                    legalType.classList = 'organization__type'
                    legalType.innerHTML = `<div>Организация (${data.type})</div>`

                    const list = document.querySelectorAll('.variant__item')
                    renderVariant(item)
                    searchInput.value = value
                    list.forEach(item => {
                        item.remove()
                    })
                    legal.append(legalType)
                })

                variantList.append(elem)
            }
        })
    }

    // заполнить inputs выбранной информацией
    function renderVariant(item) {
        const {value, data} = item
        shortNameInput.value = value
        fullNameInput.value = data.name.full_with_opf
        innInput.value = `${data.inn} / ${data.kpp}`
        addressInput.value = data.address.value
    }

    //покрасить искомые символы в найденных словах
    function markLetters(str, valueInput) {
        const isIndexOf = str.toLowerCase().indexOf(valueInput)

        return str.slice(0, isIndexOf) +
            '<span class="variant__mark">' +
            str.slice(isIndexOf, isIndexOf+valueInput.length) +
            '</span>' +
            str.slice(isIndexOf+valueInput.length)
    }

    // fetch
    async function getData(query) {
        try {
            const response = await fetch( url, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Token " + token
                },
                body: JSON.stringify({query: query})

            });

            if (!response.ok) {
                throw new Error('ServerError!')
            }

            const data = await response.json();

            daData = data.suggestions
        } catch (error) {
            console.log(error.message)
        }
    }
})
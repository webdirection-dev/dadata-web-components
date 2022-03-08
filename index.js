window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
    const token = "0942518e753e88745cd945cf0bd40269b0b9a937";

    let count = -1
    const arrForRender = []

    const searchInput = document.querySelector('#search')
    const shortNameInput = document.querySelector('#short-name')
    const fullNameInput = document.querySelector('#full-name')
    const innInput = document.querySelector('#inn')
    const addressInput = document.querySelector('#address')
    const wrap = document.querySelector('#wrap')
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
        count = -1
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

    //навигация по выпадающему листу через клавиатуру
    searchInput.addEventListener('keydown', (event) => {
        const variantItems = document.querySelectorAll('.variant__item')
        const {keyCode} = event

        variantItems.forEach(item => {
            item.classList.remove('variant__active')
        })

        //down
        if (keyCode === 40) {
            event.preventDefault()
            if (variantItems.length > 0) {
                count = count < 4 ? count += 1 : 0
                variantItems[count].classList.add('variant__active')
            }
        }

        //up
        if (keyCode === 38) {
            event.preventDefault()
            if (variantItems.length > 0) {
                count = count > 0 ? count -= 1 : 4
                variantItems[count].classList.add('variant__active')
            }
        }

        //escape
        if (keyCode === 27) {
            searchInput.value = ''
            variantList.classList.add('hidden')
        }

        //enter
        if (keyCode === 13) {
            if (count >= 0) {
                actionsForVariants(arrForRender[count])
                count = 0
            }
        }
    })

    //клик вне input
    window.addEventListener('click', (event) => {
        if (!wrap.contains(event.target)) variantList.classList.add('hidden')
    })

    //фокус на input
    searchInput.addEventListener('focus', () => {
        if (arrForRender.length > 0) variantList.classList.remove('hidden')
    })

    // основная логика
    function renderVariantList(valueInput) {
        const list = document.querySelectorAll('.variant__item')

        // удалить предыдущие варианты
        list.forEach(item => {
            item.remove()
        })

        // выбрать 5 топовых варианта
        if (daData.length > 0) {
            daData.forEach((item, index) => {
                if (index < 5) {
                    arrForRender.push(item)
                }
            })
        }

        // general
        arrForRender.forEach((item, index) => {
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
                    actionsForVariants(item)
                })

                variantList.append(elem)
            }
        })
    }

    // навигация и клик по листу с вариантами
    function actionsForVariants(item) {
        variantList.classList.add('hidden')
        const {value, data} = item
        const removeLegal = document.querySelector('.organization__type')

        const legalType = document.createElement('div');
        if (removeLegal !== null) removeLegal.remove()

        legalType.classList = 'organization__type'
        legalType.innerHTML = `<div>Организация (${data.type})</div>`

        searchInput.value = value
        legal.append(legalType)

        renderVariant(item)
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
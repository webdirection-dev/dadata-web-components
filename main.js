window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ШАБЛОНЫ ------------------////
    const template = document.querySelector('template')
    const templateClone = document.importNode(template.content, true)

    document.body.appendChild(templateClone)

    //button
    let counter = 0
    document.querySelector('#add-button').addEventListener('click', () => {
        const templateClone = document.importNode(template.content, true)

        templateClone.querySelector('#nnn').textContent += ` else something ${++counter}`
        document.body.append(templateClone)
    })

    // template внутри другого template
    const getTemplate = (name, id) => {
        name = document.querySelector(id)
        const clone = document.importNode(name.content, true)
        document.body.append(clone)
    }

    getTemplate('templateHeader', '#header')
    getTemplate('templateBody', '#body')
    // ШАБЛОНЫ ------------------////

    // КАСТОМНЫЕ ЭЛЕМЕНТЫ ------------------////
    class MyCustomElem extends HTMLElement {
        constructor(txt = 'Hello, Components!') {
            super();
            this.txt = txt
        }
        connectedCallback() {
            this.innerHTML = `<h3>${this.txt}</h3>`

        }

    }
    //Регистрируем кастомный элемент в браузере
    customElements.define("hello-component", MyCustomElem);

    //создаем элементы на базе класса MyCustomElem
    const customElem2 = new MyCustomElem('My Custom 2')
    document.body.append(customElem2)
    //
    // //ещё вариант
    const customElem3 = document.createElement('hello-component')
    document.body.append(customElem3)
    // КАСТОМНЫЕ ЭЛЕМЕНТЫ ------------------////

    //Расширям браузерные div
    //Унаследуем HTMLButtonElement новым классом:
    class HelloButton extends HTMLButtonElement {
        constructor(name = 'is Button') {
            super();
            this.textContent = name
            this.addEventListener('click', () => alert("Привет!"));
            this.style.cssText = `
                background-color: blue;
                color: white;
                border: none;
                cursor: pointer;
                padding: 10px 15px;
                margin: 0 20px;
            `
        }
    }

    customElements.define('hello-button', HelloButton, {extends: 'button'});
    //создаем элементы на базе класса HelloButton
    // 1 Вариант
    // document.body.innerHTML += '<button is="hello-button">is Button</button>'

    // 2 Вариант
    const button2 = document.createElement('button', 'hello-button')
    document.body.append(button2)
    //
    // // 3 Вариант
    const button3 = new HelloButton('btn 2')
    document.body.append(button3)



    class TestElem extends HTMLElement {
        constructor() {
            super();
            this.addEventListener('click', () => alert("Привет!"));
        }

        connectedCallback() {
            this.innerHTML = '<h3>Test New</h3>'
            console.log('created')
        }

        disconnectedCallback() {
            console.log('removed')

        }

        static get observedAttributes() {
            return ['data-set'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            console.log(`name=${name} oldValue=${oldValue} newValue=${newValue}`)
        }
    }
    customElements.define("test-component", TestElem);

    let component

    document.querySelector('#create-btn').addEventListener('click', () => {
        component = new TestElem()
        document.body.append(component)
    })

    document.querySelector('#change-btn').addEventListener('click', () => {
        component.setAttribute('data-set', 123)
    })

    document.querySelector('#remove-btn').addEventListener('click', () => {
        component.remove()
    })
})
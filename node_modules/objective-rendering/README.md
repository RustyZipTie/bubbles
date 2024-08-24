# Objective Rendering
## Objective Rendering simplifies your interactions with the DOM by rendering elements based on objects you define.
### Installation
#### CDN (reccomended)
`<script src="https://unpkg.com/objective-rendering@2.0.0/render.js"></script>`\
NPM not reccomended
### Implementation
To implement, call the `render()` function. It takes four arguments:
| name | type  | required or default | description  |
| --- | --- | --- | --- |
| contents | array | required | The objects to render. See below for how to define. |
| parent | DOM element object | required | the parent element to render within |
| clear | boolean | default: `true` | If `clear` is true, all of `parent`'s children will be cleared before rendering
| documentCtx | object | default: `document` | Reference to the document object. No need to change as long as you are using CDN

`render()` returns an object with references to some DOM elements. See `refName` below for how to get an element included in this object.

#### The `contents` array
This is an array of element objects. The element objects can be either DOM element objects or user-defined objects. User-defined objects can have any of the properties below. The `type` property is required, all others are optional.
| name | type | description |
| --- | --- | --- |
| type | string | The HTML element type, same as you would use in `document.createElement()`|
| style | object | CSS styling, in {property: value} format. For properties with hyphens (e.g. `background-color`), use an underscore (e.g. `background_color`) |
| textContent | string | Sets the text content of the element |
| children | array | All children of the element. Can be DOM elements or user-defined |
| listeners | object | Event listeners to attatch to the element, in {eventType: onFire} format. For example: `{click: myFunction}` |
| contentEditable | boolean | Corresponds to the HTML attribute `contenteditable` |
| id | string | Corresponds to the HTML attribute `id` |
| className | string | Corresponds to the HTML attribute `class` |
| refName | string | Define this in order to get the element included in the references returned by `render()`. The name you give it will be the name you can use to access it later |
| attributes | object | Use this to set any other html attrubutes. Use `{name: value}` format for any attrubute. For example: `{src: "htpps://www.website.com/image"}`|

### Examples
#### Hello world
```
// define the object
// only one element, a <p> with the text 'Hello, world'
myDoc = [
    {
        type: 'p',
        textContent: 'Hello, world'
    }
];
// render myDoc within the document body
render(myDoc, document.body);
```
#### Adding children, styles, and listeners
```
const myDoc = [
    {
        type: 'div',
        children: [
            {
                type: 'button',
                id: 'my_button',
                textContent: 'Press Me',
                listeners: {
                    click: () => console.log('Button clicked'),
                    mouseover: (e) => {
                        e.target.style.backgroundColor = 'red'
                    },
                    mouseout: (e) => {
                        e.target.style.backgroundColor = 'white'
                    }
                }
            },
            {type: 'hr'},
            {
                type: 'p',
                className: 'myClass',
                textContent: 'Hello, World',
                contentEditable: true,
                style: {
                    background_color: 'green',
                    border: '1px solid black',
                    border_radius: '10px'
                }
            },
            myP
        ]
    }
];

render(myDoc, document.body);
```
#### Getting references and rendering in different places
```
const myDoc = [
    {
        type: 'div',
        refName: 'myDiv',
        children: [
            {
                type: 'button',
                id: 'my_button',
                refName: 'myButton',
                textContent: 'Press Me',
                listeners: {
                    click: () => console.log('Button clicked'),
                    mouseover: (e) => {
                        e.target.style.backgroundColor = 'red'
                    },
                    mouseout: (e) => {
                        e.target.style.backgroundColor = 'white'
                    }
                }
            },
            {type: 'hr'},
            {
                type: 'p',
                className: 'myClass',
                textContent: 'Hello, World',
                contentEditable: true,
                style: {
                    background_color: 'green',
                    border: '1px solid black',
                    border_radius: '10px'
                }
            },
            myP
        ]
    }
];

const refs = render(myDoc, document.body);
/*
Notice the refName property in the div and the button.
refs will now contain this:
{
    myButton: <reference to the button>,
    myDiv: <reference to the div>
}
*/

// add another <p> to the <div>, without erasing the existing content
// the second argument specifies to render within refs.myDiv
// the third argument specifies not to erase the existing content
render(
    {
        type: 'p',
        textContent: 'More text'
    }, 
    refs.myDiv, 
    false
);

// you can perform normal DOM manipulation on references
refs.myButton.classList.add('myClass');
```
#### Render a normal DOM element
```
domDiv = document.createElement('div');
domDiv.textContent = 'This is a normal DOM element';
myDoc = [
    {
        type: 'p',
        textContent: 'This is a user-defined object'
    },
    {
        type: 'div',
        children: [
            domDiv
        ]
    }
];

render(myDoc, document.body);
```
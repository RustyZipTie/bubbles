
const render = (contents, parent, clear = true, documentCtx = document) => {
    if (clear) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild)
        }
    }
    let refs = {}
    for (const elemObj of contents) {
        if (
            elemObj instanceof Element 
            || elemObj instanceof Document
            || elemObj instanceof HTMLDocument
        ) {
            parent.appendChild(elemObj);
        } else {
            const {
                type,
                style,
                textContent,
                children,
                listeners,
                contentEditable,
                id,
                className,
                refName,
                attributes
            } = elemObj
            if (type) {
                const elem = documentCtx.createElement(type);
                if (textContent)
                    elem.textContent = textContent;

                if (children)
                    refs = { ...refs, ...render(children, elem) };

                if (style)
                    elem.style = Object.entries(style).map(
                        ([attribute, value]) => (
                            `${attribute.replace('_', '-')}: ${value};`
                        )
                    ).join('\n');

                if (id)
                    elem.id = id;

                if (className)
                    elem.className = className;

                if (listeners)
                    for (const [eventType, onFire] of Object.entries(listeners))
                        elem.addEventListener(eventType, onFire);

                if (refName)
                    refs[refName] = elem

                if (attributes)
                    for(const [key, val] of Object.entries(attributes))
                        elem[key] = val

                elem.contentEditable = !!contentEditable;
                parent.appendChild(elem);
            } else {
                console.error('Element type unspecified')
            }
        }

    }
    return refs;
}


if (typeof exports != 'undefined') {
    exports.render = render
}
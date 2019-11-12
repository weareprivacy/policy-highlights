import style from "./index.scss";

class policyHighlights {
	constructor(config = {}) {
        this.config = {
            autoHighlight: true,
            highlights: [],
            container: document.body,
            ...config,
            backgroundColor: {
                keyword: '#f7f7f7',
                action: '#fcf1cd',
                ...config.backgroundColor,
            },
            textColor: {
                keyword: '#000000',
                action: '#000000',
                ...config.textColor,
            },
        };

        this.positionMap = {};
        this.keywordDetails = null;
        this.highlights = [];
        this.typeStyles = {};
        this.singularTypesMap = {
            'keywords': 'keyword',
            'actions': 'action',
        };
        this.invalidNodeTypes = ['body', 'head', 'html', 'script', 'style', 'title', 'form'];
        this.isScentence = new RegExp('\\.(?![a-zA-Z@#$%^&*()-_=+`~<>\\/,;:\'"\\\\|\\[\\]{}])', 'gim');

        if (this.config.autoHighlight) {
            this.parseHighlights();
        }
    }

	parseHighlights() {
        this.highlights = [];
        const types = Object.keys(this.singularTypesMap);

        for (let a = this.config.highlights.length - 1; a >= 0; a--) {
            const highlight = this.config.highlights[a];

            for (let b = types.length - 1; b >= 0; b--) {
                const type = types[b];

                if (highlight[type] && highlight[type].length > 0) {
                    this.addTypeStyle({
                        type: this.singularTypesMap[type],
                    });

                    const texts = highlight[type].split(',');

                    for (let c = texts.length - 1; c >= 0; c--) {
                        const text = texts[c];

                        if (text.length > 0) {
                            this.addTextPosition({
                                text,
                                index: a,
                            });

                            this.highlights.push({
                                type: this.singularTypesMap[type],
                                regex: new RegExp('(^|\\W)' + text.replace(/[\\^$*+.?[\]{}()|]/, '') + '($|\\W)', 'gim'),
                            });
                        }
                    }
                }
            }
        }

        this.highlight();
    }

    highlight() {
        if (this.highlights.length === 0) {
            return;
        }

        // Remove empty text nodes and combine adjacent text nodes.
        this.config.container.normalize();

        // Iterate through the container's child elements, looking for text nodes.
        let curNode = this.config.container.firstChild;
        let nodeStack = [];
        let scentenceNode = null;

        while (curNode != null) {
            if (curNode.nodeType == Node.TEXT_NODE && !curNode.parentNode.dataset.highlight && this.invalidNodeTypes.indexOf(curNode.parentNode.nodeName.toLowerCase()) === -1) {
                // Get node text in a cross-browser compatible fashion.
                const text = typeof curNode.textContent === 'string' ? curNode.textContent : curNode.innerText;
                scentenceNode = text.indexOf('.') >= 0;
                console.log(text);
                //console.log([...nodeStack]);
                //
                // if (curNode == scentenceNode) {
                //     console.log(text);
                // }
                //console.log([...nodeStack]);

                // do {
                //     if ((match = this.isScentence.exec(text)) != null) {
                //         matches.push(match);
                //     }
                // } while(match != null)

                // this.findHighlights({
                //     text,
                //     foundCallback: (fragment, spanNode) => {
                //         // Replace the existing text node with the fragment.
                //         curNode.parentNode.replaceChild(fragment, curNode);
                //         curNode = spanNode;
                //     }
                // });
            } else if (curNode.nodeType == Node.ELEMENT_NODE && curNode.firstChild != null) {
                // if (curNode.firstChild && curNode.firstChild.nodeType == Node.TEXT_NODE) {
                //     const text = typeof curNode.firstChild.textContent === 'string' ? curNode.firstChild.textContent : curNode.firstChild.innerText;
                //
                //     let match;
                //     do {
                //         if ((match = this.isScentence.exec(text)) != null) {
                //             console.log(match);
                //             // scentenceNode = curNode;
                //         }
                //     } while(match != null)
                // }
                nodeStack.push(curNode);
                curNode = curNode.firstChild;
                // Skip the normal node advancement code.
                continue;
            }

            // If there's no more siblings at this level, pop back up the stack until we find one.
            while (curNode != null && curNode.nextSibling == null) {
                curNode = nodeStack.pop();

                if (scentenceNode) {
                    console.log(curNode);
                    let match;
                    let textNode;
                    let prevMatchIndex = 0;
                    let hasHighlights = false;
                    const text = typeof curNode.textContent === 'string' ? curNode.textContent : curNode.innerText;
                    const fragment = document.createDocumentFragment();

                    do {
                        if ((match = this.isScentence.exec(text)) != null) {
                            const scentence = text.substr(prevMatchIndex, match.index - prevMatchIndex);

                            const highlightsMap = this.getHighlightsMap({text: scentence});

                            if (highlightsMap.total > 0) {
                                // Create the wrapper span and add the matched text to it.
                                textNode = this.getHighlightSpan({
                                    type: highlightsMap.types.keyword === 0 ? 'action' : 'keyword',
                                    text: scentence,
                                });
                                fragment.appendChild(textNode);
                                hasHighlights = true;
                            } else {
                                textNode = document.createTextNode(scentence);
                                fragment.appendChild(textNode);
                            }

                            prevMatchIndex = match.index + 1;
                        }
                    } while (match != null);

                    if (hasHighlights) {
                        // Replace the existing text node with the fragment.
                        curNode.parentNode.replaceChild(fragment, curNode);
                        curNode = textNode;
                    }
                }

                scentenceNode = false;
            }

            // If curNode is null, that means we've completed our scan of the DOM tree.
            // If not, we need to advance to the next sibling.
            if (curNode != null) {
                curNode = curNode.nextSibling;
            }
        }

        nodeStack = undefined;
        curNode = undefined;
    }

    findHighlights({ text = '', foundCallback = () => {} }) {
        if (text.trim().length === 0) {
            return;
        }

        let match;
        let prevMatchIndex = 0;
        let hasHighlights = false;
        let textNode;

        // Create a document fragment to hold the new nodes.
        const fragment = document.createDocumentFragment();

        do {
            if ((match = this.isScentence.exec(text)) != null) {
                const scentence = text.substr(prevMatchIndex, this.isScentence.lastIndex - prevMatchIndex);

                const highlightsMap = this.getHighlightsMap({ text: scentence });

                if (highlightsMap.total > 0) {
                    // Create the wrapper span and add the matched text to it.
                    textNode = this.getHighlightSpan({
                        type: highlightsMap.types.keyword === 0 ? 'action' : 'keyword',
                        text: scentence,
                    });
                    fragment.appendChild(textNode);
                    hasHighlights = true;
                } else {
                    textNode = document.createTextNode(scentence);
                    fragment.appendChild(textNode);
                }

                prevMatchIndex = this.isScentence.lastIndex;
            } else {
                textNode = document.createTextNode(text.substr(prevMatchIndex));
                fragment.appendChild(textNode);
            }
        } while (match != null);

        if (hasHighlights) {
            foundCallback(fragment, textNode);
        }
    }

    getHighlightsMap({ text = '' }) {
        const matchMap = {
            map: {},
            types: {},
            total: 0,
        };

        if (text.length > 0) {
            for (let x = this.highlights.length - 1; x >= 0; x--) {
                if (!(this.highlights[x].type in matchMap.types)) {
                    matchMap.types[this.highlights[x].type] = 0;
                }

                // Use a regular expression to check if this text node contains the target text.
                let match;
                do {
                    match = this.highlights[x].regex.exec(text);
                    if (match != null) {
                        matchMap.map[match.index] = {
                            type: this.highlights[x].type,
                            index: match.index,
                            length: match[0].length,
                            text: match[0],
                        };

                        matchMap.types[this.highlights[x].type] += 1;
                        matchMap.total += 1;
                    }
                } while (match != null);
                match = undefined;
            }
        }

        return matchMap;
    }

    getHighlightSpan({ type, text }) {
        const spanNode = document.createElement('span');
        spanNode.setAttribute('style', this.typeStyles[type]);
        spanNode.setAttribute('data-type', type);
        spanNode.setAttribute('data-highlight', 'true');
        spanNode.appendChild(document.createTextNode(text));

        // Events
        spanNode.addEventListener('mouseover', this.showDetails.bind(this));
        spanNode.addEventListener('mouseout', this.hideDetails.bind(this));

        return spanNode;
    }

    getHighlightStyle({ type = 'keyword', style = [] }) {
        if (this.config.backgroundColor[type] && this.config.backgroundColor[type].length > 0) {
            style.push(`background-color:${this.config.backgroundColor[type]};`);
        }
        if (this.config.textColor[type] && this.config.textColor[type].length > 0) {
            style.push(`color:${this.config.textColor[type]};`);
        }

        return style.join('');
    }

    addTypeStyle({ type }) {
        if (!(type in this.typeStyles)) {
            this.typeStyles[type] = this.getHighlightStyle({ type });
        }
    }

    addTextPosition({ text, index }) {
        const cleanText = text.replace(/[.']/g, '').replace(/[\-]/g, ' ');
        if (!(cleanText in this.positionMap)) {
            this.positionMap[cleanText] = [index];
        } else if (this.positionMap[cleanText].indexOf(index) === -1) {
            this.positionMap[cleanText].push(index);
        }
    }

    showDetails(e) {
        const text = e.target.innerHTML.replace(/[\\^$*+.?[\]{}()<>|’'"“”;:\/©®]|(&nbsp;)/g, '').replace(/[\-&,]/g, ' ').trim().toLowerCase();
        if (text in this.positionMap) {
            this.hideDetails();

            const top = e.pageY - e.offsetY + e.target.clientHeight + 1;//1 = prevent popup hover toggle flicker
            const left = e.pageX - e.offsetX + (e.target.clientWidth / 2) - 42;//42 = 34 popup offset + 8 :before width

            let popupNode = document.createElement('div');
            popupNode.setAttribute('class', 'policyHighlight__popup');
            popupNode.setAttribute('style', `top:${top}px;left:${left}px;`);
            popupNode.innerHTML = this.getDetailsHTML(text, e.target.dataset.type);
            document.getElementsByTagName('body')[0].appendChild(popupNode);

            this.keywordDetails = popupNode;
        }
    }

    hideDetails() {
        if (this.keywordDetails) {
            this.keywordDetails.parentNode.removeChild(this.keywordDetails);
        }

        this.keywordDetails = null;
    }

    getDetailsHTML(text, type) {
        let value = text;

        if (type) {
            let style = this.getHighlightStyle({ type });

            value += ': ' + policyHighlights.getHTMLTag({
                value: type,
                style,
                tag: 'span',
                className: "tag"
            });
        }

        let details = policyHighlights.getHTMLTag({
            value,
            className: "text"
        });

        if (type) {
            let typeTag = ['An important', type, 'in the below'];

            if (this.positionMap[text].length > 1) {
                typeTag.push(`${this.positionMap[text].length} highlights.`);
            } else {
                typeTag.push('highlight.');
            }

            details += policyHighlights.getHTMLTag({
                value: typeTag.join(' '),
                className: "type"
            });
        }

        const highlights = this.positionMap[text].map((highlightIndex) => {
            return policyHighlights.getHighlightHTML(this.config.highlights[highlightIndex]);
        });

        details += policyHighlights.getHTMLTag({
            value: highlights.join(''),
            className: "highlights"
        });

        return policyHighlights.getHTMLTag({
            value: details,
            className: "details"
        });
    }

    static getHighlightHTML(highlight) {
        const value = policyHighlights.getHTMLTag({ value: highlight.name, className: "name" })
            + policyHighlights.getHTMLTag({ value: highlight.description, className: "description" });

        return policyHighlights.getHTMLTag({ value, className: "highlight" });
    }

    static getHTMLTag({ value = '', className = '', style = '', tag = 'div' }) {
        return value && value.length > 0 && `<${tag} class="policyHighlight__${className}" style="${style}">${value}</${tag}>`;
    }
}

export default policyHighlights;

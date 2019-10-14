import style from "./index.scss";

class policyHighlights {
	constructor(config = {}) {
	    this.config = {
            autoHighlight: true,
            highlights: [],
            container: document,
            ...config,
            backgroundColor: {
                keyword: '#ffff00',
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
	    this.parsedHighlights = [];
        this.typeStyles = {};
        this.singularTypeMap = {
            'keywords': 'keyword',
            'actions': 'action',
        };
        this.invalidNodeTypes = ['body', 'head', 'html', 'script', 'style', 'title', 'form'];

        if (this.config.autoHighlight) {
            this.parseHighlights();
        }
	}

	parseHighlights() {
        this.parsedHighlights = [];
        const types = Object.keys(this.singularTypeMap);

        for (let a = this.config.highlights.length - 1; a >= 0; a--) {
            const highlight = this.config.highlights[a];

            for (let b = types.length - 1; b >= 0; b--) {
                const type = types[b];

                if (highlight[type] && highlight[type].length > 0) {
                    this.addTypeStyle({
                        type: this.singularTypeMap[type],
                    });

                    const texts = highlight[type].split(',');

                    for (let c = texts.length - 1; c >= 0; c--) {
                        const text = texts[c];

                        if (text.length > 0) {
                            this.addTextToPositionMap({
                                text,
                                index: a,
                            });

                            this.parsedHighlights.push({
                                text,
                                type: this.singularTypeMap[type],
                                regex: new RegExp('(^|\\W)' + text.replace(/[\\^$*+.?[\]{}()|]/, '\\$&') + '($|\\W)', 'gim'),
                            });
                        }
                    }
                }
            }
        };

        this.highlight();
    }

    highlight() {
        if (this.parsedHighlights.length === 0) {
            return;
        }

        let nodeText;
        let nodeStack = [];

        // Remove empty text nodes and combine adjacent text nodes.
        this.config.container.normalize();

        // Iterate through the container's child elements, looking for text nodes.
        let curNode = this.config.container.firstChild;

        while (curNode != null) {
            if (curNode.nodeType == Node.TEXT_NODE && !curNode.parentNode.dataset.highlight && this.invalidNodeTypes.indexOf(curNode.parentNode.nodeName.toLowerCase()) === -1) {
                // Get node text in a cross-browser compatible fashion.
                if (typeof curNode.textContent === 'string') {
                    nodeText = curNode.textContent;
                } else {
                    nodeText = curNode.innerText;
                }

                const matchMap = {};

                for (let x = this.parsedHighlights.length - 1; x >= 0; x--) {
                    // Use a regular expression to check if this text node contains the target text.
                    let match;
                    do {
                        match = this.parsedHighlights[x].regex.exec(nodeText);
                        if (match != null) {
                            matchMap[match.index] = {
                                type: this.parsedHighlights[x].type,
                                index: match.index,
                                length: match[0].length,
                                text: match[0],
                            };
                        }
                    } while (match != null);
                    match = undefined;
                }

                const matchMapValues = Object.values(matchMap);

                if (matchMapValues.length > 0) {
                    // Create a document fragment to hold the new nodes.
                    const fragment = document.createDocumentFragment();

                    for (let len = matchMapValues.length, x = 0; x < len; x++) {
                        // Create a new text node for any preceding text.
                        if (matchMapValues[x].index > 0) {
                            if (x === 0) {
                                fragment.appendChild(document.createTextNode(nodeText.substr(0, matchMapValues[x].index)));
                            } else {
                                const startIndex = matchMapValues[x - 1].index + matchMapValues[x - 1].length;
                                if (startIndex < matchMapValues[x].index) {    
                                    fragment.appendChild(document.createTextNode(nodeText.substr(startIndex, matchMapValues[x].index - startIndex)));
                                }
                            }
                        }

                        // Create the wrapper span and add the matched text to it.
                        const spanNode = document.createElement('span');
                        spanNode.setAttribute('style', this.typeStyles[matchMapValues[x].type]);
                        spanNode.setAttribute('data-type', matchMapValues[x].type);
                        spanNode.setAttribute('data-highlight', true);
                        spanNode.appendChild(document.createTextNode(matchMapValues[x].text));

                        // Events
                        spanNode.addEventListener('mouseover', this.showDetails.bind(this));
                        spanNode.addEventListener('mouseout', this.hideDetails.bind(this));

                        fragment.appendChild(spanNode);

                        if (x === len - 1) {
                            // Create a new text node for any following text.
                            if (matchMapValues[x].index + matchMapValues[x].length < nodeText.length) {
                                fragment.appendChild(document.createTextNode(nodeText.substr(matchMapValues[x].index + matchMapValues[x].length)));
                            }

                            // Replace the existing text node with the fragment.
                            curNode.parentNode.replaceChild(fragment, curNode);

                            curNode = spanNode;
                        }
                    }
                }
            } else if (curNode.nodeType == Node.ELEMENT_NODE && curNode.firstChild != null) {
                nodeStack.push(curNode);
                curNode = curNode.firstChild;
                // Skip the normal node advancement code.
                continue;
            }

            // If there's no more siblings at this level, pop back up the stack until we find one.
            while (curNode != null && curNode.nextSibling == null) {
                curNode = nodeStack.pop();
            }

            // If curNode is null, that means we've completed our scan of the DOM tree.
            // If not, we need to advance to the next sibling.
            if (curNode != null) {
                curNode = curNode.nextSibling;
            }
        }

        curNode = undefined;
        nodeText = undefined;
        nodeStack = undefined;
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
            this.typeStyles[type] = this.getHighlightStyle({
                type,
                style: ['display:inline-block;margin-left:4px;margin-right:4px;'],
            });
        }
    }

    addTextToPositionMap({ text, index }) {
        const cleanText = text.replace(/[.']/g, '').replace(/[\-]/g, ' ');
        if (!(cleanText in this.positionMap)) {
            this.positionMap[cleanText] = [index];
        } else if (this.positionMap[cleanText].indexOf(index) === -1) {
            this.positionMap[cleanText].push(index);
        }
    }

    showDetails(e) {
        const text = e.target.innerHTML.replace(/[\\^$*+.?[\]{}()<>|’'"“”;:\/©®]/g, '').replace(/&nbsp;/g, '').replace(/[\-&,]/g, ' ').trim().toLowerCase();
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

            value += ': ' + this.getHTMLTag({
                value: type,
                style,
                tag: 'span',
                className: "tag"
            });
        }

        let details = this.getHTMLTag({
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

            details += this.getHTMLTag({
                value: typeTag.join(' '),
                className: "type"
            });
        }

        const highlights = this.positionMap[text].map((highlightIndex) => {
            return this.getHighlightHTML(this.config.highlights[highlightIndex]);
        });

        details += this.getHTMLTag({
            value: highlights.join(''),
            className: "highlights"
        });

        return this.getHTMLTag({
            value: details,
            className: "details"
        });
    }

    getHighlightHTML(highlight) {
        const value = this.getHTMLTag({ value: highlight.name, className: "name" })
            + this.getHTMLTag({ value: highlight.description, className: "description" });

        return this.getHTMLTag({ value, className: "highlight" });
    }

    getHTMLTag({ value = '', className = '', style = '', tag = 'div' }) {
        return value && value.length > 0 && `<${tag} class="policyHighlight__${className}" style="${style}">${value}</${tag}>`;
    }
}

export default policyHighlights;

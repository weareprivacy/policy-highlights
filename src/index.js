import style from "./index.scss";

class policyHighlights {
	constructor(config = {}) {
	    this.config = {
	        ...{
                autoHighlight: true,
                highlights: [],
                container: document,
                keywordBackgroundColor: '#ffff00',
                keywordTextColor: '#000000',
                actionBackgroundColor: '#fcf1cd',
                actionTextColor: '#000000',
            },
            ...config,
	    };
	    
	    this.highlightMap = {};
	    this.keywordDetails = null;
	    
        if (this.config.autoHighlight) {
            this.parseHighlights();
        }
	}
	
	parseHighlights() {
	    const parse = (highlight, index) => {
            const text = highlight.text.replace(/[.']/g, '').replace(/[\-]/g, ' ');
            if (!(text in this.highlightMap)) {
                this.highlightMap[text] = [index];
            } else if (this.highlightMap[text].indexOf(index) === -1) {
                this.highlightMap[text].push(index);
            }

            this.highlight(highlight);
        };
	    
        this.config.highlights.forEach((h, hIndex) => {
            (h.keywords || '').split(',').forEach((text) => {
                parse({
                    text,
                    type: 'keyword'
                }, hIndex);
            });
            
            (h.actions || '').split(',').forEach((text) => {
                parse({
                    text,
                    type: 'action',
                    backgroundColor: this.config.actionBackgroundColor,
                    textColor: this.config.actionTextColor
                }, hIndex);
            });
        });
    }

    highlight({ text = '', backgroundColor = this.config.keywordBackgroundColor, textColor = this.config.keywordTextColor, type }) {
	    if (text.length === 0) {
	        return;
        }
        
        // Construct a regular expression that matches text at the start or end of a string or surrounded by non-word characters.
        // Escape any special regex characters in text.
        let textRE = new RegExp('(^|\\W)' + text.replace(/[\\^$*+.?[\]{}()|]/, '\\$&') + '($|\\W)', 'im');
        let nodeText;
        let nodeStack = [];
        const invalidNodeTypes = ['body', 'head', 'html', 'script', 'style', 'title', 'form'];

        // Remove empty text nodes and combine adjacent text nodes.
        this.config.container.normalize();

        // Iterate through the container's child elements, looking for text nodes.
        let curNode = this.config.container.firstChild;

        while (curNode != null) {
            if (curNode.nodeType == Node.TEXT_NODE && !curNode.parentNode.dataset.highlight && invalidNodeTypes.indexOf(curNode.parentNode.nodeName.toLowerCase()) === -1) {
                // Get node text in a cross-browser compatible fashion.
                if (typeof curNode.textContent === 'string') {
                    nodeText = curNode.textContent;
                } else {
                    nodeText = curNode.innerText;
                }

                // Use a regular expression to check if this text node contains the target text.
                let match = textRE.exec(nodeText);
                if (match != null) {
                    // Create a document fragment to hold the new nodes.
                    let fragment = document.createDocumentFragment();

                    // Create a new text node for any preceding text.
                    if (match.index > 0) {
                        fragment.appendChild(document.createTextNode(match.input.substr(0, match.index)));
                    }
                    
                    // Setup style for span
                    const style = this.highlightStyle({
                        style: ['display:inline-block;margin-left:3px;margin-right:3px;'],
                        backgroundColor,
                        textColor
                    });

                    // Create the wrapper span and add the matched text to it.
                    let spanNode = document.createElement('span');
                    spanNode.setAttribute('style', style);
                    if (type) {
                        spanNode.dataset.type = type;
                    }
                    spanNode.dataset.highlight = true;
                    spanNode.appendChild(document.createTextNode(match[0]));
                    fragment.appendChild(spanNode);

                    // Events
                    spanNode.addEventListener('mouseover', this.showDetails.bind(this));
                    spanNode.addEventListener('mouseout', this.hideDetails.bind(this));

                    // Create a new text node for any following text.
                    if (match.index + match[0].length < match.input.length) {
                        fragment.appendChild(document.createTextNode(match.input.substr(match.index + match[0].length)));
                    }

                    // Replace the existing text node with the fragment.
                    curNode.parentNode.replaceChild(fragment, curNode);

                    curNode = spanNode;
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
    }
    
    highlightStyle({ style = [], backgroundColor = this.config.keywordBackgroundColor, textColor = this.config.keywordTextColor }) {
        if (backgroundColor && backgroundColor.length > 0) {
            style.push('background-color: ' + backgroundColor + ';');
        }
        if (textColor && textColor.length > 0) {
            style.push('color: ' + textColor + ';');
        }
        
        return style.join('');
    }

    showDetails(e) {
        const text = e.target.innerHTML.replace(/[\\^$*+.?[\]{}()<>|’'"“”;:\b&nbsp;\b]/g, '').replace(/[\-&,]/g, ' ').trim().toLowerCase();
        if (text in this.highlightMap) {
            this.hideDetails();

            const top = e.pageY - e.offsetY + e.target.clientHeight + 1;//1 = prevent popup hover toggle flicker
            const left = e.pageX - e.offsetX + (e.target.clientWidth / 2) - 42;//42 = 34 popup offset + 8 :before width

            let popupNode = document.createElement('div');
            popupNode.setAttribute('class', 'policyHighlight__popup');
            popupNode.setAttribute('style', 'top:' + top + 'px;left:' + left + 'px;');
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
            let style = '';
            if (type === 'keyword') {
                style = this.highlightStyle({});
            } else {
                style = this.highlightStyle({
                    backgroundColor: this.config.actionBackgroundColor,
                    textColor: this.config.actionTextColor
                });
            }

            value += ': ' + this.getHTMLTag({
                value: type,
                style,
                tag: 'span',
                className: "policyHighlight__tag"
            });
        }

        let details = this.getHTMLTag({
            value,
            className: "policyHighlight__text"
        });

        if (type) {
            let typeTag = ['An important', type, 'in the below'];

            if (this.highlightMap[text].length > 1) {
                typeTag.push(this.highlightMap[text].length + ' highlights.');
            } else {
                typeTag.push('highlight.');
            }

            details += this.getHTMLTag({
                value: typeTag.join(' '),
                className: "policyHighlight__type"
            });
        }

        const highlights = this.highlightMap[text].map((highlightIndex) => {
            return this.getHighlightHTML(this.config.highlights[highlightIndex]);
        });
        
        details += this.getHTMLTag({
            value: highlights.join(''),
            className: "policyHighlight__highlights"
        });

        return this.getHTMLTag({
            value: details,
            className: "policyHighlight__details"
        });
    }

    getHighlightHTML(highlight) {
        const value = this.getHTMLTag({ value: highlight.name, className: "policyHighlight__name" }) 
            + this.getHTMLTag({ value: highlight.description, className: "policyHighlight__description" });
        
        return this.getHTMLTag({ value, className: "policyHighlight__highlight" });
    }

    getHTMLTag({ value = '', className = '', style = '', tag = 'div' }) {
        return value && value.length > 0 && `<` + tag + ` class="` + className + `" style="` + style + `">` + value + `</` + tag + `>`;
    }
}

export default policyHighlights;

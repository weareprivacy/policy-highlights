import style from "./sass/index.scss";

class policyHighlights {
	constructor({ config }) {
		this.container = document;
		this.style = 'background-color: yellow;';
		this.wrapText('privacy');
	}

    wrapText(text) {
        // Construct a regular expression that matches text at the start or end of a string or surrounded by non-word characters.
        // Escape any special regex characters in text.
        let textRE = new RegExp('(^|\\W)' + text.replace(/[\\^$*+.?[\]{}()|]/, '\\$&') + '($|\\W)', 'im');
        let nodeText;
        let nodeStack = [];

        // Remove empty text nodes and combine adjacent text nodes.
        this.container.normalize();

        // Iterate through the container's child elements, looking for text nodes.
        let curNode = this.container.firstChild;

        while (curNode != null) {
            if (curNode.nodeType == Node.TEXT_NODE) {
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

                    // Create the wrapper span and add the matched text to it.
                    let spanNode = document.createElement('span');
                    spanNode.setAttribute('style', this.style);
                    spanNode.appendChild(document.createTextNode(match[0]));
                    fragment.appendChild(spanNode);

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
}

export default policyHighlights;

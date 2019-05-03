/**
 * Created by 1 on 2017/7/5.
 */
function getLastTextNodeIn(node) {
    while (node) {
        if (node.nodeType == 3) {
            return node;
        } else {
            node = node.lastChild;
        }
    }
}
function preventPaste(e){
    e.preventDefault();
    _top_alert('暂不支持粘贴',false);
}
function isRangeAfterNode(range, node) {
    var nodeRange, lastTextNode;
    if (range.compareBoundaryPoints) {
        nodeRange = document.createRange();
        lastTextNode = getLastTextNodeIn(node);
        if(lastTextNode)
            nodeRange.selectNodeContents(lastTextNode);
        nodeRange.collapse(false);
        return range.compareBoundaryPoints(range.START_TO_END, nodeRange) > -1;
    } else if (range.compareEndPoints) {
        if (node.nodeType == 1) {
            nodeRange = document.body.createTextRange();
            nodeRange.moveToElementText(node);
            nodeRange.collapse(false);
            return range.compareEndPoints("StartToEnd", nodeRange) > -1;
        } else {
            return false;
        }
    }
}

if(navigator.userAgent.indexOf('Firefox')>0){
    $('.form-title-input').bind("keydown", function (event) {
        var sel, range, node, nodeToDelete, nextNode, nodeRange;
        if (event.keyCode == 8 || event.keyCode == 46) {
            // Get the DOM node containing the start of the selection
            if (window.getSelection && window.getSelection().getRangeAt) {
                range = window.getSelection().getRangeAt(0);
            } else if (document.selection && document.selection.createRange) {
                range = document.selection.createRange();
            }

            if (range) {
                node = this.lastChild;
                if( node && node.nodeValue == ""){
                    node = node.previousSibling;
                }
                if( node && node.nodeType != 3 ){
                    while (node) {
                        if ( isRangeAfterNode(range, node) ) {
                            nodeToDelete = node;
                            break;
                        } else {
                            node = node.previousSibling;
                        }
                    }

                    if (nodeToDelete) {
                        this.removeChild(nodeToDelete);
                    }
                }
                else if(node){
                    var index = node.length-1;
                    if(index >= 0)
                        node.deleteData(index,1);
                    else
                        this.removeChild(node);
                }
                return false;
            }

        }
    })
}

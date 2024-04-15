
chrome.runtime.onMessage.addListener((req, sender, sendMessage)=>{
    if (req == 'hand_selection'){
        document.addEventListener('click', getElementByClick)
    }
    else if (req == 'auto_selection'){
        //TODO
    }
})

async function getElementByClick(event){
    const target = event.target.innerText

    //сделать нахождение селектора для элемента и его возвращать пользователю
    const selector = getSelector(event.target)
    const inners = document.querySelectorAll(selector)
    for (let i = 0; i < inners.length; i++) {
        console.log(inners[i].innerText)
    }
    chrome.runtime.sendMessage({selector})
}

function getSelector(node, node_list=[], selectors=[[],[],[]], skip=1, li_found=false){

    node_list.unshift(node)

    const tag_name = node.tagName.toLowerCase()
    const class_selector = (node.className) ? '.' + node.className.split(' ').join('.') : ''
    const nth_selector = `:nth-child(${getNodeIndex(node)})`
    let node_selector = ''
    
    if (tag_name == 'body') return full_selector(selectors) //good end
    if (li_found) {
        // console.log('1')
        if (selectors[0].length > 0 && document.querySelectorAll(selectors[0].join('>')).length == 1)
            return full_selector(selectors) //best end
        
        node_selector = class_selector + nth_selector
        selectors[0].unshift(tag_name + node_selector)
    }
    else if (skip > 0 || node.parentNode.querySelectorAll(full_selector(selectors)).length == 1){
        // console.log('2')
        node_selector = class_selector + nth_selector
        selectors[2].unshift(tag_name + node_selector)
    }
    else if (document.querySelectorAll(full_selector(selectors)).length > 1){
        // console.log('3')
        node_selector = class_selector
        li_found = true
        selectors[1].unshift(tag_name + node_selector)
    }
    // console.log('up')
    return getSelector(node.parentNode, node_list, selectors, skip-1, li_found) //next

    function getNodeIndex(el){
        return [...el.parentNode.children].indexOf(el) + 1
    }

    function full_selector(selectors2){
        let sel = [selectors2[0].join(' > '), selectors2[1].join(' > '), selectors2[2].join(' > ')]
        sel = sel.filter(Boolean)
        sel = sel.join(' > ')
        return sel
    }
}
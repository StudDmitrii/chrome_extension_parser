
chrome.runtime.onMessage.addListener((req, sender, sendMessage)=>{
    if (req == 'hand_selection'){
        document.removeEventListener('click', getElementByClick)
        document.addEventListener('click', getElementByClick)
    }
    if (req == 'auto_selection'){
        //TODO
    }
    if (req == 'stop_hand_selecion'){
        document.removeEventListener('click', getElementByClick)
    }
})

async function getElementByClick(event){
    const [card_container, card, card_element] = SelectorManager.getSelector(event.target)
    const each_card_element = document.querySelectorAll(SelectorManager.getFullSelector([card_container, card, card_element]))
    //const each_card = document.querySelectorAll(SelectorManager.getFullSelector([card_container, card]))
    PageStyler.styleElements(each_card_element, 'blue')
    //PageStyler.styleElements(each_card, 'red')
    await chrome.runtime.sendMessage({selectors: [card_container, card, card_element]})
}

class PageStyler {
    static styleElements(elements, color){
        for (let elem of elements){
            elem.style.cssText = `
            border: 2px solid ${color};
            `
        }
    }
}

class SelectorManager {
    static getSelector(node, node_list=[], selectors=[[],[],[]], skip=1, card_selector_found=false){

        const return_value = selectors.map((el)=>el.join('>')) // global_selector, card_selector, element_selector
        node_list.unshift(node)
    
        const tag_name = node.tagName.toLowerCase()
        const class_selector = (node.className) ? '.' + node.className.toString().trim().split(' ').join('.') : ''
        const nth_selector = `:nth-child(${getNodeIndex(node)})`
        let node_selector = ''
        
        if (tag_name == 'body') return return_value//this.getFullSelector(selectors)
        if (card_selector_found) {
            // console.log('1')
            if (selectors[0].length > 0 && document.querySelectorAll(selectors[0].join('>')).length == 1)
                return return_value//this.getFullSelector(selectors)
            
            node_selector = class_selector + nth_selector
            selectors[0].unshift(tag_name + node_selector)
        }
        else if (skip > 0 || node.parentNode.querySelectorAll(this.getFullSelector(selectors)).length == 1){
            // console.log('2')
            node_selector = class_selector + nth_selector
            selectors[2].unshift(tag_name + node_selector)
        }
        else if (document.querySelectorAll(this.getFullSelector(selectors)).length > 1){
            // console.log('3')
            node_selector = class_selector
            card_selector_found = true
            selectors[1].unshift(tag_name + node_selector)
        }
        // console.log('up')
        return this.getSelector(node.parentNode, node_list, selectors, skip-1, card_selector_found) //next
    
        function getNodeIndex(el){
            return [...el.parentNode.children].indexOf(el) + 1
        }
    }

    static getFullSelector(selectors){
        return selectors.filter(el=>el.length==0?false:true).join(' > ')
    }
}
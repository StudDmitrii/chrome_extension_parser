export default async function getElementByClick(){
    let target
    //if only text selected
    if (event.target.childElementCount == 0) target = event.target.innerHTML
    //other way
    else target = event.target.outerHTML

    await chrome.runtime.sendMessage({target})

    document.removeEventListener('click', getTextByClick, false)
    document.removeEventListener('click', getTextByClick, true)

    //styling
    event.target.style.textShadow = "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 10px orange"
    event.target.style.color = "white"

    return true
}
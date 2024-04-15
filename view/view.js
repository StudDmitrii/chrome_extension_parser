/*
файл алгоритм
*/

//task 1 - selection
const btn_hand_sel = document.getElementById('btn_hand_select')
const btn_auto_sel = document.getElementById('btn_auto_select')

btn_hand_sel.addEventListener('click', hand_selection)
btn_auto_sel.addEventListener('click', auto_selection)

chrome.runtime.onMessage.addListener((req, sender, sendMessage)=>{
    if (req.selector){
        const el = document.createElement('p')
        el.innerHTML = req.selector
        document.body.appendChild(el)
    }
})

async function hand_selection(){
    btn_auto_sel.disabled = true

    const [tab] = await chrome.tabs.query({active:true, lastFocusedWindow: true})
    const res = await chrome.tabs.sendMessage(tab.id, 'hand_selection')
}

async function auto_selection(){
    btn_hand_sel.disabled = true

    const [tab] = await chrome.tabs.query({active:true, lastFocusedWindow: true})
    const res = await chrome.tabs.sendMessage(tab.id, 'auto_selection')
}
/*
при клике:
открытие боковой панели =
внедрить скрипт =
внедрить стили

при повторном клике:
удалить скрипт
удалить стили
закрыть боковую панель =

при переключнии вкладки:
удалить скрипт
удалить стили
закрыть боковую панель =
*/

chrome.action.onClicked.addListener(async (tab)=>{
    await chrome.sidePanel.open({
        tabId:tab.id,
        windowId:tab.windowId
    })
    const extEnabled = (await chrome.storage.session.get('state')).state
    if (extEnabled) {
        await disableExt(tab)
    }
    else{
        await enableExt(tab)
    }
})

chrome.tabs.onActivated.addListener(async (tab)=>{
    const extEnabled = (await chrome.storage.session.get('state')).state
    if (extEnabled) await disableExt(tab)
})

async function enableExt(tab){
    await chrome.storage.session.set({'state':'on'})

    await chrome.sidePanel.setOptions({
        enabled: true,
        path: "view/index.html"
    })

    await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ["cnt/content.js"]
    })

    //todo
    // await chrome.scripting.insertCSS({
    //     target: {tabId: tab.id},
    //     css: "cnt/element_style.css"
    // })
}

async function disableExt(tab){
    await chrome.storage.session.remove('state')

    await chrome.sidePanel.setOptions({
        enabled: false,
        path:"view/index.html"
    })

    await chrome.sidePanel.setOptions({
        enabled: true,
        path: "view/index.html"
    })

    //todo
    // await chrome.scripting.removeCSS({
    //     target: {tabId: tab.id},
    //     css: "cnt/element_style.css"
    // })
}
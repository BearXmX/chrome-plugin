let currentTabId = null;

// 监听标签页更新事件
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // 检查页面是否加载完成
  if (changeInfo.status === 'complete') {
    // 发送通知给用户
    /*     chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: '标签页更新',
          message: '页面已更新: ' + tab.title.slice(0, 10)
        }); */

    currentTabId = tabId
    ensureCommunicationWithCurrentTab(tabId)
  }
});

// 监听标签页切换事件
chrome.tabs.onActivated.addListener(function (activeInfo) {
  currentTabId = activeInfo.tabId;

  // 获取当前激活的标签页信息
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    ensureCommunicationWithCurrentTab(activeInfo.tabId);
    return true
  });
});

// 确保与当前标签页建立通信
function ensureCommunicationWithCurrentTab(id) {

  if (id !== null) {
    chrome.tabs.sendMessage(id, {
      reply: null,
      data: null,
      command: 'connect',
      to: 'contentScript',
      from: 'background'
    }, function (response) {
      if (typeof response === 'object' && response.reply === 'ok') {
        console.log(response, '已与当前标签页建立通信');
      } else {
        console.log('与当前标签页建立通信失败');
      }
    });
  }
}

// 监听来自弹出窗口的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (!currentTabId) return

  const { from, command, reply, to, data } = request

  console.log(`background收到命令：`, request);

  // 由popup发送给background的消息
  if (to === 'background' && from === 'popup') {

    if (command === 'get_page_all_image_src') {

      sendMessageToContentScript({ reply: null, command: 'get_page_all_image_src', to: 'contentScript', from: 'background' })
        .then(response => {
          // 将内容脚本的响应发送给弹出窗口
          sendResponse(response);
        })

      return true; // 返回true，以告知Chrome后台等待sendResponse被调用
    }

    if (command === 'get_oss_resource_src') {

      sendMessageToContentScript({ reply: null, command: 'get_oss_resource_src', to: 'contentScript', from: 'background' })
        .then(response => {
          // 将内容脚本的响应发送给弹出窗口
          sendResponse(response);
        })

      return true; // 返回true，以告知Chrome后台等待sendResponse被调用
    }
  }
});

function sendMessageToContentScript(params) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(currentTabId, params, function (response) {
      console.log(`background收到回复：`, response);
      resolve(response || { error: '通信失败' });
    });
  });
}

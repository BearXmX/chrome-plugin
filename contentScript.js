(function () {
  console.log('%cchrome plugin contentScript init', 'background-color: #00b96b;color: #fff;padding: 0 12px;border-radius: 6px;height: 24px;line-height: 24px;font-size:16px');

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    const { from, command, reply, to, data, error } = request

    console.log(`contentScript收到发来的命令：`, request);

    if (to === 'contentScript' && from === 'background') {

      // 执行get_page_all_image_src命令
      if (command === 'get_page_all_image_src') {

        sendResponse({
          reply: null,
          data: Array.from(document.querySelectorAll('img')).map(img => img.src),
          to: 'background',
          command: 'get_page_all_image_src',
          from: 'contentScript'
        });
      }

      // 执行get_page_all_image_src命令
      if (command === 'get_oss_resource_src') {

        sendResponse({
          reply: null,
          data: Array.from(document.querySelectorAll('.xcomponent-table-body td[data-next-table-col="2"] button span')).map(span => {
            return {
              filename: span.textContent,
              ext: span.textContent.split('.')[span.textContent.split('.').length - 1],
              name: span.textContent.split('.')[0]
            }
          }),
          to: 'background',
          command: 'get_oss_resource_src',
          from: 'contentScript'
        });
      }

      // 执行connect命令
      if (command === 'connect') {
        sendResponse({
          reply: 'ok',
          data: null,
          to: 'background',
          command: 'connect',
          from: 'contentScript'
        })
      }
    }
  });

})()


document.addEventListener('DOMContentLoaded', () => {

  const _postMessage = (params, callback) => {
    chrome.runtime.sendMessage(params, (response) => {
      console.log('popup收到来自background的回复：', response);

      if (!response) {
        alert('error')
        return
      }
      callback(response)
    });
  }

  // image
  const search = document.querySelector('.search-btn')

  search.addEventListener('click', async () => {

    const params = {
      data: null,
      reply: null,
      command: 'get_page_all_image_src',
      to: 'background', from: 'popup'
    }
    _postMessage(params, (response) => {
      const { from, command, reply, to, data, error } = response

      if (error) {
        alert(error + '无法读取该网站数据')
        return
      }

      if (data.length === 0) return alert('该网站没有图片')

      const imageList = data.map(item => {
        const img = document.createElement('img')
        img.src = item
        return img
      })

      document.querySelector('.web-image-content').append(...imageList)
    });
  })



  // oss
  const oss = document.querySelector('.oss-btn')

  oss.addEventListener('click', async () => {

    const params = {
      data: null,
      reply: null,
      command: 'get_oss_resource_src',
      to: 'background', from: 'popup'
    }
    _postMessage(params, (response) => {
      const { from, command, reply, to, data, error } = response

      if (error) {
        alert(error + '无法读取该网站数据')
        return
      }

      const obj = {
        data: data.map(item => {
          return {
            ...item,
            url: document.querySelector('.oss-host-input').value + '/' + item.filename
          }
        }),
      }

      document.querySelector('.oss-content').innerHTML = JSON.stringify(obj)

      if (document.querySelector('.oss-host-checkbox').checked) {
        const json = document.createElement('a')
        json.download = 'oss.json'
        json.href = 'data:text/plain,' + JSON.stringify(obj)
        json.click()
        json.remove()
      }
    });
  })

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const { from, command, reply, to, data } = request
  });
});
import './index.css';

import Alpine from 'alpinejs'
 
Alpine.start()

const userMsgElem = window.document.getElementById("user-msg-txtarea")
const chatAreaElem = window.document.getElementById("chat-area")

function userMsgTemplate (userMsg) {
  return `
  <div class="self-end bg-blue-600 shadow text-white rounded-xl px-3 max-w-[80%] w-fit mb-4">
    <p>
      ${userMsg}
    </p>
  </div>`
}

function sendMsg() {
  chatAreaElem.innerHTML = chatAreaElem.innerHTML + userMsgTemplate(userMsgElem.value)
  userMsgElem.value = ""
}

window.Alpine = Alpine
window.sendMsg = sendMsg;


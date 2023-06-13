import './index.css';

import Alpine from 'alpinejs'
 
Alpine.start()

const userMsgElem = window.document.getElementById("user-msg-txtarea")
const chatAreaElem = window.document.getElementById("chat-area")

function userMsgTemplate(userMsg) {
  return `
  <div class="self-end bg-blue-600 shadow text-white rounded-xl px-3 max-w-[80%] w-fit mb-4">
    <p>
      ${userMsg}
    </p>
  </div>`
}

function botMsgTemplate(botMsg) {
  return `
  <div class="border border-violet-100 bg-violet-50 shadow text-gray-900 rounded-xl px-3 max-w-[80%] w-fit">
    <p>
      ${botMsg}
    </p>
  </div>`
}

function sendMsg() {
  chatAreaElem.innerHTML = chatAreaElem.innerHTML + userMsgTemplate(userMsgElem.value)
  chatAreaElem.parentElement.scrollTop = chatAreaElem.parentElement.scrollHeight;
  userMsgElem.value = ""
  chatAreaElem.innerHTML = chatAreaElem.innerHTML + botMsgTemplate("Fake response from bot.")
  chatAreaElem.parentElement.scrollTop = chatAreaElem.parentElement.scrollHeight;
}

function selectUserFile() {
  console.log("boo")
  window.api.send("toMain", "cmd:user-select-file");
}

window.Alpine = Alpine
window.sendMsg = sendMsg;
window.selectUserFile = selectUserFile;


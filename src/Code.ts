function doGet(e) {
  const template = e.parameter.wid ? 'Approve' : 'Index'
  const html = HtmlService.createTemplateFromFile(template).evaluate()
  html.setTitle('Document Approval')
  html.addMetaTag('viewport', 'width=device-width, initial-scale=1, shrink-to-fit=no')
  return html
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}

function getUserEmail() {
  return Session.getActiveUser().getEmail()
}

function getNonce(length: number) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefhijklmnopqrstuvwxyz0123456789'
  for (let i of possible) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

// TODO: specify argument types
function buildParams(method: string, payload: any, headers?: object) {
  const params = {
    method,
    contentType: 'application/json',
    muteHttpExceptions: true,
    headers,
    payload
  }
  return params
}
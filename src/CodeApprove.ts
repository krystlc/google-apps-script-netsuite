function handleResponse(id, answer) {
  const token = fetchSCMToken()
  const workflow = signalSCMWorkflow(id, answer, token)
  return workflow
}

function getSCMWorkflowStatus(wid) {
  const token = fetchSCMToken()
  const url: string = `${token.api_base_url}/v201411/workflows/${wid}`
  const params: object = buildParams('get', null, { Authorization: `${token.token_type} ${token.access_token}` })

  const response = UrlFetchApp.fetch(url, params).getContentText()
  return JSON.parse(response)
}

function signalSCMWorkflow(id, answer, token) {
  const value = {
    Data: answer
  }

  const url: string = `${token.api_base_url}/v201411/workflows/${id}/signal`
  const params: object = buildParams('post', JSON.stringify(value), { Authorization: `${token.token_type} ${token.access_token}` })

  const response = UrlFetchApp.fetch(url, params).getContentText()
  return JSON.parse(response)
}
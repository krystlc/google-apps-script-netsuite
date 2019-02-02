function uploadContractToSCM(params: object, form, file: File, filename: string) {
  // upload document to springcm to obtain a document id
  const token = fetchSCMToken()
  const doc = uploadDocumentToSCM(file, filename, token)

  // get author and netsuite record data
  const record = fetchRecordFromNetsuite(params)

  // add above to the form for xml formatting
  form.record = record

  // format data and ship to SpringCM
  const xml = buildSCMXmlDoc(form, doc)
  console.log('data to send to SCM', xml)
  const workflow = startSCMWorkflow(xml, token)
  return workflow
}

function fetchRecordFromNetsuite(params) {
  const id = params.id
  const type = params.type
  try {
    const base_url = '' // add your netsuite restlet url without parameters
    const realm = '3854647_SB3'
    const http_meathod = 'GET'
    const script = '985'
    const deployment = '1'

    // TODO: build a function to deconstruct and rebuild this url, for the signature and for the request
    const url = `${base_url}?script=${script}&deploy=${deployment}&id=${id}&record_type=${type}`
    const token = buildBaseString(base_url, realm, http_meathod, script, deployment, id, type)
    const params: object = buildParams(http_meathod.toLowerCase(), null, { Authorization: token })
    const response = UrlFetchApp.fetch(url, params).getContentText()

    return JSON.parse(response)
  } catch(err) {
    console.log('Could not fetch record data from Netsuite.', err)
    return err
  }
}
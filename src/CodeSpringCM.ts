function fetchSCMToken() {
  const scriptProperties = PropertiesService.getScriptProperties()
  const props: any = scriptProperties.getProperties()

  const credentials: object = {
    client_id: props.client_id,
    client_secret: props.client_secret
  }

  const url = `https://authuat.springcm.com/api/v201606/apiuser`
  const params: object = buildParams('post', JSON.stringify(credentials))

  const response = UrlFetchApp.fetch(url, params).getContentText()
  return JSON.parse(response)
}

function uploadDocumentToSCM(doc, name, token) {
  const contentType = doc.substring(5, doc.indexOf(';'))
  const bytes = Utilities.base64Decode(doc.substr(doc.indexOf('base64,') + 7))
  const file = Utilities.newBlob(bytes, contentType, name)
  const folderId = '' // add the folder id where you want to upload the document

  const url: string = `https://apidownloaduatna11.springcm.com/v201411/folders/${folderId}/documents?name=${name}`
  const params: object = buildParams('post', file, { Authorization: `${token.token_type} ${token.access_token}` })

  const response = UrlFetchApp.fetch(url, params).getContentText()
  return JSON.parse(response)
}

function buildSCMXmlDoc(form: object, doc?) {
  const root = XmlService.createElement('TemplateFieldData')

  const user: any = XmlService.createElement('user').setText(getUserEmail())
  root.addContent(user)
  const document_type: any = XmlService.createElement('custom_attribute').setText('Custom Attribute')
  root.addContent(document_type)
  if (doc) {
    const ExistingDoc: any = XmlService.createElement('existing_doc').setText(doc.Name)
    root.addContent(ExistingDoc)
  }

  Object.keys(form).forEach(field => {
    let tag = field
    let value = form[field]
    if (typeof value === 'object') {
      Object.keys(value).forEach(deepField => {
        addToRoot(deepField, value[deepField])
      })
    } else {
      addToRoot(tag, value)
    }
  })

  function addToRoot(t, v) {
    let item: any = XmlService.createElement(t)
    item.setText(v)
    root.addContent(item)
  }

  const document = XmlService.createDocument(root)
  const xml = XmlService.getPrettyFormat().format(document)
  return xml
}

function startSCMWorkflow(xml, token) {
  const task = {
    Name: 'Workflow Name',
    Params: xml
  }

  const url = `${token.api_base_url}/v201411/workflows`
  const params: object = buildParams('post', JSON.stringify(task), { Authorization: `${token.token_type} ${token.access_token}` })

  const response = UrlFetchApp.fetch(url, params).getContentText()
  return JSON.parse(response)
}
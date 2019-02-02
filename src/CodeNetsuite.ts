// must be refactored to accept custom parameters (e.g. `record_id`). 
// see PHP sample: `The restletBaseString Function` in https://docs.oracle.com/cloud/latest/netsuitecs_gs/NSATH/NSATH.pdf

function buildBaseString(base_url: string, realm: string, http_method: string, script_id: string, deployment_id: string, record_id: string, record_type: string) {
  const scriptProperties = PropertiesService.getScriptProperties()
  const props: any = scriptProperties.getProperties()

  const oauth_nonce = getNonce(32)
  const time_stamp = Math.round(+new Date()/1000).toString()
  const oauth_version = '1.0'
  const signature_method = 'HMAC-SHA256'

  const data: string = 'deploy=' + deployment_id + '&' +
    'id=' + record_id + '&' +
    'oauth_consumer_key=' + props.consumer_key + '&' + 
    'oauth_nonce=' + oauth_nonce + '&' +
    'oauth_signature_method=' + signature_method + '&' +
    'oauth_timestamp=' + time_stamp + '&' +
    'oauth_token=' + props.token_id + '&' +
    'oauth_version=' + oauth_version + '&' +
    'record_type=' + record_type + '&' +
    'script=' + script_id

  const completeData = http_method + '&' + encodeURIComponent(base_url) + '&' + encodeURIComponent(data)
  const hmacsha256Data = Utilities.computeHmacSha256Signature(completeData, props.consumer_secret + '&' + props.token_secret)
  const base64EncodedData = Utilities.base64Encode(hmacsha256Data)
  const oauthSignature = encodeURIComponent(base64EncodedData)

  return 'OAuth oauth_signature="' + oauthSignature + '",' +
    'oauth_version="' + oauth_version + '",' +
    'oauth_nonce="' + oauth_nonce + '",' +
    'oauth_signature_method="' + signature_method + '",' +
    'oauth_consumer_key="' + props.consumer_key + '",' +
    'oauth_token="' + props.token_id + '",' +
    'oauth_timestamp="' + time_stamp + '",' +
    'realm="' + realm + '"'
}
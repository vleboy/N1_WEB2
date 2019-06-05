// console.log(process.env.NODE_ENV);
// export const URL='d3rqtlfdd4m9wd.cloudfront.net'
export const URL =process.env.NODE_ENV == 'production'?'n1agent.na12345.com':'testagent.cncshe.com'

// console.log(URL);

export const httpType = 'https://'
//登录页,验证码
export const api = {
  getVaptcha: httpType + URL + '/vaptcha/getVaptcha',
  getDownTime: httpType + URL + '/vaptcha/getDownTime'
}

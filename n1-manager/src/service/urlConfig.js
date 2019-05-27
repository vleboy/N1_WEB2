// console.log(process.env.NODE_ENV);
// export const URL='d3rqtlfdd4m9wd.cloudfront.net'
export let URL = type => {
  if (process.env.NODE_ENV == 'production') {
    switch (type) {
      default:
        return 'n1admin.na12345.com'
        break
    }
  } else {
    switch (type) {
      default:
        return 'test.cncshe.com'
        break
    }
  }
}
// console.log(URL);

export const httpType = 'https://'

export const api = {
  getVaptcha: httpType + URL() + '/vaptcha/getVaptcha',
  getDownTime: httpType + URL() + '/vaptcha/getDownTime'
}

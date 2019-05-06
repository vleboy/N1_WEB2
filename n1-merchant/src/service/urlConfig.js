// console.log(process.env.NODE_ENV);
// export const URL='d3rqtlfdd4m9wd.cloudfront.net'
export let URL = type => {
  if (process.env.NODE_ENV == 'production') {
    switch (type) {
      case 'game':
        return 'n1game.na12345.com'
        break
      case 'map':
        return 'visual.na12345.com'
        break
      default:
        return 'n1admin.na12345.com'
        break
    }
  } else {
    switch (type) {
      case 'game':
        return 'dgjmusja39cm2.cloudfront.net'
        break
      case 'map':
        return 'test.cncshe.com'
        break
      default:
        return 'd3rqtlfdd4m9wd.cloudfront.net'
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

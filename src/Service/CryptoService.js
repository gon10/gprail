import CryptoJS from 'crypto-js'

export default class CryptoService {

  static encrypt(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123').toString()
  }

  static decrypt(data) {
    return JSON.parse((CryptoJS.AES.decrypt(data, 'secret key 123')).toString(CryptoJS.enc.Utf8))
  }

}
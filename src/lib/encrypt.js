import UTF8 from 'crypto-js/enc-utf8'
import Base64 from 'crypto-js/enc-base64'
export function encryptByBase64(cipherText) {
  return Base64.stringify(UTF8.parse(cipherText))
}

// Base64解密
export function decryptByBase64(cipherText) {
  return Base64.parse(cipherText).toString(UTF8)
}
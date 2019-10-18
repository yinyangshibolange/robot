const express = require('express')
const router = express.Router()
const request = require("request")

const cache = require("memory-cache")
const sign = require("../util/sign")
// const commonres = require("./server/commonres.js")
// require('./config.js')
// const istest = process.env.istest
/**
 *  中控服务器, 获取和刷新accessToken
 */
const app = {
    appid: 'wx4544272b904d046c',
    secret: 'ec4c498427503ea922b91beb8f47cd45',
}
const initAccessToken = () => {
    return new Promise((resolve, reject) => {
        if(cache.get('access_token')) {
            resolve(cache.get('access_token'))
        } else {
            request.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${app.appid}&secret=${app.secret}`, (err, response, body) => {
                if(err) {
                    reject(err)
                } else if (response.statusCode === 200) {
                    try {
                        body = JSON.parse(body)
                        cache.put('access_token', body.access_token, body.expires_in * 1000)
                        resolve(body.access_token)
                    } catch(err) {
                        reject('检查获取accessToken接口')
                    }
                    
                } else {
                    // 判断错误状态码 进行返回
                }
                
            })
        }
    })
}

const initTicket = () => {
    return new Promise((resolve, reject) => {
        if(cache.get('ticket')) {
            resolve(cache.get('ticket'))
        } else {
            initAccessToken().then(accessToken => {
                request.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`, (err, response, body) => {
                    if(err) {
                        reject(err)
                    } else if (response.statusCode === 200) {
                        try {
                            body = JSON.parse(body)
                            cache.put('ticket', body.ticket, body.expires_in * 1000)
                            resolve(body.ticket)
                        } catch(err) {
                            reject('检查获取accessToken接口')
                        }
                        
                    } else {
                        // 判断错误状态码 进行返回
                    }
                    
                })
            })
            .catch(err => {
                reject(err)
            })
            
        }
    })
}
router.route('/api/oauth')
  .get((req, res, next) => {
    //   console.log(req)
    initAccessToken()
        .then(accessToken => {
            res.send({
                success: true,
                data: accessToken
            })
        })
        .catch(err => {
            res.send({
                success: false,
                data: err
            })
        })


  })

router.route('/api/ticket')
    .get((req, res, next) => {
        initTicket()
            .then(ticket => {
                res.send({
                    success: true,
                    data: ticket
                })
            })
            .catch(err => {
                res.send({
                    success: false,
                    data: err
                })
            })
    })

router.route('/api/signature')
    .get((req, res) => {
        const { ticket, url } = req.query
        const ret = sign(ticket, url)
        res.send({
            success: true,
            data: ret
        })
    })

    
module.exports = router
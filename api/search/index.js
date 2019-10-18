const express = require('express')
const router = express.Router()
const request = require("request")

const search = (data) => {
    return new Promise((resolve, reject) => {
        // console.log(data)
        request({
            url: `http://192.173.1.70/robot/search`,
            method: 'POST',
            body: JSON.stringify(data)
        }, (err, response, body) => {
            if(err) {
                reject(err)
            } else if (response.statusCode === 200) {
                try {
                    try {
                        body = JSON.parse(body)
                    } catch(err) {
                        console.log('/api/search返回的是非JSON内容')
                    }
                    resolve(body)
                } catch(err) {
                    reject('检查search接口')
                }
                
            } else {
                // 判断错误状态码 进行返回
            }
            
        })
    })
}


router.route('/api/search')
  .post((req, res, next) => {
    //   console.log(req)
    // console.log(req.body)
    search(req.body)
        .then(body => {
            res.send({
                success: true,
                data: body
            })
        })
        .catch(err => {
            res.send({
                success: false,
                data: err
            })
        })


  })

    
module.exports = router

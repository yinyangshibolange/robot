// const chartdata = require('./chartdata')
// const login = require('./login')
// const menu = require('./menu')
// const pages = require('./pages')
// const commoninf = require('./commoninf')
// const dict = require('./dict')
// const label = require('./label')
// // const {postfile} = require('./upload')
// const { usertype } = require("./util/user")
// const menumodel = require("./menumodel")
// const httpupload = require("./httpupload")
// const reportupload = require("./reportupload")
// const noverify = require("./noverify")
const oauth = require('./oauth')
const search = require('./search')
module.exports = (app) => {
    /*非登录的路由使用此中间件*/
    // app.use(/^\/api.*$/, function(req, res, next) {
    //     // console.log(req.cookies)
    //     if(typeof req.cookies !== 'undefined'){
    //         if (!("user" in req.cookies)) {
    //             //res.redirect('/login')
    //             res.status(403).send({
    //                 success:false,
    //                 message:'未登录'
    //             })
    //         } else {
    //             req.body.userInfo = {
    //                 username: req.cookies.user.username,
    //                 password: req.cookies.user.password,
    //                 usertype: req.cookies.user.usertype
    //             }
    //             //console.log(req.body.userInfo)
    //             next()
    //         }
    //     }else{
    //         res.status(403).send('未登录')
    //     }
    // })
    // app.use(chartdata)
    // app.use(login)
    // app.use(menu)
    // app.use(pages)
    // app.use(commoninf)
    // app.use(dict)
    // app.use(label)
    //app.use(getfile)
    // app.use(postfile)
    // app.use(menumodel)
    // app.use(httpupload)

    // app.use(reportupload)

    // app.use(noverify)
    app.use(oauth)
    app.use(search)
}
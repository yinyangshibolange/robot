const login = {
    /**
     * res : response
     * user : userInfo
     * remember : isRemembered
     * commonconfig : cookie config
     */
    login: function (res, user, remember, commonconfig) {
        let path = "/login"
        var rememberconfig = { path: path }
        if ("maxAge" in commonconfig) {
            rememberconfig.maxAge = commonconfig.maxAge
        }
        res.cookie("user", {
            username: user.USERID,
            password: user.PASSWORD,
            usertype: user.USERTYPE
        }, commonconfig)
        res.cookie("loginstauts", { logged: true }, commonconfig)
        res.cookie("remember", { ischecked: remember }, rememberconfig)
    },
    exitlogin: function (res) {
        let path = "/login"
        var rememberconfig = { path: path }
        res.cookie("user", {})
        res.cookie("loginstauts", {})
        res.cookie("remember", {}, rememberconfig)
    }
}

module.exports = login
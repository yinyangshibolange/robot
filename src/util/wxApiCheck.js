export default (apiList) => {
    return new Promise((resolve, reject) => {
        wx.checkJsApi({
            jsApiList: apiList, // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function(res) {
                console.log(res)
                resolve(res)
            },
            fail: function(err) {
                reject(err)
            }
            
          });
    })
}
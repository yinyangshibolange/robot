import Axios from "axios"

// export const getFirstFloor = (dad009, dad008) => {
//     return new Promise((resolve, reject) => {
//         Axios.get('/static/data/mock.json')
//         .then(res => {
//             resolve(res.data.filter(item => item.DAD009 === '1'))
//         })
//         .catch(err => {
//             reject(err)
//         })
//     })
// }

// export const getDataList = (dad009, dad008) => {
//     return new Promise((resolve, reject) => {
//         Axios.get('/static/data/mock.json')
//         .then(res => {
//             resolve(res.data.filter(item => item.DAD009 == dad009 && (dad008 ? item.DAD010 == dad008 : true) ))
//         })
//         .catch(err => {
//             reject(err)
//         })
//     })
// }
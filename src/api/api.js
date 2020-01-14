/*
 * @Author: your name
 * @Date: 2020-01-14 09:43:42
 * @LastEditTime : 2020-01-14 16:14:40
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vuxproject\src\api\api.js
 */
// apis/index.js
// 把所有api的url统一在一起并挂在到vue对象上
// 所有接口都在一个文件里会比较大
// 可以按功能模块分组编写 http://www.100xsys.cn/xxxxxx/wx/authorize
let remoteAddress = {
  ssourl: 'http://www.100xsys.cn', // 微信登陆sso 端口
  ssoAddress: 'http://sso.100xsys.cn',
  serviceAddress: 'http://srvms.100xsys.cn',
  assetsUrl: 'http://139.129.128.155',
  testUrl: 'http://jk.100xsys.cn/',
  authAddress: 'http://srvms.100xsys.cn' // 获取公众页面授权地址
  // ssoAddress: 'http://192.168.0.160:8060',
  // serviceAddress: 'http://192.168.0.196:9999',
  // assetsUrl: 'http://192.168.0.196'
}
let ENV = {
  backUrl: remoteAddress.ssourl,   // 授权域名
  serverURL: remoteAddress.serviceAddress + '/mvpages',   // 后台地址
  refuseCode: '0111',   // 后台拒绝识别码
  byCode: '1111',   // 后台通过码
  byState: 'SUCCESS',   // 状态码
  srvHost: remoteAddress.serviceAddress,
  bindLogin: 'bind_login',   // 授权成功,请登录绑定账号
  authorizedLoginSuccess: 'authorized_login_success', // 授权成功,可以直接请求业务数据
  ssoAuthor: remoteAddress.serviceAddress + '/wx/operate/', // sso授权地址
  savewxuser: remoteAddress.ssoAddress + '/wx/savewxuser', // sso保存微信用户

  // http://srvms.100xsys.cn/wx/operate/srvwx_public_page_authorization
  // savewxuser: remoteAddress.authAddress + '/wx/operate/srvwx_public_page_authorization', // sso保存微信用户

  getOpendId: remoteAddress.ssoAddress + '/wx/getOpendId', // sso保存微信用户 /wx/getOpendId
  getSignature: remoteAddress.ssoAddress + '/wx/getSignature', // sso保存微信用户 /wx/getSignature ,
  // 测试地址
  testssoAuthor: remoteAddress.testUrl + '/wx/authorize', // sso授权地址
  testsavewxuser: remoteAddress.testUrl + '/wx/savewxuser', // sso保存微信用户
  testgetOpendId: remoteAddress.testUrl + '/wx/getOpendId', // sso保存微信用户 /wx/getOpendId
  testgetSignature: remoteAddress.testUrl + '/wx/getSignature', // sso保存微信用户 /wx/getSignature ,
  untied: remoteAddress.ssoAddress + '/wx/untied', // 微信解绑 http://Ip:port/wx/untied
  loginAuthor: remoteAddress.ssoAddress + '/bindlogin', // 微信绑定登录地址http://Ip:port/bindlogin
  getImg: remoteAddress.assetsUrl + '/main/',  // 图片地址
  downloadImg: remoteAddress.serviceAddress + '/download?filePath=',  // 图片地址
  getFilePath: remoteAddress.serviceAddress + '/download?filePath=',  // 文件路径地址
  select: remoteAddress.serviceAddress + '/bxsys/select',  // 查询接口
  toLogin: remoteAddress.ssoAddress + '/bxsyslogin',  // 用户相关接口
  getUserInfo: remoteAddress.ssoAddress + '/getUserInfo', // 用户信息
  selectByUser: remoteAddress.serviceAddress + '/bxsys/srvms.100xsys.cn', // 用户菜单
  selectOne: remoteAddress.serviceAddress + '/bxsys/selectOne', // 产品相关接口
  startProc: remoteAddress.serviceAddress + '/bxsys/startProc', // 流程开启
  approval: remoteAddress.serviceAddress + '/bxsys/approval', // 流程开启
  startDataProc: remoteAddress.serviceAddress + '/bxsys/startDataProc', // 流程子开启
  // add: remoteAddress.serviceAddress + '/bxsys/add', // 新增
  add: remoteAddress.serviceAddress + '/bxsys/operate', // 新增
  update: remoteAddress.serviceAddress + '/bxsys/operate', // 修改
  delete: remoteAddress.serviceAddress + '/bxsys/operate', // 删除
  saveDraft: remoteAddress.serviceAddress + '/bxsys/saveDraft', // 保存草稿
  upload: remoteAddress.serviceAddress + '/upload'
}
export default ENV

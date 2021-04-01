/* 
  包含n个日期处理的工具函数模块
*/

const formatTime = (date) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')
  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':')
}

/* const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n
}
 */
export default formatTime;
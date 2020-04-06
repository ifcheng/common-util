function local(key, val) {
  if (val === void 0) {
    let res = localStorage.getItem(key)
    try {
      res = JSON.parse(res).value
    } catch (e) {}
    return res
  }
  typeof val === 'string' || (val = JSON.stringify({ value: val }))
  localStorage.setItem(key, val)
}

local.remove = key => {
  if (Array.isArray(key)) {
    key.forEach(item => localStorage.removeItem(item))
  } else {
    localStorage.removeItem(key)
  }
}
local.clear = () => localStorage.clear()

function session(key, val) {
  if (val === void 0) {
    let res = sessionStorage.getItem(key)
    try {
      res = JSON.parse(res).value
    } catch (e) {}
    return res
  }
  typeof val === 'string' || (val = JSON.stringify({ value: val }))
  sessionStorage.setItem(key, val)
}

session.remove = key => {
  if (Array.isArray(key)) {
    key.forEach(item => sessionStorage.removeItem(item))
  } else {
    sessionStorage.removeItem(key)
  }
}
session.clear = () => sessionStorage.clear()

export { local, session }

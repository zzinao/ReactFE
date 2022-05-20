// REDUX-ACTION & IMMER
import { createAction, handleActions } from 'redux-actions'
import { produce } from 'immer'

//Axios
import axios from 'axios'
import { Api } from '../../shared/api'

// const BASE_URL = 'https://nhseung.shop'
const BASE_URL = 'https://sparta-dongsun.shop'

//Action
const LOG_IN = 'LOG_IN'
const LOG_OUT = 'LOG_OUT'
const SIGN_UP = 'SIGN_UP'
const SET_USER = 'SET_USER'
const GET_FRIEND = 'GET_FRIEND'
const ADD_FRIEND = 'ADD_FRIEND'
const DELETE_FRIEND = 'DELETE_FRIEND'
//Action Creators
const logIn = createAction(LOG_IN, (token, user) => ({ token, user }))
const signUp = createAction(SIGN_UP, (user) => ({ user }))
const logOut = createAction(LOG_OUT, (user) => ({ user }))
const setUser = createAction(SET_USER, (user) => ({ user }))
const getFriend = createAction(GET_FRIEND, (list) => ({ list }))
const addFriend = createAction(ADD_FRIEND, (list) => ({ list }))
const deleteFriend = createAction(DELETE_FRIEND, (list) => ({ list }))

//initialState
const initialState = {
  user: null,
  is_login: false,
  friendList: null,
}

//Middle Wares

const loginDB = (dic) => {
  const { id: userId, pw: userPw } = dic
  return async function (dispatch, getState, { history }) {
    await axios
      .post(`${BASE_URL}/user/login`, JSON.stringify({ userId, userPw }), {
        headers: { 'Content-Type': `application/json` },
      })
      .then((res) => {
        console.log(res)
        if (res.data.token) {
          const accessToken = res.data.token
          const userId = res.data.userId

          localStorage.setItem('token', accessToken)
          localStorage.setItem('userId', userId)
          dispatch(logIn(accessToken, userId))
          history.replace('./')
        }
      })
      .catch((err) => {
        window.alert('아이디나 비밀번호를 확인해주세요!')
        console.log('errrrrr', err)
      })
  }
}

const signupDB = (dic) => {
  const {
    id: userId,
    email: email,
    nick: userNick,
    pw: userPw,
    pwCheck: userPwCheck,
  } = dic
  return async function (dispatch, getState, { history }) {
    await axios
      .post(
        `${BASE_URL}/user/register`,
        JSON.stringify({
          userId,
          email,
          userPw,
          userPwCheck,
          userNick,
        }),
        {
          headers: { 'Content-Type': `application/json` },
        },
      )
      .then((res) => {
        console.log(res.data)
        dispatch(signUp())
        history.replace('/login')
      })
      .catch((err) => {
        window.alert('이미 가입된 아이디,닉네임 또는 이메일 입니다.')
        console.log('errrrrr', err)
      })
  }
}

const idCheck = (id) => {
  console.log(id)
  return async function (dispatch, useState, { history }) {
    await axios
      .post(
        `${BASE_URL}/user/idCheck`,
        JSON.stringify({
          idCheck: id,
        }),
        {
          headers: { 'Content-Type': `application/json` },
        },
      )
      .then((res) => {
        console.log(res)
        window.alert('사용할 수 있는 아이디입니다!')
      })
      .catch((err) => {
        window.alert('이미 사용중인 아이디입니다!')
      })
  }
}

const emailCheck = (email) => {
  console.log(email)
  return async function (dispatch, useState, { history }) {
    await axios
      .post(
        `${BASE_URL}/user/emailCheck`,
        JSON.stringify({
          emailCheck: email,
        }),
        {
          headers: { 'Content-Type': `application/json` },
        },
      )
      .then((res) => {
        console.log(res)
        window.alert('사용할 수 있는 이메일입니다!')
      })
      .catch((err) => {
        window.alert('이미 사용중인 이메일입니다!')
      })
  }
}

const nickCheck = (nick) => {
  console.log(nick)
  return async function (dispatch, useState, { history }) {
    await axios
      .post(
        `${BASE_URL}/user/userNickCheck`,
        JSON.stringify({
          userNickCheck: nick,
        }),
        {
          headers: { 'Content-Type': `application/json` },
        },
      )
      .then((res) => {
        console.log(res)
        window.alert('사용할 수 있는 닉네임입니다!')
      })
      .catch((err) => {
        window.alert('이미 사용중인 닉네임입니다!')
      })
  }
}

const isLoginDB = () => {
  console.log(localStorage.getItem('token'))
  return async function (dispatch, getState, { history }) {
    await axios({
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'get',
      url: `${BASE_URL}/user/loginCheck`,
    })
      .then((res) => {
        console.log(res)
        localStorage.setItem('userId', res.data.userId)
        localStorage.setItem('userNick', res.data.userNick)
        dispatch(
          setUser({
            userId: res.data.userId,
            userNick: res.data.userNick,
          }),
        )
      })
      .catch((err) => {
        console.log('errrr', err)
      })
  }
}

const findPwDB = (dic) => {
  const { email: email, id: userId } = dic
  return async function (dispatch, getState, { history }) {
    await axios
      .post(
        `${BASE_URL}/user/findPw`,
        JSON.stringify({
          email,
          userId,
        }),
        {
          headers: { 'Content-Type': `application/json` },
        },
      )
      .then((res) => {
        console.log(res)
        alert('메일로 새 비밀번호가 전송되었습니다!')
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
}

const changePwDB = (dic) => {
  const {
    email: email,
    id: userId,
    getpw: password,
    newPw: newPw,
    newPwCheck: newPwCheck,
  } = dic
  return async function (dispatch, getState, { history }) {
    await axios
      .post(
        `${BASE_URL}/user/changePw`,
        JSON.stringify({
          email,
          userId,
          password,
          newPw,
          newPwCheck,
        }),
        {
          headers: { 'Content-Type': `application/json` },
        },
      )
      .then((res) => {
        console.log(res)
        alert('비밀번호가 변경되었습니다!')
        history.push('/login')
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
}

//naver Login
const naverLogin = (code, state) => {
  console.log(code, state)
  return async function (dispatch, getState, { history }) {
    await axios
      .get(`${BASE_URL}/naverLogin/main?code=${code}&state=${state}`)
      .then((res) => {
        console.log(res.data)
        const userId = res.data.naverId
        const userNick = res.data.naverNick
        const accessToken = res.data.token
        localStorage.setItem('token', accessToken)
        localStorage.setItem('userId', userId)
        localStorage.setItem('userNick', userNick)
        dispatch(logIn(accessToken, userId, userNick))
        history.push('/')
      })
      .catch((err) => {
        console.log('errr', err)
      })
  }
}

//naver Login
const naverDB = () => {
  return async function (dispatch, getState, { history }) {
    await axios
      .get(`https://cors-anywhere.herokuapp.com/${BASE_URL}/naverLogin`)
      .then((res) => {
        console.log(res.data)
        const userId = res.data.naverId
        const userNick = res.data.naverNick
        const accessToken = res.data.token
        localStorage.setItem('token', accessToken)
        localStorage.setItem('userId', userId)
        localStorage.setItem('userNick', userNick)
        dispatch(logIn(accessToken, userId, userNick))
        history.push('/')
      })
      .catch((err) => {
        console.log('errr', err)
      })
  }
}

// const userData = await axios.get('https://openapi.naver.com/v1/nid/me', {
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// })

//naver Login2
// const naverLogin = (token) => {
//   console.log(token)
//   return async function (dispatch, getState, { history }) {
//     await axios({
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       method: 'get',
//       url: `${BASE_URL}/naverLogin`,
//     }).then((res) => {
//       console.log(res)
//     })
//   }
// }

//kakao login
const kakaoLogin = (code) => {
  console.log(code)
  return async function (dispatch, getState, { history }) {
    await axios
      .get(`${BASE_URL}/main?code=${code}`)
      .then((res) => {
        console.log(res.data)
        const accessToken = res.data.token
        const userId = res.data.userId
        const userNick = res.data.userNick

        localStorage.setItem('token', accessToken)
        localStorage.setItem('userId', userId)
        localStorage.setItem('userNick', userNick)
        dispatch(logIn(accessToken, userId, userNick))
        history.push('/')
      })
      .catch((err) => {
        console.log('에러에러', err)
      })
  }
}

const logOutDB = (user) => {
  return async function (dispatch, getState, { history }) {
    localStorage.removeItem('token', 'userId')
    dispatch(logOut(user))
    alert('로그아웃 되었습니다')
    history.replace('/login')
  }
}
const addFriendDB = (friendUserId) => {
  console.log(friendUserId)
  return async function (dispatch, getState, { history }) {
    await axios
      .post(
        `${BASE_URL}/user/friendAdd`,
        JSON.stringify({
          friendUserId,
        }),
        {
          headers: {
            'Content-Type': `application/json`,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      .then((res) => {
        console.log(res)
        if (res.data.msg == '친구추가 완료') {
          dispatch(addFriend({ userId: friendUserId }))
          window.alert('친구 등록 완료!')
        } else {
          window.alert('친구가 없습니다!')
          return
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
}

const getFriendDB = () => {
  return async function (dispatch, getState, { history }) {
    await axios({
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      method: 'post',
      url: `${BASE_URL}/user/friendList`,
    })
      .then((res) => {
        let list = res.data.friendList
        console.log(list)
        dispatch(getFriend(list))
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
}

const deleteFriendDB = (id) => {
  return async function (dispatch, useState, { history }) {
    await axios
      .post(
        `${BASE_URL}/user/friendRemove`,
        JSON.stringify({
          removeUserId: id,
        }),
        {
          headers: {
            'Content-Type': `application/json`,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      .then((res) => {
        console.log(res)
        dispatch(deleteFriend(id))
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
}
export default handleActions(
  {
    [LOG_IN]: (state, action) =>
      produce(state, (draft) => {
        draft.userId = action.payload.userId
        draft.token = action.payload.token
        draft.is_login = true
      }),
    [SIGN_UP]: (state, action) => produce(state, (draft) => {}),

    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        draft.user = action.payload.user
        draft.is_login = true
      }),
    [LOG_OUT]: (state, action) =>
      produce(state, (draft) => {
        localStorage.clear()
        draft.is_login = false
        draft.user = null
      }),
    [GET_FRIEND]: (state, action) =>
      produce(state, (draft) => {
        draft.friendList = action.payload.list
      }),
    [ADD_FRIEND]: (state, action) =>
      produce(state, (draft) => {
        draft.friendList.push(action.payload.list)
      }),
    [DELETE_FRIEND]: (state, action) =>
      produce(state, (draft) => {
        let list = draft.friendList.filter(
          (e) => e.userId !== action.payload.list,
        )
        draft.friendList = [...list]
      }),
  },
  initialState,
)

const actionCreators = {
  kakaoLogin,
  naverLogin,
  loginDB,
  signupDB,
  isLoginDB,
  logOutDB,
  findPwDB,
  changePwDB,
  getFriendDB,
  addFriendDB,
  idCheck,
  emailCheck,
  nickCheck,
  deleteFriendDB,
  naverDB,
}
export { actionCreators }

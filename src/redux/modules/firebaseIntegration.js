import { createConstants, createReducer } from 'redux-module-builder'
import * as firebase from 'firebase'
require('firebase/firestore')
import { firebaseConfig } from '../../js'

const types = createConstants('FIREBASE_INTEGRATION')(
  'INIT', 'SIGNIN', 'PUT', 'FETCH', 'AUTH_VALIDATION',
  'DELETE', 'FETCH_REALTIME'
)

export const reducers = createReducer({
  [types.INIT]: (state, action) => ({ ...state, initialized: action.initialized, error: action.error }),
  [types.SIGNIN]: (state, action) => (
    {
      ...state,
      signedIn: action.initialized,
      user: action.user,
      firebaseLoading: action.loading
    }
  ),
  [types.PUT]: (state, action) => (
    {
      ...state,
      firebaseLoading: action.loading,
      putsuccess: action.putsuccess,
      error: action.error
    }
  ),
  [types.DELETE]: (state, action) => (
    {
      ...state,
      firebaseLoading: action.loading,
      successdelete: action.successdelete,
      error: action.error
    }
  ),
  [types.FETCH]: (state, action) => (
    {
      ...state,
      firebaseLoading: action.loading,
      successfetch: action.successfetch,
      error: action.error
    }
  ),
  [types.FETCH_REALTIME]: (state, action) => (
    {
      ...state,
      realTimeData: action.realTimeData,
      successrtfetch: action.successrtfetch,
      error: action.error
    }
  ),
  [types.AUTH_VALIDATION]: (state, action) => (
    {
      ...state,
      signedIn: action.signedIn,
      firebaseLoading: action.loading,
      user: action.user,
    }
  ),
})

export const actions = {
  init: () => (dispatch) => {
    try {
      firebase.initializeApp(firebaseConfig())
      firebase.auth().useDeviceLanguage()
      dispatch({ type: types.INIT, initialized: true, error: null })
      return true
    } catch (e) {
      dispatch({ type: types.INIT, initialized: false, error: e })
      return false
    }
  },
  execSignInPopup: (mod) => (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: types.SIGNIN, signedIn: false, user: null, loading: true })
      firebase.auth()
        .signInWithPopup(mod == process.env.FLAG_GOOGLE_SIGNIN ? firebaseGoogleProvider() : firebaseFacebookProvider())
        .then(result => {
          dispatch({ type: types.SIGNIN, signedIn: true, user: result.user, loading: false })
          resolve(result.user)
        }).catch(error => {
          dispatch({ type: types.SIGNIN, signedIn: false, user: null, loading: false })
          reject(error)
        })
    })
  },
  onAuthStateChanged: (cb) => (dispatch) => {
    dispatch({ type: types.AUTH_VALIDATION, signedIn: false, loading: true, user: null })
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, email } = user
        user.path = `users/${email}`
        dispatch({ type: types.AUTH_VALIDATION, signedIn: true, loading: false, user: { displayName, photoURL, email } })
        if (cb) cb(user)
      } else {
        dispatch({ type: types.AUTH_VALIDATION, signedIn: false, loading: false, user: null })
        if (cb) cb(null)
      }
    })
  },
  putDocument: (path, record) => (dispatch) => {
    dispatch({ type: types.PUT, loading: true, putsuccess: false, error: null })
    return new Promise((resolve, reject) => {
      console.log(record)
      docRef(path).set(record)
        .then(data => {
          dispatch({ type: types.PUT, loading: false, putsuccess: true, error: null })
          resolve(data)
        })
        .catch(err => {
          dispatch({ type: types.PUT, loading: false, putsuccess: false, error: err })
          reject(err)
        })
    })
  },
  putCollection: (path, record) => (dispatch) => {
    dispatch({ type: types.PUT, loading: true, putsuccess: false, error: null })
    return new Promise((resolve, reject) => {
      console.log(record)
      colRef(path).set(record)
        .then(data => {
          dispatch({ type: types.PUT, loading: false, putsuccess: true, error: null })
          resolve(data)
        })
        .catch(err => {
          dispatch({ type: types.PUT, loading: false, putsuccess: false, error: err })
          reject(err)
        })
    })
  },
  deleteDataRequest: (path) => (dispatch) => {
    dispatch({ type: types.DELETE, loading: true, successdelete: false, error: null })
    return new Promise((resolve, reject) => {
      docRef(path).delete()
        .then(data => {
          dispatch({ type: types.DELETE, loading: false, successdelete: true, error: null })
          resolve(data)
        })
        .catch(err => {
          dispatch({ type: types.DELETE, loading: false, successdelete: false, error: err })
          reject(err)
        })
    })
  },
  fetchDocuments: (path) => (dispatch) => {
    dispatch({ type: types.FETCH, loading: true, successfetch: false, error: null })
    return new Promise((resolve, reject) => {
      docRef(path).get()
        .then(doc => {
          if (doc && doc.exists) {
            dispatch({ type: types.FETCH, loading: false, successfetch: true, error: null })
            resolve(doc.data())
          }
        })
        .catch(err => {
          dispatch({ type: types.FETCH, loading: false, successfetch: false, error: err })
          reject(err)
        })
    })
  },
  fetchCollections: (path) => (dispatch) => {
    dispatch({ type: types.FETCH, loading: true, successfetch: false, error: null })
    return new Promise((resolve, reject) => {
      colRef(path).get()
        .then(result => {
          const finalResp = result.docs.map(item => ({ ...item.data() }))
          dispatch({
            type: types.FETCH, successfetch: (result.size > 0),
            error: (result.size > 0 ? null : 'No result')
          })
          resolve(result.size > 0 ? finalResp : null)
        })
        .catch(err => {
          dispatch({ type: types.FETCH, loading: false, successfetch: false, error: err })
          reject(err)
        })
    })
  },
  fetchRelCollections: (path, field, op, val) => (dispatch) => {
    dispatch({ type: types.FETCH, loading: true, successfetch: false, error: null })
    return new Promise((resolve, reject) => {
      colRef(path).where(field, op, val).get()
        .then(result => {
          const finalResp = result.docs.map(item => ({ ...item.data() }))
          dispatch({
            type: types.FETCH, successfetch: (result.docs.length > 0),
            error: (result.docs.length > 0 ? null : 'No result'), relatedData: (result.docs.length > 0 ? finalResp : null)
          })
          resolve(result.docs.length > 0 ? finalResp : null)
        })
        .catch(err => {
          dispatch({ type: types.FETCH, loading: false, successfetch: false, error: err })
          reject(err)
        })
    })
  },
  fetchRelDocuments: (path, field, op, val) => (dispatch) => {
    dispatch({ type: types.FETCH, loading: true, successfetch: false, error: null })
    return new Promise((resolve, reject) => {
      docRef(path).where(field, op, val).get()
        .then(doc => {
          if (doc && doc.exists) {
            dispatch({ type: types.FETCH, loading: false, successfetch: true, error: null, relatedData: doc.data() })
            resolve(doc.data())
          }
        })
        .catch(err => {
          dispatch({ type: types.FETCH, loading: false, successfetch: false, error: err })
          reject(err)
        })
    })
  },
  fetchRTCollection: (path) => (dispatch) => {
    dispatch({ type: types.FETCH_REALTIME, successrtfetch: false })
    return new Promise((resolve, reject) => {
      colRef(path).onSnapshot(result => {
        const finalResp = result.docs.map(item => ({ id: item.id, data: { ...item.data() } }))
        console.log(finalResp)
        dispatch({
          type: types.FETCH_REALTIME, successrtfetch: (result.docs.length > 0),
          error: (result.docs.length > 0 ? null : 'No result'), realTimeData: (result.docs.length > 0 ? finalResp : null)
        })
        if (result.docs.length > 0) resolve(true)
        else reject('No result')
      })
    })
  },
  fetchRTDocuments: (path) => (dispatch) => {
    dispatch({ type: types.FETCH_REALTIME, successrtfetch: false })
    return new Promise((resolve, reject) => {
      docRef(path).onSnapshot(doc => {
        if (doc && doc.exists) {
          dispatch({ type: types.FETCH_REALTIME, loading: false, successfetch: true, error: null })
          resolve(doc.data())
        } else { reject('No result') }
      })
    })
  },
}

const fireStore = () => firebase.firestore() // creates a new firestore instance

const docRef = (path) => fireStore().doc(path) // creates a new document reference

const colRef = (path) => fireStore().collection(path) // creates a new collection reference

const firebaseGoogleProvider = () => { // firebase provider for google sign in
  const provider = new firebase.auth.GoogleAuthProvider()
  provider.addScope(process.env.GOOGLE_SCOPE_URL)
  return provider
}
const firebaseFacebookProvider = () => { // firebase provider for facebook login
  const provider = new firebase.auth.FacebookAuthProvider()
  provider.addScope('public_profile')
  return provider
}

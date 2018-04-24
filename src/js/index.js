import { pipe, Observable } from 'rxjs/Rx'
import uuid from 'uuid/v1'

export const generateUniqid = () => uuid()

export const initialState = () => ({
  initialState: {
    firebaseIntegration: {
      signedIn: false,
      initialized: false,
      firebaseLoading: false,
      putsuccess: false,
      successfetch: false,
      successrtfetch: false,
      successdelete: false,
      realTimeData: null,
      relatedData: null,
      user: null,
      token: null,
      error: null,
    },
  }
})

export const firebaseConfig = () => ({
  apiKey: "AIzaSyDlGL_KNedpxYgvZKM8vVR1zHv51ysScuU",
  authDomain: "sess-io.firebaseapp.com",
  databaseURL: "https://sess-io.firebaseio.com",
  projectId: "sess-io",
  storageBucket: "sess-io.appspot.com",
  messagingSenderId: "145103145697"
})

import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp(
    {
      apiKey: "AIzaSyAAnDwlXiCP1iY7YkfkG7JZb_5wJxDmIiw",
      authDomain: "liketwitterpj.firebaseapp.com",
      projectId: "liketwitterpj",
      storageBucket: "liketwitterpj.appspot.com",
      messagingSenderId: "415565645444",
      appId: "1:415565645444:web:5afcc5ae2f8e92e6ada4d1",
      measurementId: "G-DQ98240E6H"
    }
  )
}

export default firebase
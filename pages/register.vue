<template>
  <div class="register flex-column">
    <AuthHeader/>
    <div class="accountform flex-column">
      <p class="accountform__title">新規登録</p>
      <validation-observer ref="obs" v-slot="ObserverProps" class="accountform__forms flex-column">
        <validation-provider v-slot="ProviderProps" rules="required|max:20" class="accountform__formwrapper">
          <div class="error">{{ ProviderProps.errors[0] }}</div>
          <input v-model="accountName" type="text" name="ユーザーネーム" placeholder="ユーザーネーム" class="accountform__form"/>
        </validation-provider>
        <validation-provider v-slot="ProviderProps" rules="required|email" class="accountform__formwrapper">
          <div class="error">{{ ProviderProps.errors[0] }}</div>
          <input v-model="email" type="email" name="メールアドレス" placeholder="メールアドレス" class="accountform__form"/>
        </validation-provider>
        <validation-provider v-slot="ProviderProps" rules="required|min:6" class="accountform__formwrapper">
          <div class="error">{{ ProviderProps.errors[0] }}</div>
          <input v-model="password" type="password" name="パスワード" placeholder="パスワード" class="accountform__form"/>
        </validation-provider>
        <button
          @click="register" class="accountform__button" type="button"
          :disabled="ObserverProps.invalid || !ObserverProps.validated"
        >
          新規登録
        </button>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import AuthHeader from '../components/AuthHeader'
import firebase from '~/plugins/firebase'
export default {
  components: {
    AuthHeader,
  },
  data() {
    return {
      accountName: "",
      email: null,
      password: null,
    }
  },
  methods: {
    register() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((data) => {
          data.user.sendEmailVerification().then(() => {
            firebase.auth().onAuthStateChanged((user) => {
              if (user) {
                var uid = user.uid;
                this.$router.push({ path: '/registerAction' , query :{ name: this.accountName, uid: uid }});
              } else {
                // User is signed out
                // ...
              }
            });
          })
        })
        .catch((error) => {
          switch (error.code) {
            case 'auth/invalid-email':
              alert('メールアドレスの形式が違います。')
              break
            case 'auth/email-already-in-use':
              alert('このメールアドレスはすでに使われています。')
              break
            case 'auth/weak-password':
              alert('パスワードは6文字以上で入力してください。')
              break
            default:
              alert('エラーが起きました。しばらくしてから再度お試しください。')
              break
          }
        })
    },
  },
}
</script>
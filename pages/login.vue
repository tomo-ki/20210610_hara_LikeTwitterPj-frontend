<template>
  <div class="login flex-column">
    <AuthHeader/>
    <div class="accountform flex-column">
      <p class="accountform__title">ログイン</p>
      <validation-observer ref="obs" v-slot="ObserverProps" class="accountform__forms flex-column">
        <validation-provider v-slot="ProviderProps" rules="required|email" class="accountform__formwrapper">
          <div class="error">{{ ProviderProps.errors[0] }}</div>
          <input v-model="email" type="email" name="メールアドレス" placeholder="メールアドレス" class="accountform__form"/>
        </validation-provider>
        <validation-provider v-slot="ProviderProps" rules="required|min:6" class="accountform__formwrapper">
          <div class="error">{{ ProviderProps.errors[0] }}</div>
          <input v-model="password" type="password" name="パスワード" placeholder="パスワード" class="accountform__form"/>
        </validation-provider>
        <button
          @click="login" class="accountform__button" type="button"
          :disabled="ObserverProps.invalid || !ObserverProps.validated"
        >
          ログイン
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
      email: null,
      password: null,
      accountId: "",
    }
  },
  methods: {
    login() {
      if (this.email==null || this.password==null) {
        alert('メールアドレスまたはパスワードが入力されていません。')
        return
      }
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              var uid = user.uid;
              alert('ログインが完了しました')
              this.getAccount(uid);
            } else {
              // User is signed out
              // ...
            }
          });
        })
        .catch((error) => {
          switch (error.code) {
            case 'auth/invalid-email':
              alert('メールアドレスの形式が違います。')
              break
            case 'auth/user-disabled':
              alert('ユーザーが無効になっています。')
              break
            case 'auth/user-not-found':
              alert('ユーザーが存在しません。')
              break
            case 'auth/wrong-password':
              alert('パスワードが間違っております。')
              break
            default:
              alert('エラーが起きました。しばらくしてから再度お試しください。')
              break
          }
        })
    },
    async getAccount(firebaseUid) {
      const resData = await this.$axios.get(
        "http://127.0.0.1:8000/api/account/" + firebaseUid,
      );
      this.accountId =  resData.data.data[0].id;
      this.changePage(this.accountId);
    },
    changePage(accountId) {
      this.$router.push({ path: '/tweet' , query :{ account_id: accountId }});
    }
  },
}
</script>
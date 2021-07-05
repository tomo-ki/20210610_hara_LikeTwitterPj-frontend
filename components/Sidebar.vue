<template>
  <div class="sidebar flex-column">
    <img @click="toHome" src="/images/logo.png" alt="" class="sidebar__logo">
    <button @click="toHome" class="sidebar__logo flex">
      <img src="/images/account_logo.png" alt="" class="sidebar__logo-icon">
      <p class="sidebar__logo-text">{{this.accountName}}</p>
    </button>
    <button @click="toHome" class="sidebar__logo flex">
      <img src="/images/home.png" alt="" class="sidebar__logo-icon">
      <p class="sidebar__logo-text">ホーム</p>
    </button>
    <button @click="logout" class="sidebar__logo flex">
      <img src="/images/logout.png" alt="" class="sidebar__logo-icon">
      <p class="sidebar__logo-text">ログアウト</p>
    </button>
    <validation-observer ref="obs" v-slot="ObserverProps" class="tweet flex-column">
      <validation-provider v-slot="ProviderProps" rules="max:120" class="tweet__formwrapper">
        <label for="tweet">シェア</label>
        <div class="error">
          {{ ProviderProps.errors[0] }}
          </div>
        <textarea name="シェア" id="tweet" v-model="newTweet" class="tweet__textbox"></textarea>
      </validation-provider>
      <div class="tweet__button-wrapper flex">
        <button
          @click="insertTweet" class="button tweet__button" type="button"
          :disabled="ObserverProps.invalid || !ObserverProps.validated"
        >
          シェアする
        </button>
      </div>
    </validation-observer>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'
export default {
  data() {
    return {
      accountId: this.$route.query.account_id,
      newTweet: "",
      tweetLists: [],
      accountName: "",
    };
  },
  methods: {
    getAccountUid() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          var uid = user.uid;
          this.getAccountName(uid);
        }
      })
    },
    async getAccountName(uid) {
      const resData = await this.$axios.get(
        "http://127.0.0.1:8000/api/account/" + uid,
      );
      this.accountName =  resData.data.data[0].name;
    },
    async insertTweet() {
      if(this.newTweet == ""){
        alert('シェアが入力されていません。')
      }else{
        const sendData = {
          account_id: this.accountId,
          content: this.newTweet,
        };
        await this.$axios.post("http://127.0.0.1:8000/api/tweet/", sendData)
        .then(() => alert('シェアが完了しました。'));
        this.newTweet = "";
        this.$emit('getTweet');
      }
    },
    toHome() {
      this.$router.push({ path: '/tweet' , query :{ account_id: this.accountId }});
    },
    logout() {
      firebase.auth().signOut()
      .then(() => {
        alert('ログアウトが完了しました')
        this.$router.replace('/login')
      })
    },
  },
  created() {
    this.getAccountUid();
  }
};
</script>
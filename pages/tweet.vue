<template>
  <div id="tweet" class="tweet flex">
    <Sidebar @getTweet = "getTweet" />
    <table class="tweet__table">
      <tr class="tweet__table-heading">
        <th>ホーム{{this.url}}</th>
      </tr>
      <tr v-for="tweet in tweetLists" :key="tweet.id" class="tweet__content-wrapper">
        <div class="tweet__content-upper">
          <td class="tweet__accountname">{{ tweet.name }}</td>
          <td>
            <button class="tweet__icon">
              <img src="/images/heart.png" alt="" v-if="tweet.isLike == false" @click="likeTweet(tweet.id)" class="tweet__icon-img">
              <img src="/images/heart.png" alt="" v-if="tweet.isLike == true" @click="dislikeTweet(tweet.id)" class="tweet__icon-img liked">
            </button>
          </td>
          <td class="tweet__like">{{ tweet.like }}</td>
          <td>
            <button v-if="tweet.account_id == accountId" class="tweet__icon"><img src="/images/cross.png" alt="" class="tweet__icon-img" @click="deleteTweet(tweet.id)"></button>
            <div v-if="tweet.account_id !== accountId" class="deleteButtonSpace"></div>
          </td>
          <td><button class="tweet__icon  toComment"><img src="/images/detail.png" alt="" class="tweet__icon-img" @click="commentPage( tweet.id )"></button></td>
        </div>
        <div class="tweet__content-bottom">
          <td class="tweet__content">{{ tweet.content }}</td>
        </div>
      </tr>
    </table>
  </div>
</template>


<script>
import Sidebar from "../components/Sidebar.vue"
import firebase from '~/plugins/firebase'
export default {
  components: {
    Sidebar,
  },
  data() {
    return {
      tweetLists: [],
      accountId: this.$route.query.account_id,
    };
  },
  methods: {
    async getTweet() {
      const resData = await this.$axios.get(
        "http://127.0.0.1:8000/api/like/" + this.accountId
      );
      this.tweetLists = resData.data.data;
    },
    async deleteTweet(id) {
      await this.$axios.delete("http://127.0.0.1:8000/api/tweet/" + id)
      .then(() => this.getTweet());
    },
    commentPage( tweet_id ){
      this.$router.push({ path: '/comment' , query :{ account_id: this.accountId, tweet_id: tweet_id }});
    },
    async likeTweet( tweet_id ){
      const sendData = {
        account_id: this.accountId,
        tweet_id: tweet_id,
      };
      await this.$axios.post("http://127.0.0.1:8000/api/like/", sendData)
      .then(() => this.getTweet());
    },
    async dislikeTweet(tweet_id){
      await this.$axios.request({
        method: 'delete',
        url: "http://127.0.0.1:8000/api/like/" + tweet_id,
        data: {account_id: this.accountId},
      }).then(() => this.getTweet());
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.getTweet();
        } else {
          this.$router.push('/login');
        }
      })
  },
};
</script>
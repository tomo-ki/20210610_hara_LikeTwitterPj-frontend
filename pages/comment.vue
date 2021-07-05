<template>
  <div id="tweet" class="tweet flex">
    <Sidebar/>
    <div class="main__content">
      <table class="comment__table">
        <tr class="tweet__table-heading">
          <th>ホーム</th>
        </tr>
        <tr v-for="tweet in tweetLists" :key="tweet.id" class="tweet__content-wrapper">
          <div v-if="tweet.id == tweetId" class="tweet__content-upper">
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
          <div v-if="tweet.id == tweetId" class="tweet__content-bottom">
            <td class="tweet__content">{{ tweet.content }}</td>
          </div>
        </tr>
        <!--  -->
        <tr class="comment__table-heading">
          <th>コメント</th>
        </tr>
        <tr v-for="comment in commentLists" :key="comment.id" class="comment__content-wrapper">
          <div class="comment__accountname">
            <td class="">{{ comment.name }}</td>
          </div>
          <div class="comment__content">
            <td>{{ comment.content }}</td>
          </div>
        </tr>
      </table>
      <validation-observer ref="obs" v-slot="ObserverProps" class="comment flex-column">
        <validation-provider v-slot="ProviderProps" rules="max:120" class="tweet__formwrapper">
          <label for="comment">コメント</label>
          <div class="error">{{ ProviderProps.errors[0] }}</div>
          <textarea name="コメント" id="comment" v-model="newComment" class="comment__textbox"></textarea>
        </validation-provider>
        <div class="comment__button-wrapper flex">
          <button
            @click="insertComment" class="button comment__button" type="button"
            :disabled="ObserverProps.invalid || !ObserverProps.validated"
          >
            コメント
          </button>
        </div>
      </validation-observer>
    </div>
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
      accountId: this.$route.query.account_id,
      tweetId: this.$route.query.tweet_id,
      newComment: "",
      commentLists: [],
      tweetLists: [],
    }
  },
  methods: {
    async getTweet() {
      const resData = await this.$axios.get(
        "http://127.0.0.1:8000/api/like/" + this.accountId
      );
      this.tweetLists = resData.data.data;
      this.getComment();
    },
    async deleteTweet(id) {
      await this.$axios.delete("http://127.0.0.1:8000/api/tweet/" + id)
      .then(() => this.$router.push({ path: '/tweet' , query :{ account_id: this.accountId }}));
    },
    async getComment() {
      const resData = await this.$axios.get(
        "http://127.0.0.1:8000/api/comment/" + this.tweetId,
      );
      this.commentLists = resData.data.data;
    },
    async insertComment() {
      if(this.newComment == ""){
        alert('コメントが入力されていません。')
      }else{
        const sendData = {
          account_id: this.accountId,
          tweet_id: this.tweetId,
          content: this.newComment,
        };
        await this.$axios.post("http://127.0.0.1:8000/api/comment/", sendData)
        .then(() => alert('コメントが完了しました。'));
        this.newComment = "";
        this.getComment();
      }
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
}
</script>

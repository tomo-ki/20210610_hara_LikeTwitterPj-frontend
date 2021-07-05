<script>
import firebase from '~/plugins/firebase'
export default {
  methods: {
    discrimination(){
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          var uid = user.uid;
          alert('ログインが完了しました')
          this.getAccount(uid);
        } else {
          this.$router.push('/login');
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
  created() {
    this.discrimination();
  }
}
</script>
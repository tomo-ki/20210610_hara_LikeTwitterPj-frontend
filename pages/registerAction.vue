<template>
</template>
<script>
import firebase from '~/plugins/firebase'

export default{
  data() {
    return {
      accountName: this.$route.query.name,
      firebaseUid: this.$route.query.uid,
      accountId: "",
    }
  },
  methods: {
    async getAccount() {
      const resData = await this.$axios.get(
        "http://127.0.0.1:8000/api/account/" + this.firebaseUid,
      );
      this.accountId =  resData.data.data[0].id;
      this.changePage();
    },
    async insertAccount() {
      const sendData = {
        name: this.accountName,
        firebase_uid: this.firebaseUid,
      };
      await this.$axios.post("http://127.0.0.1:8000/api/account/", sendData);
      this.getAccount();
    },
    changePage(){
      this.$router.push({ path: '/tweet' , query :{ account_id: this.accountId }});
    },
  },
  created() {
    this.insertAccount();
  }
}
</script>

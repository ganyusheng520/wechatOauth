<template>
  <div>
    <img class="avatar" :src="user.headimgurl">
    <p class="text">{{user.nickname}}签到成功！</p>
  </div>

</template>

<script>
  import Util from '../global/Util'

  export default {
    name: 'success',
    data () {
      return {
        user: {}
      }
    },
    created(){
      this.user.nickname = decodeURIComponent(Util.getCookie('nickname'))
      this.user.headimgurl =Util.getCookie('headimgurl')
    },
    methods: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../style/mixin';
  .avatar {
    display:block;
    margin:px2rem(48px) auto px2rem(24px);
    width:px2rem(72px);
    height:px2rem(72px);
    border-radius:100%;
  }

  .text {
    text-align: center;
    font-size: 18px;
    color: #333;
  }
</style>

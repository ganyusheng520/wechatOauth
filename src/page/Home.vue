<template>
    <button class="btn" @click="oauth">授权</button>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
    }
  },
  methods:{
    oauth() {
      location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx03e310e102aaec78&redirect_uri=http%3a%2f%2fsys.tunnel.qydev.com%2fwechat%2foauth%2fredirect&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../style/mixin';
  .btn {
    @include center;
    width: px2rem(96px);
    height: px2rem(96px);
    border-radius: 100%;
    color: #fff;
    font-size: 24px;
    background-color: #1AAD19;
  }

</style>

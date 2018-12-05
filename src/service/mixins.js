export const goBack = {
  methods: {
    goBack: function () {
      this.$router.go(-1)
    }
  }
}

export const toPlay = {
  methods: {
    toPlay: function (type, id) {
      if (type == 'Mp4') {
        this.$router.push({path: '/playMp4', query: {id}})
      } else if (type == 'JYAicc') {
        this.$router.push({path: '/playJYAicc', query: {id}})
      } else if (type == 'h5') {
        this.$router.push({path: '/playH5', query: {id}})
      }
    }
  }
}

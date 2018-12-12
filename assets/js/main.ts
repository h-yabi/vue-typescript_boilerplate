import Vue from 'vue'

var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    show: true
  },
  methods: {
    change: function () {
      this.show = !this.show
    }
  }
})

let count: number = 123456;
console.log(count)

$(window).on('resize', function () {
  alert('a')
});


var ComponentA = {
  
}
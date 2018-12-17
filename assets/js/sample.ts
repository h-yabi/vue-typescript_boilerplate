class Animal {
  constructor(public type: string) {
    this.type = type;
  }
}

class Cat extends Animal {
  constructor(public name: string) {
    super("Cat");
    this.name = name;
  }
}

var o1 = new Cat("Mii-chan");
console.log(o1.type);        // Cat
console.log(o1.name);        // Mii-chan


class Acoordion {
  constructor(public el: HTMLElement) {
  }
  public fn(): void {
    $(this.el).on('click', function () {
      $(this).next().show();
    });
  }
}

var yabiku = document.getElementById('test');
var sample = new Acoordion(yabiku);
console.log(yabiku)
sample.fn();

// var Acoordion = function (el) {
//   this.el = $(el);
// };
// Acoordion.prototype.fn = function () {
//   var that = this;
//   this.el.on('click', function () {
//     if ($(this).hasClass('active')) {
//       $(this).removeClass('active');
//       $(this).next().hide();
//       $(this).parent().removeClass('active');
//       $('.js-modalBk').css({
//         height: 'auto'
//       }).fadeOut();
//       return false;
//     }
//     $(this).addClass('active');
//     $(this).next().show();
//     $(this).parent().addClass('active');
//     $('.js-modalBk').css({
//       height: '100vh'
//     }).fadeIn();
//   });
// };
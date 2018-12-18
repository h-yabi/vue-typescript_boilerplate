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
  constructor(public el: HTMLCollection) {
  }
  public showHide(): void {
    $(this.el).on('click', function () {
      if ($(this).hasClass('active')) {
        $(this).removeClass('active').next().hide();
        return;
      }
      $(this).addClass('active').next().show();
    });
  }
  public slideDownUp(): void {
    $(this.el).on('click', function () {
      $(this).next().slideToggle();
    });
  }
}

var className = document.getElementsByClassName("test");
var sample = new Acoordion(className);
sample.showHide();

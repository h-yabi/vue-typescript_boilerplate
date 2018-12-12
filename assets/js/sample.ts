// let message: String = '';
// message = "TypeScript World"
// console.log("Hello!" + message);

// let count: number = 123;
// console.log(count)

class User {
  constructor(private _name: string) {
  }

  //ゲッター
  //ゲッターは値を排出します。
  get name() {
    return this._name;
  }

  //セッター
  set name(value: string) {
    this._name = value;
  }
}

var taro = new User("Taro");
console.log(taro.name); //Taroが出力される。
taro.name = "yamada"; //セッターを使ってyamadaを代入。
console.log(taro.name); //yamadaが出力される。



interface Result {
  a: number;
  b: number;
}

//sum(result: Result)と書くことで引数resultは必ずaとb持たなければならない。
function sum(result: Result) {
  return result.a + result.b;
}

var result = {
  a: 80,
  b: 20
};

console.log(sum(result)); //50が出力される。
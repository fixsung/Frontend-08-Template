/*
 * @Author: songyzh
 * @Date: 2021-01-31 21:53:31
 * @LastEditors: songyzh
 * @LastEditTime: 2021-01-31 21:53:32
 */
class Human {
  constructor(name = "NPC", hp = 100) {
    this.name = name;
    this.hp = hp > 100 ? 100 : hp; // 血量
  }

  hurt(damage) {
    this.hp = this.hp - damage;
    console.log(
      `${this.name} 受到了攻击,血量减少 ${damage},剩余血量 ${this.hp}`
    );
  }
}

class Dog {
  constructor(name = "dog", attackPower = 10) {
    this.name = name;
    this.attackPower = attackPower; //攻击力
  }

  bite() {
    console.log(`${this.name} 发起了攻击`);
    return this.attackPower;
  }
}

let player = new Human("玩家", 100);
let dog = new Dog("dog", 10);

player.hurt(dog.bite());

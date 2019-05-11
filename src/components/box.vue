<template>
  <div id="app">
    <v-app id="inspire">
      <v-container fluid>
        <v-layout row>
          <v-flex xs12 sm6 offset-sm3>
            <v-card max-width="450px">
              <v-layout justify-center>
                <table>
                  <tr v-for="(item, key, index) in items" :key="index">
                    <td
                      v-bind:class="[items[key][key2]? 'on':'off',{ 'guide': isActive(key,key2) }]"
                      v-for="(value, key2, index) in item"
                      :key="index"
                      v-on:click="push_button(key,key2)"
                    ><icon-base width="40" height="40"><icon-light /></icon-base></td>
                  </tr>
                </table>
              </v-layout>
              <v-layout justify-center>
                <v-card-title primary-title>
                  <div>
                    <div class="headline">Lights Out</div>
                  </div>
                </v-card-title>
              </v-layout>

              <v-layout justify-center>
                <v-card-actions>
                  <v-btn flat color="red" v-on:click="guide">Answer</v-btn>
                  <v-btn flat v-on:click="shuffle">Shuffle</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn flat @click="show = !show">
                    Rule
                    <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-layout>
              <v-slide-y-transition>
                <v-card-text v-show="show">ライトを押すと自分とその上下左右のライトが一緒に反転します.全てのライトを消してみよう.</v-card-text>
              </v-slide-y-transition>
            </v-card>
          </v-flex>
        </v-layout>
        <v-dialog v-model="dialog" max-width="290">
          <v-card>
            <v-card-title class="headline">Success!</v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="green darken-1" flat="flat" @click="shuffle">Restart</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import IconBase from "./IconBase.vue";
import IconLight from "./icons/IconLight.vue";
export default {
  components: {
    IconBase,
    IconLight
  },
  name: "Box",
  data() {
    return {
      guide_number: 0,
      guide_button_array: [],
      guide_status: false,
      items: [
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true]
      ],
      dialog: false,
      show: false,
      yellow:"yellow"
    };
  },
  mounted: function() {
    this.shuffle();
  },
  methods: {
    init_guide() {
      this.guide_status = false;
      this.guide_number = 0;
      this.guide_button_array = [];
    },
switch_on(y, x) {
  if (this.items[y][x]) {
    //直接値を入力すると変更が検知されないためこんな感じ
    this.$set(this.items[y], x, false);
  } else {
    this.$set(this.items[y], x, true);
  }
},
    isActive(y, x) {
      if (this.guide_status) {
        if (
          this.guide_button_array[this.guide_number][0] == y &&
          this.guide_button_array[this.guide_number][1] == x
        ) {
          return true;
        }
      } else {
        return false;
      }
    },

    guide() {
      this.init_guide();
      this.guide_button_array = this.suggestion();
      if (this.guide_button_array.length > 0) {
        this.guide_status = true;
      }
    },
    arround_change(y, x) {
      if (y > 0) {
        this.switch_on(y - 1, x);
      }
      this.switch_on(y, x);
      if (y + 1 < this.items.length) {
        this.switch_on(y + 1, x);
      }
      if (x > 0) {
        this.switch_on(y, x - 1);
      }
      if (x + 1 < this.items[y].length) {
        this.switch_on(y, x + 1);
      }

      if (!this.judge()) {
        this.$nextTick(() => {
          this.init_guide();
          this.dialog = true;
        });
      }
    },
    push_button(y, x) {
      if (this.isActive(y, x)) {
        this.arround_change(y, x);
        if (this.guide_number < this.guide_button_array.length - 1) {
          this.guide_number = this.guide_number + 1;
        } else {
          this.guide_number = 0;
        }
      } else if (this.guide_status) {
        this.arround_change(y, x);
        this.guide_status = false;
        this.guide_number = 0;
      } else {
        this.arround_change(y, x);
      }
    },

    math_arround_change(now_array, y, x) {
      if (y > 0) {
        now_array[y - 1][x] = !now_array[y - 1][x];
      }
      now_array[y][x] = !now_array[y][x];
      if (y + 1 < now_array.length) {
        now_array[y + 1][x] = !now_array[y + 1][x];
      }
      if (x > 0) {
        now_array[y][x - 1] = !now_array[y][x - 1];
      }
      if (x + 1 < now_array.length) {
        now_array[y][x + 1] = !now_array[y][x + 1];
      }
      return now_array;
    },
shuffle() {
  this.dialog = false;
  this.init_guide();
  let i = 0;
  while (i < 5) {
    let j = 0;
    while (j < 5) {
      if (this.random_marubatsu()) {
        this.arround_change(i, j);
      }
      j = j + 1;
    }
    i = i + 1;
  }
},
random_marubatsu() {
  if (Math.random() >= 0.5) {
    return true;
  } else {
    return false;
  }
},
judge() {
  let judge_array = [];
  for (const i in this.items) {
    // 二次元配列を直列にする
    judge_array = judge_array.concat(this.items[i]);
  }
  // 配列に含まれているかを確認
  if (judge_array.includes(true)) {
    return true;
  } else {
    return false;
  }
},
kumiawase(balls, nukitorisu) {
  let arrs = [];
  let zensu = balls.length;
  if (zensu < nukitorisu) {
    return;
  } else if (nukitorisu == 1) {
    for (let i = 0; i < zensu; i++) {
      arrs[i] = [balls[i]];
    }
  } else {
    for (let i = 0; i < zensu - nukitorisu + 1; i++) {
      let kumis = this.kumiawase(balls.slice(i + 1), nukitorisu - 1);
      for (let j = 0; j < kumis.length; j++) {
        arrs.push([balls[i]].concat(kumis[j]));
      }
    }
  }
  return arrs;
},
    math_judge(result_array) {
      let comb_array = [];
      for (let i in result_array) {
        comb_array = comb_array.concat(result_array[i]);
      }
      if (!comb_array.includes(true)) {
        return true;
      } else {
        return false;
      }
    },
    suggestion() {
      let now_array = this.$lodash.cloneDeep(this.items);
      let suggestion_array = [];

      //1段目の押下するボタンを取得する
      let first_suggestion = this.correct_answer(now_array);

      if (first_suggestion === void 0) {
        console.log("無理ゲー");
        return [];
      } else {
        for (let num in first_suggestion) {
          now_array = this.math_arround_change(
            now_array,
            0,
            first_suggestion[num]
          );
          suggestion_array.push([0, first_suggestion[num]]);
        }

        // 二段目より下をやる;
        // 自分の上の段が光ってたら押下;
        let i = 1;
        while (i < now_array.length) {
          let j = 0;
          while (j < now_array[i].length) {
            if (now_array[i - 1][j]) {
              suggestion_array.push([i, j]);
              now_array = this.math_arround_change(now_array, i, j);
            }
            j = j + 1;
          }
          i = i + 1;
        }
        return suggestion_array;
      }
    },
correct_answer(now_array) {
  let n = 1;
  let front_array_pattern = [];
  let minimum_push_number = -1;
  let minimum_push_order = [];

  //先頭の組み合わせ作成
  while (n <= now_array.length) {
    front_array_pattern = front_array_pattern.concat(
      this.kumiawase([0, 1, 2, 3, 4], n)
    );
    n = n + 1;
  }

  //何もしないよう配列を先頭に追加
  front_array_pattern.unshift([]);

  //先頭のパターン分実施する
  for (let pattern in front_array_pattern) {
    //試行回数
    let push_number = 0;

    //初期化
    now_array = this.$lodash.cloneDeep(this.items);
    //先頭のパターン押下する
    for (let pattern2 in front_array_pattern[pattern]) {
      push_number = push_number + 1;
      now_array = this.math_arround_change(
        now_array,
        0,
        front_array_pattern[pattern][pattern2]
      );
    }
    // 二段目より下をやる;
    // 自分の上の段が光ってたら押下;
    let i = 1;
    while (i < now_array.length) {
      let j = 0;
      while (j < now_array[i].length) {
        if (now_array[i - 1][j]) {
          push_number = push_number + 1;
          now_array = this.math_arround_change(now_array, i, j);
        }
        j = j + 1;
      }
      i = i + 1;
    }

    //最後に判定
    if (this.math_judge(now_array)) {
      if (minimum_push_number == -1 || minimum_push_number > push_number) {
        minimum_push_number = push_number;
        minimum_push_order = front_array_pattern[pattern];
      }
    }
  }
  if (minimum_push_number != -1) {
    return minimum_push_order;
  }
}
  }
};
</script>

<style scoped>
.resultContainer {
  display: flex;
  height: 350px;
  flex-wrap: wrap;
}

.item {
  min-height: 50px;
  min-width: 53px;
  margin: 5px;
}

table {
  width: 300px;
  height: 300px;
  border-collapse: collapse;
  table-layout: fixed;
}
table th {
  padding: 10px;
}
table td {
  padding: 3px 10px;
}
.on {
  position: relative;
  color:rgb(187, 187, 11);
}
.on:active {
  top: 3px;
}

.off {
  position: relative;
  color:rgb(5, 5, 5);
}
.off:active {
  top: 3px;
}
.guide {
  background-color: white;
  color: red;
}
.guide:active {
  top: 3px;
}
</style>ß
<template>
  <div id="app">
    <v-app id="inspire">
      <v-container fluid>
        <v-layout row>
          <v-flex xs12 sm6 offset-sm3>
            <v-card>
              <table>
                <tr v-for="(item, key, index) in items" :key="index">
                  <td
                    v-bind:class="items[key][key2]? 'on':'off'"
                    v-for="(value, key2, index) in item"
                    :key="index"
                    v-on:click="arround_change(key,key2)"
                  ></td>
                </tr>
              </table>
              <v-card-title primary-title>
                <div>
                  <div class="headline">ライツアウト</div>
                  <span class="grey--text">やってみよう</span>
                </div>
              </v-card-title>

              <v-card-actions>
                <v-btn flat>Answer</v-btn>
                <v-btn flat color="red" v-on:click="shuffle">Shuffle</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-app>
  </div>
</template>
<script>
export default {
  name: "Box",
  data() {
    return {
      isActive: true,
      items: [
        [true, true, false, false, false],
        [true, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false]
      ]
    };
  },
  updated: function() {
    if (!this.judge()) {
      this.$nextTick(() => {
        console.log("success");
      });
    }
  },
  methods: {
    print2(y, x) {
      if (this.items[y][x]) {
        this.$set(this.items[y], x, false);
      } else {
        this.$set(this.items[y], x, true);
      }
    },
    arround_change(y, x) {
      if (y > 0) {
        this.print2(y - 1, x);
      }
      this.print2(y, x);
      if (y + 1 < this.items.length) {
        this.print2(y + 1, x);
      }
      if (x > 0) {
        this.print2(y, x - 1);
      }
      if (x + 1 < this.items[y].length) {
        this.print2(y, x + 1);
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
      let i = 0;
      while (i < 5) {
        let j = 0;
        while (j < 5) {
          this.$set(this.items[i], j, this.random_marubatsu());
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
        judge_array = judge_array.concat(this.items[i]);
      }
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
    // suggestion() {
    //   let now_array = this.$lodash.cloneDeep(this.items);
    //   let suggestion_array = [];

    //   //1段目の押下するボタンを取得する
    //   let first_suggestion = this.correct_answer(now_array);

    //   console.table(now_array)

    //   if (first_suggestion === void 0) {
    //     console.log("無理ゲー");
    //   } else {
    //     for (let num in first_suggestion) {
    //       suggestion_array.push([0, first_suggestion[num]]);
    //     }
    //     console.table("1",suggestion_array)

    //     // 二段目より下をやる;
    //     // 自分の上の段が光ってたら押下;
    //     let i = 1;
    //     while (i < now_array.length) {
    //       let j = 0;
    //       while (j < now_array[i].length) {
    //         if (now_array[i - 1][j]) {
    //           console.log("a");
    //           suggestion_array.push([i,j]);
    //           now_array = this.math_arround_change(now_array, i, j);
    //         }
    //         j = j + 1;
    //       }
    //       i = i + 1;
    //     }
    //     console.table(now_array)
    //   }
    // },
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
    },
    lightsoff_after_second_row(now_array) {
      // 二段目より下をやる;
      // 自分の上の段が光ってたら押下;
      let i = 1;
      while (i < now_array.length) {
        let j = 0;
        while (j < now_array[i].length) {
          if (now_array[i - 1][j]) {
            now_array = this.math_arround_change(now_array, i, j);
          }
          j = j + 1;
        }
        i = i + 1;
      }
      return now_array;
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
  background-color: rgb(255, 255, 132);
  color: #fff;
  border-radius: 50px;
  line-height: 52px;
  -webkit-transition: none;
  transition: all 0.3s ease;
  box-shadow: inset 0 0 5px 5px white;
}
.on:hover {
  background-color: yellow;
  box-shadow: inset 0 0 5px 5px white;
}
.on:active {
  top: 3px;
}

.off {
  position: relative;
  background-color: rgb(172, 172, 172);
  color: #fff;
  border-radius: 50px;
  line-height: 52px;
  -webkit-transition: none;
  transition: none;
  box-shadow: inset 0 0 5px 5px white;
}
.off:hover {
  background-color: gray;
  box-shadow: inset 0 0 5px 5px white;
}
.off:active {
  top: 3px;
}
</style>
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
                <v-btn flat v-on:click="judge">Judge</v-btn>
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
        alert("r");
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

  answer() {
    let i = 1;
    let n = 1;
    let m = 0;
    let front_array_pattern = [];

    while (n <= this.items.length) {
      front_array_pattern = front_array_pattern.concat(
        this.kumiawase([1, 2, 3, 4, 5], n)
      );
      n = n + 1;
    }
    while (m < front_array_pattern.length) {
      for (let pattern in front_array_pattern) {
        this.math_arround_change(0, pattern);
      }
      while (i < this.items.length) {
        let j = 0;
        while (j < this.items[i].length) {
          if (this.items[i - 1][j]) {
            this.math_arround_change(i, j);
          }
          j = j + 1;
        }
        i = i + 1;
      }
      m = m + 1;
      this.judge();
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
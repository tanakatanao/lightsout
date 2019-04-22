<template>
  <div class="hello">
    <div>
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
      <v-btn color="error" v-on:click="shuffle">shuffle</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data: function() {
    return {
      isActive: true,
      items: [
        [true,true,true,true,true],
        [true,true,true,true,true],
        [true,true,true,true,true],
        [true,true,true,true,true],
        [true,true,true,true,false]
      ]
    };
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
    shuffle(y, x) {
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
table th {
  padding: 10px;
}
table td {
  padding: 3px 10px;
}
.on {
  border-radius: 50%;
  height: 20px;
  width: 20px;
  background-color: yellow;
}
.off {
  border-radius: 50%;
  height: 20px;
  width: 20px;
  background-color: gray;
}
</style>

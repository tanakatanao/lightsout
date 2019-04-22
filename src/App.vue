<template>
  <v-app>
    <v-content>
      <Box/>
    </v-content>
  </v-app>
</template>

<script>
import Box from './components/box.vue'

export default {
  name: 'App',
  components: {
    Box
  },
  data () {
    return {
      //
    }
  }
}
</script>

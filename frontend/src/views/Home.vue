<template>
  <main class="home">
    <Header />
    <ConnexionForm v-if="!isconnected" />
  </main>
</template>

<script>
import router from '../router'
// @ is an alias to /src
import Header from '@/components/Header.vue'
import ConnexionForm from '@/components/ConnexionForm'

export default {
  name: 'ToHome',
  components: {
    Header,
    ConnexionForm
  },

    data() {
      return {
        isconnected: true
      }
    },

  created() {
    this.connected()
  },

  methods: {
    connected() {
      if (localStorage.userId !== undefined) {
        this.isconnected = true;
        console.log('Vous êtes déjà connecté');
        router.push('/dashboard')
      } else if (localStorage.userId == undefined) { 
        this.isconnected = false;
        alert('Veuillez vous identifier')
        console.log('Veuillez vous identifier')
      }
    }
  }

}
</script>

<style scoped>
  
</style>

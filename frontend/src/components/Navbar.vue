<template>
    <nav class="nav-container">
    <router-link id="link" :to="{ name: 'Profile', params: { userId: this.userId } }">Mon profil</router-link>
    <button class="btn" type="submit" @click="deconnect()">Déconnexion</button>
    </nav>
</template>

<script>
//import axios from 'axios'
import router from '../router'

export default {
    name: 'ToNavbar',
    data() {
        return {
            userId: localStorage.getItem('userId')
        }
    },
    methods: {
        deconnect () {
            localStorage.clear()
            alert('Vous allez être déconnecté')
            router.push('/')
        },
    }
}
</script>

<style scoped>
.nav-container {
    margin: 10px;
}


</style>
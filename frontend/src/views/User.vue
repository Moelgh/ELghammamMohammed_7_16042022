<template>
  <main>
    <div v-for="item in userInfos" :key="item">
      <div class="card-title">
        <h1 v-if="user.id == this.$route.params.id">Mon Profil</h1>
        <h1 v-else>Profil de {{ item.prenom }} {{ item.nom }}</h1>
        <p class= "button-create" v-if="this.$route.params.id == user.id || user.isAdmin == true" @click="this.$router.push(`/editUser/${this.$route.params.id}`)">Modifier profil</p>
      </div>
      <div class="container-user">
        <div class="container-user__card">
          <img v-if="item.imageUrl != null" :src="item.imageUrl"/>
          <div class="container-user__card__name">
            <p>{{ item.prenom }} {{ item.nom }}</p>
          </div>
        </div>
        <div class="container-user__card__bio">
          <h2>A propos</h2>
          <h3>Poste</h3>
          <p>{{ item.poste }}</p>
          <h3>Biographie</h3>
          <p>{{ item.biographie }}</p>
          <span>Membre depuis le {{ formatDate(item.createdAt) }}</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: "User",

  mounted() {
    let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

    if (userInLocalStorage == null) {
      this.$router.push('/')

    } else {
      this.$store.dispatch('getUserInfos');
      this.$store.dispatch('getAllUsers');
    }
  },
  computed: {
    ...mapState({user: 'userInfos'}),
    userInfos() {
      return this.$store.state.allUsersInfos.filter(item => item.id == this.$route.params.id)
    },
  },
  methods: {

    /*RECUPERE LA DATE ET L'HEURE DANS LA BASE DE DONNEES ET TRANSFORME EN FORMAT LISIBLE*/

    formatDate(bddDate) {
      const date = new Date(bddDate);

      const day = date.toLocaleDateString();

      const time = date.toLocaleTimeString();
      
      return `le ${day} à ${time}`
    },
  },
}
</script>

<style lang="scss" scoped>
.card-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  h1 {
    text-align: left;
  }
  .button-create {
    border-radius: 10px;
  }
}
.container-user {
  display: flex;
  flex-direction: column;
  &__card {
    display: flex;
    flex-direction: row;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    margin-bottom: 2%;
    align-items: center;
    padding: 2%;
    &__name {
      display: flex;
      flex-direction: row;
      font-weight: bold;
      font-size: 20px;
    }
    img {
      height:150px;
      width: 150px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 20px;
    }
  }
  &__card__bio {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    padding: 2%;
    margin-bottom: 2%;
    span {
      margin-top: 2%;
      font-style: italic;
    }
  }
}
</style>
<template>
  <header>
    <div v-if="user.id != undefined" class="header">
      <Header/>
    </div>
    <div v-else class="header">
      <HeaderLog/>
    </div>
    <router-view/>
  </header>
</template>

<script>
import Header from "./components/Header.vue";
import HeaderLog from "./components/HeaderLog.vue";
import { mapState } from 'vuex';

export default {
  components: {
    Header,
    HeaderLog,
  },
  mounted() {
    this.$store.dispatch('getUserInfos');
  },
  computed: {
    ...mapState({user: 'userInfos'}),
  },
};
</script>

<style lang="scss">
html {
  margin: 0;
  padding:0;
  height: 100%;
}
.generalBody { 
  margin : 0px;
  padding : 0px;
}

main {
  max-width: 1024px;
  width: 95%;
  margin: auto;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: auto;
  height: 100%;
}

.header {
  width: 100%;
  border-bottom: 3px solid rgb(233, 233, 233);
  background-color: white;
}

/*GENERAL FORM*/

.card-create {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    &__form {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        &__description {
            width: 69%;
            height: 30px;
            border-radius: 10px 0px 0px 10px;
        }
    }
}

input:focus {
  outline: none;
}

label {
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  margin-left: 5px;
  font-size: 12px;
  font-weight: bolder;
}

textarea:focus {
  outline: none;
}

.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 95%;
    margin: auto;
}

/*GENERAL BUTTON CREATE*/

.button-create {
    display: flex;
      justify-content: center;
      align-items: center;
      background-color: red;
      border-radius: 0px 10px 10px 0px;
      font-weight: bold;
      color: white;
      height: 35px;
      width: 20%;
      margin: 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      transition: all 400ms;
      border: none;
      font-size: 15px;
      &:hover {
        cursor: pointer;
        filter: brightness(1.07);
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
      }
}


/*MODIFICATION ET SUPPRESSION COMMENTAIRE*/

.container-buttons {
    display: flex;
    flex-direction: row;
    margin-top: 10px;
    align-items: center;
    justify-content: center;
}

.form-modify {
    margin-right: 10px;
    text-align: left;
    &__description {
        border-radius: 10px;
    }
}

.button-comment {
    border: none;
    background: none;
    color: #2c3e50;
    &:hover {
        cursor: pointer;
    }
}


/*****************************/
/*VERSION MOBILE ET TABLETTE*/ 
/*****************************/

@media only screen and (max-width: 768px) {
    .button-create {
      font-size: 12px;
    }
}
</style>
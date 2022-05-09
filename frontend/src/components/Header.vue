<template>
    <header>
        <div class="mainHeader">
            <div class="mainHeader__icon">
                <img src="../assets/icon.svg" alt="Logo de Groupomania">
                <p>Groupomania</p>
            </div>
            <div class="nav">
                <div class="nav__card" @click="this.$router.push('/texttopic')">
                    <i class="far fa-comments"></i>
                    <p>Discussions</p>
                </div>
                <div class="nav__card" @click="this.$router.push('/multitopic')">
                    <i class="fas fa-tablet-alt"></i>
                    <p>Multimédia</p>
                </div>
                <div class="nav__card" @click="getOneUser">
                    <i class="fas fa-user"></i>
                    <p>Mon compte</p>
                </div>
                <div class="nav__card" @click="deconnectUser">
                    <i class="fas fa-door-open"></i>
                    <p>Deconnexion</p>
                </div>
            </div>
        </div>
  </header>
</template>


<script>
import axios from 'axios';

export default {
    name: "Header",

    methods : {
        deconnectUser() {
            localStorage.clear();
            this.$router.go();
        },
        getOneUser() {
            let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

            if(userInLocalStorage != null) {

                let userId = userInLocalStorage.map(user => user.userId);

                let userToken = userInLocalStorage.map(user => user.token);

                axios.get(`http://localhost:3000/api/auth/${userId}`, { 
                    headers: {
                    Authorization: "Bearer " + userToken
                    }, 
                })
                .then( this.$router.push(`/user/${userId}`) )
                .catch(() => {
                    alert('Impossible d\'être redirigé');
                });
            } 
        },
    }
}
</script>

<style lang="scss" scoped>

.mainHeader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    max-width: 1024px;
    margin: auto;
    align-items: center;
    flex-wrap: wrap;
    &__icon {
        width: 350px;
        display: flex;
        flex-direction: row;
        align-items: center;
        img {
            max-height: 100px;
            width: auto;
        }
        p {
            font-size: 40px;
            color: red;
        }
    }
}

.nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 100%;
    min-width: 50%;
    &__card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-right: 18px;
        &:hover {
            color: red;
            cursor: pointer;
        }
    }
}

/*****************************/
/*VERSION MOBILE ET TABLETTE*/ 
/*****************************/

@media only screen and (max-width: 768px) {
    .header {
        &__icon {
            width: 100%;
            justify-content: center;
        }
    }
    .nav {
        width: 100%;
        margin-left: 17px;
        flex-wrap: wrap;
    }
}
</style>
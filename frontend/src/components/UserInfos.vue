<template>
    <div class="userinfos">

        <!--MODALE POUR MODIFIER IMAGE DE PROFIL-->
        <ModaleModifyUser v-bind:revele="revele" v-bind:toggleModale="toggleModale" />

        <div class="userinfos__pic">
            <img v-if="profilePic" :src="user.profilePic" alt="Image de profil" />
            <img v-else src="@/assets/placeholderpic.jpg" alt="Image de profil" />
            <button type="button" v-if=" user.id == user_Id" @click="toggleModale()" class="userinfos__pic--modifybtn btn"><img class="userinfos__pic--modifybtnimg" src="../assets/wheel.svg" alt="Cliquez ici pour modifier votre photo de profil"></button>
        </div>    
        <h1>{{ user.firstname }} {{ user.name }}</h1>
        <p>{{ user.email }}</p>
        <button type=button v-if="is_Admin" class="userinfos__deletebtn btn" @click="deleteAccount()">Supprimer le compte</button>
    </div>
</template>

<script>
import ModaleModifyUser from './ModaleModifyUser.vue'
import axios from 'axios'
import router from '../router'


export default {
    name: 'UserInfos',
    components: {
        ModaleModifyUser,
    },
    data() {
        return {
            is_Admin: false,
            user_Id: localStorage.getItem('userId'),
            revele: false,
            profilePic: false,
            user: []

        }
    },

    mounted() {
        this.isUserAdmin()
        this.getOneUser()
    },

    methods: {
        getOneUser() {
            const userId = this.$route.params.userId;

            axios.get("http://localhost:3000/api/auth/user/" + userId, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((res) => {
                console.log(res);
                this.user = res.data;
                console.log(this.user);
                if (res.data.profilePic) {
                    this.profilePic = true;
                    console.log(this.profilePic)
                }
            })
            .catch((err) => {
                console.log(err + 'Impossible de récupérer les données utilisateurs')
            })
        },

        deleteAccount() {
            const user_Id = this.user.id;
            if(this.is_Admin) {
                
                console.log('Vous allez procéder à la suppression d\'un compte utilisateur');
                var conf = confirm('Administrateur : vous allez supprimer un compte utilisateur user :' + user_Id);

                if (conf == true) {
                    console.log('Démarrage de la suppression du compte de : ' + this.user.firstname + this.user.name);

                    axios.delete("http://localhost:3000/api/auth/" + user_Id, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("token")
                        }
                    })
                    .then(() => {
                        alert('Le compte a été supprimé avec succès. Vous allez être redirigé vers la page d\'accueil')
                        router.push({ path: '/'});
                    })
                    .catch((err) => {
                        console.log(err + "Impossible de supprimer le compte")
                    })
                } else {
                    console.log('Suppression de compte annulée')
                }

        } else {
            alert('Vous n\'êtes pas administrateur : vous ne pouvez pas effectuer cette opération !')
            }
        },

        //MODALE
        toggleModale() {
            this.revele = !this.revele;
            console.log('Utilisateur :' + this.user_Id)
        },

        isUserAdmin() {
            if(localStorage.isAdmin == 'true') {
                this.is_Admin = true;
            }
        }

    }


}
</script>

<style lang="scss" scoped>
.userinfos {
    width: 100%;
    border-radius: 5px;

    &__pic {
    width: 170px; 
    height: 160px;
    margin: 5px auto;
    border-radius: 100px; 
    position: relative;
    bottom: 40px;
    }

    &__pic--modifybtn {
        height: 40px;
        width: 40px;
        padding: 5px 5px 2px 5px !important;
        margin-right: 0 !important;
        position: relative;
        bottom: 45px;
        left: 40px;

    }

    &__pic--modifybtnimg {
        height: 20px;
        width: 20px;
    }
}

img {
    width: 160px;
    height: 150px;
    border: 5px solid white;
    object-fit: cover;
    border-radius: 100px;
}
h1 {
    padding: 10px;
    margin: inherit;
    margin-top: -30px;
    color: #BB2600 ;
}

p {
    font-size: 17px;
    font-weight: bold;
    color: #BB2600;
    margin-top: inherit;
}




</style>
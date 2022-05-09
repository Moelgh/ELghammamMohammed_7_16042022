<template>
    <main>
        <div class='card'>
            <h1 class='card__title' v-if ="mode == 'login'">Connexion</h1>
            <h1 class='card__title' v-else>Inscription</h1>
            <div class= 'form'>
                <label for="email">* Email</label>
                <input type="email" name="email" v-model="dataLogin.email" required/>
                <label for="password">* Mot de passe</label>
                <input type="password" name="password" v-model="dataLogin.password" required/>
            </div>
            <div class= 'form' v-if='mode=="signUp"'>
                <label for="nom">* Nom</label>
                <input type="text" name="nom" v-model="dataLogin.nom" required/>
                <label for="prenom">* Prénom</label>
                <input type="text" name="prenom" v-model="dataLogin.prenom" required/>
            </div>
            <button @click.prevent="login" v-if="mode == 'login'">S'identifier</button>
            <button @click.prevent="signUp" v-else>S'inscrire</button>
            <p v-if="mode == 'signUp'">Déjà inscrit ? <span class= 'card__action' @click="switchToLogin">Se connecter</span></p>
            <p v-else>Pas encore inscrit ? <span class= 'card__action' @click="switchToSignUp">S'inscrire</span></p>
        </div>
    </main>
</template>

<script>
import axios from "axios";

let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

export default {
    name: "Login",
    data () {
        return {
            dataLogin: {
                email: null,
                nom: null,
                prenom: null,
                password: null,
            },
            mode: 'login'
        }
    },
    mounted() {
        if (userInLocalStorage != null) {
            this.$router.push('/topic');
        }
    },

    methods: {
        switchToSignUp() {
            this.mode ='signUp'
        },
        switchToLogin() {
            this.mode ='login'
        },
        /*ENREGISTRE LES CLES ET VALEURS DANS LE LOCAL STORAGE
        *Envoie le user dans le tableau userInLocalStorage puis enregistre dans le localStorage
        *Si user est déjà présent le local storage est vidé et on push le nouvel utilisateur
        */
        saveUserInLocalStorage(response) {
            if (userInLocalStorage === null) {
                userInLocalStorage = [];
                userInLocalStorage.push(response);
                localStorage.setItem('user', JSON.stringify(userInLocalStorage));
            } else {
                localStorage.clear();
                userInLocalStorage = [];
                userInLocalStorage.push(response);
                localStorage.setItem('user', JSON.stringify(userInLocalStorage));
            }
        },
        login () {
            axios.post("http://localhost:3000/api/auth/login", {
                email: this.dataLogin.email,
                password: this.dataLogin.password,
            })
            .then(response => { 
                this.saveUserInLocalStorage(response.data), 
                this.$router.go() 
            })
            .catch(() => {
                alert('Identifiant ou mot de passe incorrect !')
            });
        },
        signUp() {
    

        /*Pas de caractères spéciaux et nom de domaine avec 2 à 3 lettres*/
        const emailRegex = /^[^@&"/()!_$*€£`+=;?#]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;


                if(emailRegex.test(this.dataLogin.email) == true) {
                    axios.post("http://localhost:3000/api/auth/signup", {
                        email: this.dataLogin.email,
                        prenom: this.dataLogin.prenom,
                        nom: this.dataLogin.nom,
                        password: this.dataLogin.password,
                    })
                    .then(response => {
                        this.saveUserInLocalStorage(response.data),
                        this.$store.dispatch('getUserInfos'),
                        this.$router.push('Topic')
                    })
                    .catch(() => {
                        alert('Cette adresse email existe déjà !')
                    });

                } else {
                    alert('Mauvaise adresse email')
                }

        }
    } 
}
</script>

<style lang="scss" scoped>
.card {
    background-color: rgb(226, 226, 226);
    width: 40%;
    border-radius: 30px;
    display: flex;
    flex-direction: column;
    padding: 30px;
    margin: auto;
    margin-top: 10%;
    h1 {
        color: red;
    }
    button {
        height: 40px;
        background-color: red;
        border: none;
        color: white;
        font-weight: bolder;
        font-size: 18px;
        cursor: pointer;
        border-radius: 20px;
        &:hover {
            filter: brightness(1.75);
            transition-duration: 700ms;
        }
    }
    .form {
        display: flex;
        flex-direction: column;
        input {
            height: 40px;
            margin-bottom: 15px;
            border-radius: 20px;
            border: none;
        }
    }
    &__action {
        cursor: pointer;
        text-decoration: underline;
        color: red;
        font-weight: bolder;
        &:active {
            color: white;
        }
    }
}

/*****************************/
/*VERSION MOBILE ET TABLETTE**/ 
/*****************************/

@media only screen and (max-width: 768px) {
    .card {
        width: 75%;
    }
}
</style>
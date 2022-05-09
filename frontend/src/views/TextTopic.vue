<template>
    <main>
        <div class="container__title">
            <h1>Discussions :</h1>
        </div>
        <div class="card-create">
            <form class="card-create__form" @submit.prevent="createTopic">
                <label for="topic">* Titre du topic :</label>
                <input class="card-create__form__description" type='text' name="topic" placeholder="Donnez un titre à votre topic"/>
                <input type="submit" class="button-create" value="Créer"/>
            </form>
        </div>
        <div class="container__infos">
            <div class="card-infos" v-for="i in topic" :key="i">
                <div class="card-infos__title">
                    <p class="card-infos__title__name button-get" @click="getOneTopic" :topicId="i.id">{{ i.title }}</p>
                </div>
                <div class="card-infos__title" v-for="user in allUsers" :key="user">
                    <p class="card-infos__title__user" v-if="i.userId == user.id" @click="getOneUser" :userId="user.id">par {{ user.prenom }} {{ user.nom }}</p>
                    <div class="user-picture" v-if="i.userId == user.id">
                        <img v-if="user.imageUrl != null" :src="user.imageUrl"/>
                    </div>
                </div>
                <div class="card-infos__title">
                    <p class="card-infos__title__date">créé le {{ formatDate(i.createdAt) }}</p>
                    <p class="card-infos__title__date" v-if="i.updatedAt != i.createdAt">Edité le {{ formatDate(i.updatedAt) }}</p>
                </div>
                <div class="container-buttons" v-if="i.userId == user.id || user.isAdmin == true">
                    <form class="form-modify" @submit.prevent="modifyTopic" :topicId="i.id">
                        <input class="form-modify__description" type='text' title="Renseignez la modification du topic" name="topic" placeholder="Entrer modification"/>
                        <input type="submit" class="button-comment" title="Cliquez ici pour modifier le topic" value="Modifier"/>
                    </form>
                    <button class='button-comment' @click="deleteTopic" title="Supprimer le topic" :topicId="i.id">Supprimer</button>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

export default {
    
    name: 'texttopic',
    data() {
        return {
            dataTopic: {
                title: null,
            },
        }
    },

    mounted() {
        if (userInLocalStorage == null) {
            this.$router.push('/');
        } else {
            this.$store.dispatch('getAllTopics');
            this.$store.dispatch('getAllUsers');
            this.$store.dispatch('getUserInfos');
        }
    },

    computed: {
        ...mapState({allUsers: 'allUsersInfos'}),
        ...mapState({topic: 'topicInfos'}),
        ...mapState({user: 'userInfos'}),
    },

    methods: {

        /*RECUPERE LA DATE ET L'HEURE DANS LA BASE DE DONNEES ET TRANSFORME EN FORMAT LISIBLE*/

        formatDate(bddDate) {
            const date = new Date(bddDate);

            const day = date.toLocaleDateString();

            const time = date.toLocaleTimeString();
            
            return `${day} à ${time}`;
        },

        /*TOPIC CRUD*/

        createTopic(event) {
            const title = event.target.elements.topic.value;

            let userToken = userInLocalStorage.map(user => user.token);

            let userId = userInLocalStorage.map(user => user.userId);

            if(title != '') {
                axios.post('http://localhost:3000/api/topic', {
                    title: title,
                    userId: userId[0],
                    }, { 
                    headers: {
                        Authorization: "Bearer " + userToken
                    }
                })
                .then(() => { 
                    this.$store.dispatch('getAllTopics');
                })
                .catch(() => {
                    alert('Impossible de créer le topic');
                });

            } else {
                alert('Veuillez donner un titre à votre topic !');
            }
        },
        deleteTopic(event) {
            let topicId = event.target.getAttribute("topicId");
            
            let userToken = userInLocalStorage.map(user => user.token);

            let userId = userInLocalStorage.map(user => user.userId);

            axios.delete(`http://localhost:3000/api/topic/${topicId}`, { 
                headers: {
                    Authorization: "Bearer " + userToken
                }, 
                data: {
                    userIdOrder: userId[0],
                }
            })
            .then(() => {
                this.$store.dispatch('getAllTopics');
            })
            .catch(() => {
                alert('Impossible de supprimer le topic');
            });
        },
        modifyTopic(event){
            /*Toutes la dataEdit est copiée dans un objet*/
            const copy = Object.assign({}, this.dataEdit);
            /*Grâce à cet objet on peut créer une boucle qui va supprimer toutes les valeurs "null"*/
            /*On envoie "...copy" dans la requête à l'API et ainsi seules les valeurs complétées sont envoyées à l'API*/

            for(const key in copy) {
                if (copy[key] == null) {
                    delete copy[key]
                }
            }
            let topicId = event.target.getAttribute("topicId");

            let userToken = userInLocalStorage.map(user => user.token);

            let userId = userInLocalStorage.map(user => user.userId);

            const title = event.target.elements.topic.value;

            if(title != '') {
                axios.put(`http://localhost:3000/api/topic/${topicId}`, {
                    title: title,
                    description: this.dataTopic.description,
                    userIdOrder: userId[0],
                }, { 
                    headers: {
                        Authorization: "Bearer " + userToken
                    }
                })
                .then(() => { 
                    this.$store.dispatch('getAllTopics'); 
                })
                .catch(() => {
                    alert('Impossible de modifier le titre du topic');
                });
            } else {
                alert('Veuilez renseigner le champ de modification')
            }
        },
        getOneTopic(event) {
            let topicId = event.target.getAttribute("topicId");

            let userToken = userInLocalStorage.map(user => user.token);

            axios.get(`http://localhost:3000/api/topic/${topicId}`, { 
                headers: {
                    Authorization: "Bearer " + userToken
                } 
            })
            .then(() => { 
                this.$router.push(`/comment/${topicId}`); 
            })
            .catch(() => {
                alert('Impossible de rejoindre le topic');
            });
        },

        /*USER*/

        getOneUser(event) {
            let userId = event.target.getAttribute("userId");

            let userToken = userInLocalStorage.map(user => user.token);

            axios.get(`http://localhost:3000/api/auth/${userId}`, { 
                headers: {
                    Authorization: "Bearer " + userToken
                } 
            })
            .then(() => { 
                this.$router.push(`/user/${userId}`); 
            })
            .catch(() => {
                alert('Impossible de récupérer l\'utilisateur');
            });
        },
    },
}
</script>

<style lang="scss" scoped>
.container {
    &__title {
        display: flex;
        width: 100%;
    }
    &__infos {
        display: flex;
        width: 100%;
        flex-direction: column;
    }
}

label {
    text-align: left;
    margin-right: 5px;
}

.card-infos {
    display:flex;
    flex-direction: column;
    border-bottom: #e6e6e6 solid 3px;
    padding: 2%;
    margin-top: 20px;
    position: relative;
    &__title {
        display: flex;
        border-right: #e6e6e6 solid 3px;
        flex-direction: row;
        p {
            margin: 1%;
            text-align: left;
        }
        &__name {
            font-weight: bolder;
            font-size: 20px;
            &:hover {
                text-decoration: underline;
                cursor: pointer;
            }
        }
        &__user {
            color: red;
            text-decoration: underline;
            font-weight: bolder;
            font-size: 14px;
            &:hover {
                cursor: pointer;
            }
        }
        &__date {
            font-style: italic;
            font-size: 12px;
        }
    }
}

.user-picture {
    img {
        height:100px;
        width: 100px;
        border-radius: 50%;
        object-fit: cover;  
        position: absolute;
        right: 40px;
        top: 0;
        bottom: 0;
        margin: auto;
    }
}

.container-buttons {
    justify-content: flex-start;
}

/*****************************/
/*VERSION MOBILE ET TABLETTE**/ 
/*****************************/

@media only screen and (max-width: 768px) {
    .user-picture {
        img {
            height: 75px;
            width: 75px;
        }
    }
}
</style>
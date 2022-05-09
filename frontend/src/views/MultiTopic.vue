<template>
    <main>
        <div class="container__title">
            <h1>Mur :</h1>
        </div>
        <div class="card-create">
            <form class="card-create__form" @submit.prevent="createPost">
                <div class="label-post">
                    <label for="post">* Donnez une description à votre post</label>
                    <input class="card-create__form__description input-border" type='text' name="post" placeholder="Description du post"/>
                </div>
                <div class="label-file">
                    <label for="file">* Choisir une image</label>
                    <input class="picture__input" ref="file" id="file" name="file" @change="selectFile" type="file"/>
                    <input type="submit" class="button-create input-border" value="Publier"/>
                </div>
            </form>
        </div>
        <div class="card" v-for="item in post" :key="item">

        <!--PARTIE POST-->

            <div class="card-post">
                <div v-if="item.userId == user.id || user.isAdmin == true" class="fontDelete">
                    <i class="fa-solid fa-trash-can" title="Supprimer le post" @click="deletePost" :postId="item.id"></i>
                </div>
                <div v-for="allUsers in allUsers" :key="allUsers">
                    <div class="card-post__user" v-if="item.userId == allUsers.id">
                        <div class="user">
                            <div v-if="allUsers.imageUrl != null">
                                <img class="user__image" :src="allUsers.imageUrl"/>
                            </div>
                            <div class="user__description">
                                <p class='button-get user__description__name' :userId="item.userId" @click="getOneUser" v-if="allUsers.prenom != null">{{ allUsers.prenom }} {{ allUsers.nom }}</p>
                                <p class='user__description__create'>{{ formatDate(item.createdAt) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="post">
                    <div class="post__description">
                        <p>{{ item.title }}</p>
                        <div v-if="item.userId == user.id || user.isAdmin == true" class="container-buttons post-buttons">
                            <form class="form-modify"  @submit.prevent="modifyPostDescription" :postId="item.id">
                                <input class="form-modify__description" type='text' name="post" title="Renseignez la modification du post" placeholder="Entrer modification"/>
                                <input type="submit" class="button-comment" title="Cliquez ici pour modifier le post" value="Modifier"/>
                            </form>
                        </div>
                    </div>
                    <div class="post__picture">
                        <img v-if="item.imageUrl != null" :src="item.imageUrl"/>
                    </div>
                </div>
                <div v-if="item.userId == user.id || user.isAdmin == true" class="container-buttons">
                    <input class="picture__input" ref="file" id="file" name="file" title="Selectionnez un fichier" @change="selectFile" type="file"/>
                    <button class='button-comment' @click="modifyPostPicture" title="Cliquez ici pour modifier l'image avec le fichier selectionné" :postId="item.id">Modifier image</button>
                </div>
                <div class="card-create">
                    <form class="card-create__form" @submit.prevent="createComment" :postId="item.id">
                        <input class="card-create__form__description" type='text' title="Rédigez ici votre commentaire" name="commentaire" placeholder="Ecrire un commentaire"/>
                        <input class="card-create__form__hidden" type="submit" @keyup.enter="submit"/>
                    </form>
                </div>
            </div>

            <!--PARTIE COMMENTAIRES-->

            <div class="scroller">
                <div class="container-comment" v-for="i in comment" :key="i">
                    <div v-if="item.id == i.postId">
                        <div class="card-comment" v-for="allUsers in allUsers" :key="allUsers">
                            <div class="card-comment__user" v-if="i.userId == allUsers.id">
                                <div v-if="allUsers.imageUrl != null">
                                    <img class="user__image" :src="allUsers.imageUrl"/>
                                </div>
                                <div class="user-comment">
                                    <p class='button-get user__description__name' :userId="i.userId" @click="getOneUser" v-if="allUsers.prenom != null">{{ allUsers.prenom }} {{ allUsers.nom }}</p>
                                    <div class="card-infos__date">
                                        <p class='user__description__create'>Posté le {{ formatDate(i.createdAt) }}</p>
                                        <p class='user__description__create' v-if="i.updatedAt != i.createdAt">Edité le {{ formatDate(i.updatedAt) }}</p>
                                    </div>
                                    <div class="comment-content">
                                        <p>{{ i.content }}</p>
                                    </div>
                                    <div class="container-buttons" v-if="i.userId == user.id || user.isAdmin == true">
                                        <form class="form-modify" @submit.prevent="modifyComment" :commentId="i.id">
                                            <input class="form-modify__description" type='text' title="Renseignez la modification du commentaire" name="commentaire" placeholder="Entrer modification"/>
                                            <input type="submit" class="button-comment" title="Cliquez ici pour modifier le commentaire" value="Modifier"/>
                                        </form>
                                        <button class='button-comment' @click="deleteComment" title="Supprimer le commentaire" :commentId="i.id">Supprimer</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import axios from "axios";
import { mapState } from 'vuex';

let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

export default {

name: 'multitopic',
    data() {
        return {
            commentData: {
                content: null,
            },
            dataPost: {
                title: null,
                image: null,
            },
        }
    },
    mounted() {
        if (userInLocalStorage == null) {
            this.$router.push('/');
        } else {
            this.$store.dispatch('getAllComments');
            this.$store.dispatch('getAllUsers');
            this.$store.dispatch('getUserInfos');
            this.$store.dispatch('getAllPosts');
        }   
    },
    computed: {
    ...mapState({user: 'userInfos'}),
    ...mapState({allUsers: 'allUsersInfos'}),
    ...mapState({post: 'postInfos'}),
    ...mapState({comment: 'commentInfos'}),
  },
    methods: {

        /*RECUPERE LA DATE ET L'HEURE DANS LA BASE DE DONNEES ET TRANSFORME EN FORMAT LISIBLE*/

        formatDate(bddDate) {
            const date = new Date(bddDate);

            const day = date.toLocaleDateString();

            const time = date.toLocaleTimeString();

            return `le ${day} à ${time}`;
        },
        /*FUNCTIONS COMMENT*/

        createComment(event) {
            const postId = event.target.getAttribute("postId");

            const content = event.target.elements.commentaire.value;

            let userToken = userInLocalStorage.map(user => user.token);

            let userId = userInLocalStorage.map(user => user.userId);

            if(content != "") {
                axios.post('http://localhost:3000/api/comment', {
                    content: content,
                    postId: postId,
                    userId: userId[0],
                    }, { 
                    headers: {
                        Authorization: "Bearer " + userToken
                    }
                })
                .then(() => { 
                    this.$store.dispatch('getAllComments');
                })
                .catch(() => {
                    alert('Impossible de mettre un commentaire');
                });

            } else {
                alert('Veuillez mettre un texte dans le champ de commentaire');
            }
        },
        modifyComment(event){
            let commentId = event.target.getAttribute("commentId");

            const content = event.target.elements.commentaire.value;

            let userToken = userInLocalStorage.map(user => user.token);

            let userId = userInLocalStorage.map(user => user.userId);

            if(content != "") {
                axios.put(`http://localhost:3000/api/comment/${commentId}`, {
                    content: content,
                    userIdOrder: userId[0],
                    }, { 
                    headers: {
                        Authorization: "Bearer " + userToken
                    }
                })
                .then(() => {
                    this.$store.dispatch('getAllComments');
                })
                .catch(() => {
                    alert('Impossible de modifier le commentaire');
                });

            } else {
                alert('Veuillez remplir le champ de modification du commentaire');
            }
        },
        deleteComment(event) {
            let commentId = event.target.getAttribute("commentId");

            let userToken = userInLocalStorage.map(user => user.token);

            let userId = userInLocalStorage.map(user => user.userId);

            axios.delete(`http://localhost:3000/api/comment/${commentId}`,{ 
                headers: {
                    Authorization: "Bearer " + userToken
                }, 
                data: {
                    userIdOrder: userId[0],
                }
            })
            .then(() => {
                this.$store.dispatch('getAllComments');
            })
            .catch(() => {
                alert('Impossible de supprimer le commentaire');
            });
        },

        /*FUNCTIONS USER*/

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
                alert('Impossbile de sélectionner l\'utilisateur');
            });
        },

        /*FUNCTIONS POST*/

        selectFile(event) {
            this.dataPost.image = event.target.files[0] || event.dataTransfer.files;
        },

        createPost(event) {
            const title = event.target.elements.post.value;

            let userToken = userInLocalStorage.map(user => user.token);

            let userId = userInLocalStorage.map(user => user.userId);
            /*Création d'un objet FormData pour envoyer l'image à l'API*/
            const formData = new FormData();
            /*Ajout de toutes clés et valeur à l'objet pour les envoyer à l'API*/
            formData.append("image", this.dataPost.image);
            formData.append("title", title);
            formData.append("userId", userId[0]);
            /*Test de la bonne récupération de l'image => console.log("test", formData.get("image"));*/

            /*On passe le formData dans la requête*/
            if(title != "") {
                axios.post('http://localhost:3000/api/post', formData, { 
                    headers: {
                        Authorization: "Bearer " + userToken
                    }
                })
                .then(() => {
                    this.$store.dispatch('getAllPosts');
                })
                .catch(() => {
                    alert('Impossible de créer le post');
                });

            } else {
                alert('Veuillez mettre une description à votre post');
            }
        },
        deletePost(event) {
            let postId = event.target.getAttribute("postId");

            let userToken = userInLocalStorage.map(user => user.token);

            let userId = userInLocalStorage.map(user => user.userId);

            axios.delete(`http://localhost:3000/api/post/${postId}`,{ 
                headers: {
                    Authorization: "Bearer " + userToken
                }, 
                data: {
                    userIdOrder: userId[0],
                },
            })
            .then(() => {
                this.$store.dispatch('getAllPosts');
            })
            .catch(() => {
                alert('Impossible de supprimer le post');
            });
        },
        modifyPostDescription(event){
            let postId = event.target.getAttribute("postId");

            let title = event.target.elements.post.value;

            let userToken = userInLocalStorage.map(user => user.token);

            let userId = userInLocalStorage.map(user => user.userId);

            if(title != "") {
                axios.put(`http://localhost:3000/api/post/${postId}`, {
                    title: title,
                    userIdOrder: userId[0],
                    }, { 
                    headers: {
                        Authorization: "Bearer " + userToken
                    }
                })
                .then(() => {
                    this.$store.dispatch('getAllPosts'); 
                })
                .catch(() => {
                    alert('Impossbile de modifier le post');
                });

            } else {
                alert('Veuillez remplir le champ de modification du post');
            }
        },
        modifyPostPicture(event) {
            let postId = event.target.getAttribute("postId");

            let userToken = userInLocalStorage.map(user => user.token);

            let userId = userInLocalStorage.map(user => user.userId);
            /*Création d'un objet FormData pour envoyer l'image à l'API*/
            const formData = new FormData();
            /*Ajout de toutes clés et valeur à l'objet pour les envoyer à l'API*/
            formData.append("image", this.dataPost.image);
            formData.append("userIdOrder", userId[0]);
            /*Test de la bonne récupération de l'image => console.log("test", formData.get("image"));*/

            /*On passe le formData dans la requête*/
            axios.put(`http://localhost:3000/api/post/image/${postId}`, formData, {
                headers: {
                    Authorization: "Bearer " + userToken
                },
            })
            .then(() => {
                this.$store.dispatch('getAllPosts');
            })
            .catch(() => {
                alert('Veuillez charger une image')
            })
        },
    }
}

</script>

<style lang="scss" scoped>

/*EN TETE PAGE*/

.container {
    &__title {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
}

.input-border {
    border-radius: 10px;
}


.label-post {
    width: 100%;
}

.label-file {
    display: flex;
    margin-top: 10px;
    flex-direction: row;
}

/* POST & COMMENT */

.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 96%;
    padding: 2%;
    margin-bottom: 30px;
    border: solid 2px #f2f2f2;
    border-radius: 10px;
    margin-top: 20px;
}

/* POST */

.card-post {
    display: flex;
    flex-direction: column;
    min-width: 100%;
    margin-bottom: 15px;
    &__user {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
}

.user {
    display:flex;
    flex-direction: row;
    align-items: center;
    min-width: 50%;
    padding-top: 2%;
    padding-left: 2%;
    &__image {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 50%;
        margin-right: 20px;
    }
    &__description {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            margin: 0;
            margin-bottom: 5px;
        }
        &__name {
            font-weight: bolder;
            &:hover {
                text-decoration: underline;
                cursor: pointer;
            }
        }
        &__create {
            font-style: italic;
            font-size: 10px;
            text-align: left;
        }
    }
}

.fontDelete {
    position: relative;
    text-align: right;
    height: 0;
    &:hover {
        cursor: pointer;
    }
}

.post {
    display: flex;
    justify-content: center;
    flex-direction: column;
    min-width: 100%;
    &__description {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-left: 2%;
    }
    &__picture {
        display: flex;
        width: 100%;
        border-top: solid 2px #f2f2f2;
        border-bottom: solid 2px #f2f2f2;
        align-content: center;
        justify-content: center;
        margin-bottom: 10px;
        img {
            display: flex;
            object-fit: contain;
            max-width: 100%;
        }
    }
}

/* COMMENT */

.card-create {
    display: flex;
    flex-direction: column;
    &__form {
        width: 100%;
        display: flex;
        flex-direction: column;
        &__hidden {
            display: none;
        }
        &__description {
            width: 98%;
            border-radius: 10px;
        }
    }
}

.scroller {
    display: flex;
    overflow-y: scroll;
    flex-direction: column;
    width: 100%;
    transition: 1000ms;
    max-height: 180px;
    &:hover {
        transition: 1000ms;
        max-height: 500px;
    }
}

.card-comment {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin-bottom: 1px;
    &__user {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
}
.user-comment {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    background-color: #f2f2f2;
    border-radius: 10px;
    padding: 10px;
    p {
        margin: 0;
    }
}

.comment-content {
    display: flex;
    margin-top: 5px;
    flex-direction: row;
    p {
        text-align: left;
    }
}

.container-buttons {
    margin-bottom: 10px;
}

.post-buttons {
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
    margin-bottom: 0;
    i {
        margin-bottom: 10px;
        &:hover {
            cursor: pointer;
        }
    }
    .form-modify {
        margin: 0;
    }
}
</style>
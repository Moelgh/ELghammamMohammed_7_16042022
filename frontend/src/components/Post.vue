<template>
    <div class="container-post">

                    <!--MODALE POUR MODIFIER LE POST-->
        <ModaleModify v-bind:revele="revele" v-bind:toggleModale="toggleModale" />

                    <!--NOM UTILISATEUR + BOUTONS -->
        <article class="post" v-for="post in posts" :key="post.id">
            <div class="post__header">
            <div class="post__header--username">
               <router-link  :to="{ name: 'UserProfile', params: { userId: post.user.id } }"><span class="post__header--username-name">{{ post.user.firstname + ' ' }}{{ post.user.name.toUpperCase() }}</span></router-link>
            </div>
            <div class="post__header--buttons">   
               <button type="button" class="post__header--buttons-modify btn" v-if="post.userId == user_id"  @click="toggleModale(post.id)"> <img src="../assets/wheel.svg" class="post__header--buttons-modify-img" alt="modifier le post"></button>
               <button type="button" class="post__header--buttons-delete btn" v-if="post.userId == user_id || this.is_Admin" @click="deletePost(post.id)" alt="Supprimer le post" > X </button>
            </div>   
            </div>    
                    <!--TITLE + IMG-->
                    <div class="post__content">
                        <h1 class="post__content--title"> {{ post.title }} </h1>
                        <div class="post__content--content">
                           <img :src="post.content" class="post__content--img" alt="image postée par l'utilisateur">
                        </div>
                    </div>
                    <!--FOOTER-->
                        <div class="post__footer">
                            <div class="post__footer--comments">   
                                <button class="post__footer--comments-btn" type="button" @click="showComments(post.id)" aria-label="Afficher ou masquer les commentaires" ><img alt="commentaires" class="post__footer--comments-btn-img" src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNTEyIDUxMiIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxwYXRoIGQ9Im00MzYuMzEgMTA3LjQyNWMtNDguMjQtMzcuNDQtMTEyLjI4LTU4LjA2LTE4MC4zMS01OC4wNi02LjIgMC0xMi4zNy4xNy0xOC41LjUxLTYxLjA4IDMuMzktMTE3Ljk3IDIzLjUyLTE2MS44MSA1Ny41NS00OC44MSAzNy44OC03NS42OSA4OC40Mi03NS42OSAxNDIuMzEgMCA0OC42MSAyMi4yOSA5NS4xNiA2Mi44OSAxMzEuNjItMTEuOTUgMjcuODEtMjcuMjUgNTAuNzktNDUuNTIgNjguMzYtMi4xOCAyLjEtMi44OSA1LjMtMS44IDguMTIgMS4xIDIuODIgMy43OCA0LjcxIDYuOCA0Ljc5LjIxIDAgLjgxLjAxIDEuNzguMDEgMTAuNTkgMCA2NC44My0xLjUxIDEyNC44Ny0zMC43OSAyOC4wNCAxMC4xMSA1Ny43MSAxNi4wNSA4OC40NyAxNy43NSA2LjEzLjM0IDEyLjMuNTEgMTguNTEuNTEgNjguMDMgMCAxMzIuMDctMjAuNjMgMTgwLjMxLTU4LjA3IDQ4LjgxLTM3Ljg4IDc1LjY5LTg4LjQyIDc1LjY5LTE0Mi4zIDAtNTMuODktMjYuODgtMTA0LjQzLTc1LjY5LTE0Mi4zMXoiIGZpbGw9IiNmZjNlN2EiLz48Zz48Zz48cGF0aCBkPSJtMzk4LjMyIDI1NS45OTljMCAyMC42OC0xNi43OTkgMzcuNS0zNy40NTMgMzcuNS00LjM3NSAwLTguNTc5LS43NS0xMi40ODQtMi4xNC0xNC41MzItNS4xNi0yNC45NjktMTkuMDYtMjQuOTY5LTM1LjM2czEwLjQzNy0zMC4yIDI0Ljk2OS0zNS4zNmMzLjkwNS0xLjM5IDguMTEtMi4xNCAxMi40ODQtMi4xNCAyMC42NTQgMCAzNy40NTMgMTYuODIgMzcuNDUzIDM3LjV6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibTM5OC4zMiAyNTUuOTk5YzAgMjAuNjgtMTYuNzk5IDM3LjUtMzcuNDUzIDM3LjUtNC4zNzUgMC04LjU3OS0uNzUtMTIuNDg0LTIuMTQgMTQuNTMyLTUuMTYgMjQuOTY5LTE5LjA2IDI0Ljk2OS0zNS4zNnMtMTAuNDM3LTMwLjItMjQuOTY5LTM1LjM2YzMuOTA1LTEuMzkgOC4xMS0yLjE0IDEyLjQ4NC0yLjE0IDIwLjY1NCAwIDM3LjQ1MyAxNi44MiAzNy40NTMgMzcuNXoiIGZpbGw9IiNkY2VjZjQiLz48L2c+PGc+PHBhdGggZD0ibTE4OC41ODYgMjU1Ljk5NmMwIDIwLjY4LTE2Ljc5OSAzNy41LTM3LjQ1MyAzNy41LTQuMzc1IDAtOC41NzktLjc1LTEyLjQ4NC0yLjE0LTE0LjUzMi01LjE2LTI0Ljk2OS0xOS4wNi0yNC45NjktMzUuMzZzMTAuNDM3LTMwLjIgMjQuOTY5LTM1LjM2YzMuOTA1LTEuMzkgOC4xMS0yLjE0IDEyLjQ4NC0yLjE0IDIwLjY1NCAwIDM3LjQ1MyAxNi44MiAzNy40NTMgMzcuNXoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJtMTg4LjU4NiAyNTUuOTk2YzAgMjAuNjgtMTYuNzk5IDM3LjUtMzcuNDUzIDM3LjUtNC4zNzUgMC04LjU3OS0uNzUtMTIuNDg0LTIuMTQgMTQuNTMyLTUuMTYgMjQuOTY5LTE5LjA2IDI0Ljk2OS0zNS4zNnMtMTAuNDM3LTMwLjItMjQuOTY5LTM1LjM2YzMuOTA1LTEuMzkgOC4xMS0yLjE0IDEyLjQ4NC0yLjE0IDIwLjY1NCAwIDM3LjQ1MyAxNi44MiAzNy40NTMgMzcuNXoiIGZpbGw9IiNkY2VjZjQiLz48L2c+PGc+PHBhdGggZD0ibTI5My40NTUgMjU1Ljk5NmMwIDIwLjY4LTE2Ljc5OSAzNy41LTM3LjQ1MyAzNy41LTQuMzc1IDAtOC41NzktLjc1LTEyLjQ4NC0yLjE0LTE0LjUzMi01LjE2LTI0Ljk2OS0xOS4wNi0yNC45NjktMzUuMzZzMTAuNDM3LTMwLjIgMjQuOTY5LTM1LjM2YzMuOTA1LTEuMzkgOC4xMS0yLjE0IDEyLjQ4NC0yLjE0IDIwLjY1NCAwIDM3LjQ1MyAxNi44MiAzNy40NTMgMzcuNXoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJtMjkzLjQ1NSAyNTUuOTk2YzAgMjAuNjgtMTYuNzk5IDM3LjUtMzcuNDUzIDM3LjUtNC4zNzUgMC04LjU3OS0uNzUtMTIuNDg0LTIuMTQgMTQuNTMyLTUuMTYgMjQuOTY5LTE5LjA2IDI0Ljk2OS0zNS4zNnMtMTAuNDM3LTMwLjItMjQuOTY5LTM1LjM2YzMuOTA1LTEuMzkgOC4xMS0yLjE0IDEyLjQ4NC0yLjE0IDIwLjY1NCAwIDM3LjQ1MyAxNi44MiAzNy40NTMgMzcuNXoiIGZpbGw9IiNkY2VjZjQiLz48L2c+PC9nPjxwYXRoIGQ9Im01MTIgMjQ5LjczNWMwIDUzLjg4LTI2Ljg4IDEwNC40Mi03NS42OSAxNDIuMy00OC4yNCAzNy40NC0xMTIuMjggNTguMDctMTgwLjMxIDU4LjA3LTYuMjEgMC0xMi4zOC0uMTctMTguNTEtLjUxIDYxLjA4LTMuMzkgMTE3Ljk4LTIzLjUzIDE2MS44Mi01Ny41NiA0OC44MS0zNy44OCA3NS42OS04OC40MiA3NS42OS0xNDIuMyAwLTUzLjg5LTI2Ljg4LTEwNC40My03NS42OS0xNDIuMzEtNDMuODQtMzQuMDMtMTAwLjczLTU0LjE2LTE2MS44MS01Ny41NSA2LjEzLS4zNCAxMi4zLS41MSAxOC41LS41MSA2OC4wMyAwIDEzMi4wNyAyMC42MiAxODAuMzEgNTguMDYgNDguODEgMzcuODggNzUuNjkgODguNDIgNzUuNjkgMTQyLjMxeiIgZmlsbD0iI2IyMDA2ZSIvPjwvZz48L3N2Zz4=" /></button>
                                <span class="post__footer--nb-of-comments">{{ post.comments.length }}</span>
                            </div>
                            <div class="post__footer--infos">
                                <p class="created-at"> Créé le : {{ post.createdAt.slice(0,10).split('-').reverse().join('-') + ' à ' + post.createdAt.slice(11,16) }}</p>
                                <p class="updated-at"> Modifié le : {{ post.updatedAt.slice(0,10).split('-').reverse().join('-') + ' à ' + post.updatedAt.slice(11,16) }}</p>
                            </div>
                      </div>  
                            <div class="newcomment-container" >
                                  <div class="newcomments">
                                    <form class="newcomments__form">
                                        <input type="text" class="newcomments__form--text" v-model="commentText" placeholder="Votre commentaire..." aria-label="Ecrivez ici votre commentaire" required>
                                        <button class="newcomments__form--btn btn" type="submit" @click="createComment(post.id)"><img src="../assets/send.svg" alt="Publier le commentaire"></button>
                                    </form>
                                  </div>
                            </div> 

                        <div  v-bind:id="post.id" class="comment-none" >
                            <div class="comment" v-for="comment in post.comments" :key="comment.id" >
                                <div class="comment__username">
                                    <div>{{ comment.user.firstname + ' ' }}{{ comment.user.name.toUpperCase()}}</div>
                                    <div class="comment__date">Ajouté le : {{comment.createdAt.slice(0,10).split('-').reverse().join('-') }}</div>
                                    <button type="button" class="comment__deletebtn btn" v-if="comment.userId == user_id || this.is_Admin" @click="deleteComment(comment.id)" alt="supprimer le commentaire" > x </button>
                                </div>
                                <div class="comment__content">
                                    <div>{{ comment.content }}</div>
                                </div>
                            </div>
                        </div>
       </article>
    </div>
    
</template>

<script>
import ModaleModify from '@/components/ModaleModify.vue';
import axios from 'axios';



export default {
    name: "ToPost",
    components: {
        ModaleModify,
    },

    data() {
        return {
            is_Admin: false,
            revele: false,
            user_id: localStorage.getItem("userId"),
            empty: false,
            commentText: "",
            posts: [],
            onePost: [],
            comments: []
        };
    },

    mounted() {
        this.isUserAdmin();
        this.getAllPost();
        
    },
    methods: {
        getAllPost() {
            axios.get("http://localhost:3000/api/post/", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
                .then((res) => {
                console.log(res);
                this.posts = res.data;
            })
                .catch((err) => {
                console.log(err + "Impossible de récupérer les posts");
            });
        },
        deletePost(id) {
            console.log(id);
            const postId = id;
            axios.delete("http://localhost:3000/api/post/" + postId, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
                .then(() => {
                alert("Votre post a été supprimé");
                window.location.reload();
            })
                .catch((err) => {
                console.log(err + "Impossible de supprimer le post");
            });
        },
        //COMMENTAIRES//
        createComment(id) {
            const postId = id;
            console.log(postId);
            const comment = {
                userId: localStorage.getItem("userId"),
                content: this.commentText,
            };
            console.log(comment);
            axios.post("http://localhost:3000/api/post/" + postId + "/comment", comment, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            })
                .then(() => {
                console.log("Votre commentaire a été publié");
                window.location.reload();
            })
                .catch((error) => {
                alert(error + "votre commentaire n'a pas été publié, veuillez réessayer");
            });
        },
        deleteComment(id) {
            const commentId = id;
            console.log(commentId);
            axios.delete("http://localhost:3000/api/post/comment/" + commentId, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            })
                .then(() => {
                alert("Votre commentaire a été supprimé");
                window.location.reload();
            })
                .catch((err) => {
                console.log(err + "Impossible de supprimer le commentaire");
            });
        },
        showComments(id) {
            const postId = id;
            console.log(postId);
            const d1 = document.getElementById(postId);
            console.log(d1);
            if (getComputedStyle(d1).display != "none") {
                d1.style.display = "none";
            }
            else {
                d1.style.display = "block";
            }
        },
        toggleModale(id) {
            this.revele = !this.revele;
            const postId = id;
            console.log(postId);
            localStorage.setItem("post_Id", postId);

            axios.get("http://localhost:3000/api/post/" + postId, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
                .then((res) => {
                console.log(res);
                this.onePost = res.data;
                const targetPost = JSON.stringify(this.onePost);
                localStorage.setItem("target_post", targetPost);
                
            })
                .catch((err) => {
                console.log(err + "Impossible de récupérer le post");
            });

        },

        isUserAdmin() {
            if(localStorage.isAdmin == 'true') {
                this.is_Admin = true;
            }
        }
    },
}

</script>

<style lang="scss" scoped>

.container-post {
    width: 95%;
    margin: 10px auto;
    background-color: #FFD7D7;
    border-radius: 5px;

}
    @media screen and (min-width: 769px) {
        .container-post {
            width: 550px ;
        }
    }
.post {
    background-color: white;
    margin: 0px 0px 10px 0px;
    border-radius: 5px;

    &__header {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
    &__header--username {
        display: flex;
        align-items: center;
        font-size: 17px;
        //color: #FD2D01;
        font-weight: bold;
        padding: 10px;
        text-align: left;
        width: 50%;
    }
    &__header--username-name {
        color: #DB2600;
    }
    &__header--buttons {
        display: flex;
        padding: 10px;
        width: 25%;
    }
    &__header--buttons-modify {
        padding: 5px 5px 2px 5px !important;
        margin-right: 0 !important;
    }
    &__header--buttons-modify-img {
        height: 18px;
        width: 20px;
    }
    &__header--buttons-delete {
        padding: 5px 9px 5px 9px !important;
        margin-right: 0 !important;
    }
    &__content--content {
        width: 100%;
    }
    &__content--img {
        width: 95%;
        object-fit: contain;
    }
    &__footer {
        display: flex;
        flex-direction: raw;
        align-items: center;
        justify-content: space-between;
        padding: 15px;

        @media screen and (min-width: 769px) {
        width: 70%;
        margin: auto;
        }
    }
    &__footer--comments {
        display: flex;
        padding: 10px;
        width: 40px;
        display: inline-block;
        img {
            width: 36px;
            height: 36px;
        }
        span {
            font-size: 13px;
            color: #000000;
        }
    }
    &__footer--comments-btn {
        border: none;
        background: white;
    }

    &__footer--likes {
        display: flex;
        padding: 10px;
        width: 40px;
        display: inline-block;
        img {
            width: 33px;
            height: 33px;
        }
        span {
            font-size: 13px;
            color: #000000;
        }
    }
    &__footer--likes-btn {
        border: none;
        background: white;
    }
    &__footer--infos {
        display: inline-block;
        font-size: 10px;
        font-style: italic;
        text-align: right;
        padding: 10px;
        p {
            margin: 2px 0px 2px 0px;
        }
    }
}

//GENERAL
a {
    text-decoration: none;
}

h1 {
    font-size: 20px;
}

/*.like-btn {
    background-color: white;
    border: none;
}*/

//BLOC COMMENTAIRES//
.newcomment-container {
    height: 50px;
    border-top: 2px groove #FFD7D7;
    display: flex;
    align-items: center;
    padding: 5px 10px 5px 5px;
}

//NOUVEAU COMMENTAIRE
.newcomments {
    width: 100%;
    &__form {
        width: 100%;
        height: 50px;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    &__form--btn {
        width: 37px;
        height: 37px;
        margin: 0px !important;
        padding: 5px 5px 5px 5px !important;
        display: inline;
    }
    &__form--text {
        margin-bottom: 0px;
        width: 80%;
        margin-right: 5px;
        font-style: italic;
    }
}

//COMMENTAIRE
.comment {
    border-top: 2px groove #FFD7D7;
    border-radius : 5px;
    &__username {
        font-weight: bold;
        font-size: 15px;
        text-align: left;
        padding: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    &__date {
        font-size: 10px;
        font-weight: 100;
        font-style: italic;
    }
    &__content {
        text-align: left;
        padding: 10px 5px 10px 5px;
        font-size: 14px;
    }
    &__deletebtn {
        padding: 2px 5px 4px 5px !important;
        margin: inherit !important;
    }
}
.comment-none{
    display: none;
}






</style>



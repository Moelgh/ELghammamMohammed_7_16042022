<template>
<div class="container-post">
    <div class="post">
        <h2>Bonjour {{ user.firstname }},</h2>
        <form class="post__form">
            <label for="post-title">Donnez un titre à votre article :</label>
            <input type="text" id="post-title" placeholder="Titre..." aria-label="Ecrivez le titre ici" v-model="input.postTitle" required>

            <div class="post__glimpse" v-if="this.input.postContent">
            <img :src="apImage" class="post__glimpse--img" alt="image de l'article" v-if="this.file" />
            <img :src="this.input.postContent" class="post__glimpse--img" alt="image de l'article" v-else />
            </div>

            <label for="post-content--file">Partagez son contenu :</label>
            <input @change="selectFile" type="file" ref="file" name="file" id="post-content--file" accept='.png, .jpeg, .gif, .png, .jpg'>
            

           <label for="post-content--url" id='post-content--label'>Ou copiez l'URL de votre image :</label>
            <input type="text" id="post-content--url" placeholder="http://...." v-model="input.postContent" aria-label="Collez l'URL de l'image">
          </form>
        <button class="btn" type="submit" @click="createPost()">Publiez !</button>

    </div>
</div>
    
</template>

<script>
import axios from 'axios'
//import router from '../router'

export default {
    name: 'NewPost',

    data() {
        return {
            apImage: '',
            file : '',
            input: {
                postTitle : '',
                postContent: ''
            },
            user: []
        }
    },

    mounted() {
        this.getOneUser();
    },

    methods: {
        createPost() {
            
            const userId = localStorage.getItem('userId');
            console.log(this.input.postContent);
            console.log(this.file);

            let formData = new FormData();
            formData.append('userId', userId);
            formData.append('title', this.input.postTitle);
            formData.append('file', this.file);
            formData.append('content', this.input.postContent);

            axios.post("http://localhost:3000/api/post/", formData, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }

             })
            .then(() => {
                console.log('Votre article a bien été publié');
                this.file = null;
                window.location.reload();
            })
            .catch((error) => {
                alert(error + 'Vote article n\'a pas pu être publié, veuillez réessayer')
            })
        },

        getOneUser() {
            const userId = localStorage.getItem('userId');

            axios.get("http://localhost:3000/api/auth/user/" + userId, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then((res) => {
                console.log(res);
                this.user = res.data
            })
            .catch((err) => {
                console.log(err + 'Impossible de récupérer les données utilisateurs')
            })
        },

        selectFile(event) {
             this.file = event.target.files[0];
             this.input.postContent = URL.createObjectURL(this.file);
             this.apImage = URL.createObjectURL(this.file);

             const hidelabel = document.getElementById('post-content--label');
             hidelabel.style.display = "none";

             const hidebar = document.getElementById('post-content--url');
             hidebar.style.display = "none";
        }, 

    }
}
</script>

<style  lang="scss" scoped>
.container-post {
    width: 95%;
    margin: 0px auto;
}
 @media screen and (min-width: 769px) {
        .container-post {
            width: 600px ;
        }
    }

.post {
    width: 90%;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-items: center;
    background-color: white;
    border-radius: 5px;
    margin: 10px auto;
    
    &__form {
        display: flex;
        flex-direction: column;
        margin: auto;
        width: 95%
    }
    &__glimpse {
        width: 70%;
        margin: 10px auto;
    }
    &__glimpse--img {
        width: 95%;
        object-fit: contain;
    }
}
input {
    border: none;
    width: 98%;
    text-overflow: ellipsis;
}
#post-title {
    height: 35px;
    border: 1px solid black;
    font-style: italic;
}




</style>
<template>

    <div class="modale" v-if="revele">
        <div class="modale__overlay" >
            <div class="modale__container">
                <button type="button" class="modale__container--closebtn btn" @click="toggleModale"> X </button>
                <h1 class="modale__container--title">Modifier votre post</h1>

                <form class="modale__form">
                    <label for="modifiedTitle">Changez le titre de votre article : </label>
                    <input type="text" id="modifiedTitle" placeholder="Modifier le titre ici..." v-model="input.post_Newtitle" aria-label="Modifiez le titre de votre article ici" required>

                    <label for="modifiedContent-file">Choisissez un autre fichier :</label>
                    <input @change="selectFile" type="file" ref="file" name="file" id="modifiedContent-file" accept='.png, .jpeg, .gif, .png, .jpg'>

                    <label for="modifiedContent-url" id='modifiedContent-label'>Ou copiez/collez une autre URL pour votre image :</label>
                    <input type="text" id="modifiedContent-url" placeholder="http://..." v-model="input.post_Newcontent" aria-label="Modifiez l'URL de votre image ici">

                    <button @click="modifyPost($event)" type="submit" class="modale__form--submit btn"> Valider </button>
                </form>
            </div>

        </div>


    </div>

</template>

<script>
import axios from 'axios';

export default {
    name : 'ModaleModify',
    props: ['revele', 'toggleModale'],
    data() {
        return {
            user_id: localStorage.getItem("userId"),
            post_id: localStorage.getItem("post_Id"),
            file: '',
            apImage: '',
            input: {
                post_Newtitle: '',
                post_Newcontent: ''
            },
        };
    },
    methods: {
        modifyPost(event) {
            event.preventDefault()
            console.log('modification en cours');
            const postId = this.post_id;
            const userId = localStorage.getItem('userId');

            let formData = new FormData();
            formData.append('userId', userId);
            formData.append('title', this.input.post_Newtitle);
            formData.append('file', this.file);
            formData.append('content', this.input.post_Newcontent);

            var inputTitle = document.getElementById('modifiedTitle');
            var inputImage = document.getElementById('modifiedContent-file');
            var inputContent = document.getElementById('modifiedContent-url');
            if (!inputTitle.validity.valid || (inputImage.value == '' && inputContent.value == '')) {
                alert('Demande invalide. Veillez à remplir les champs image et titre et à entrer un titre valide');
                return false
            }else{
                axios.put("http://localhost:3000/api/post/" + postId, formData, {
                 headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                })
                .then(() => {
                    console.log('Votre article a bien été modifié' + postId);
                    window.location.reload();
                })
                .catch((error) => {
                    alert(error + 'Vote article n\'a pas pu être modifié, veuillez réessayer')
                })
            }

        },

        selectFile(event) {
             this.file = event.target.files[0];
             this.input.post_Newcontent = URL.createObjectURL(this.file);
             this.apImage = URL.createObjectURL(this.file);

             const hidelabel = document.getElementById('modifiedContent-label');
             hidelabel.style.display = "none";

             const hidebar = document.getElementById('modifiedContent-url');
             hidebar.style.display = "none";
        },
    },

}

</script>

<style lang="scss" scoped>
.modale {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.5);
   
   &__container--title {
       text-align: left;
   }
   &__overlay {
        background: rgba(0,0,0,0.5);
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
    }

    &__container {
        background: white;
        border-radius: 5px;
        position: fixed;
        padding: 10px;
        top: 30%;
    }
    &__container--closebtn {
        position: absolute;
        top: 10px;
        right: 10px;
    }
    &__form {
        display: flex;
        flex-direction: column;
        width: 95%
    }
}

        @media screen and (min-width: 769px) {
            .modale__container {
            width: 420px ;
            right: 30%;
            left: 30%;
        }
        }

</style>
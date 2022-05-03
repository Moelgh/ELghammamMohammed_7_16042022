<template>

    <div class="modale" v-if="revele">
        <div class="modale__overlay" >
            <div class="modale__container">
                <button type="button" class="modale__container--closebtn btn" @click="toggleModale"> X </button>
                <h1 class="modale__container--title">Modifier votre image de profil</h1>

                <form class="modale__form">

                    <label for="modifiedContent-file">Choisissez un fichier :</label>
                    <input @change="selectFile" type="file" ref="file" name="file" id="modifiedContent-file" accept='.png, .jpeg, .gif, .png, .jpg'>

                    <button type="submit" class="modale__form--submit btn" @click="modifyUser()"> Valider </button>
                </form>
            </div>

        </div>


    </div>

</template>

<script>
import axios from "axios";

export default {
    name: 'ModaleModifyUser',
    props: ['revele', 'toggleModale'],
    data() {
        return {
            user_id: localStorage.getItem("userId"),
            file: '',
        }
    },
    methods: {
        modifyUser() {
            console.log('lancement de la modification pour user :' + this.user_id);

            const userId = localStorage.getItem('userId');

            let formData = new FormData();
            formData.append('file', this.file);
            console.log('userId');
            console.log(formData);

            axios.put("http://localhost:3000/api/auth/user/" + userId, formData, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                
            })
            .then(() => {
                console.log('Votre image de profil a bien été modifiée !' + userId);
                this.file = null;
                window.location.reload();
            })
            .catch((error) => {
                alert(error + 'La modification de votre image de profil a échoué, veuillez réessayer')
            })
        },

        selectFile(event) {
            this.file = event.target.files[0];
        }




    }

}
</script>

<style lang="scss" scoped>

.modale {
    z-index: 10;
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
       padding-right: 40px;
   }
   &__overlay {
        background: rgba(0,0,0,0.5);
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
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
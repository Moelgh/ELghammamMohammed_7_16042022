<template>
  <main>
    <div class="title">
      <h1>Modifier le compte</h1>
      <p class="form__button delete-button button-create" @click="deleteUser">Supprimer le compte</p>
    </div>
    <div class="container-edit">
      <div class="form-infos">
        <div class="picture">
          <label for="file" class="label-file">Choisir une image</label>
          <input class="input-file" ref="file" id="file" name="file" @change="selectFile" type="file"/>
          <p class="form__button button-create" @click="editUserPicture">Modifier la photo de profil</p>
        </div>
        <div class="user">
          <label for="email">Email</label> 
          <input class="user__input-infos" type="email" name="email" v-model="dataEdit.email"/>
          <label for="prenom">Prénom</label>
          <input class="user__input-infos" name="prenom" type="text" v-model="dataEdit.prenom"/>
          <label for="nom">Nom</label>
          <input class="user__input-infos" name="nom" type="text" v-model="dataEdit.nom"/>
          <label for="nom">Poste</label>
          <input class="user__input-infos" name="poste" type="text" v-model="dataEdit.poste"/>
          <label for="biographie">Biographie</label>
          <textarea class="user__input-infos" name="biographie" type="text" v-model="dataEdit.biographie"></textarea>
          <p class="user__button button-create" @click="editUser">Modifier les informations</p>
        </div>
      </div>
      <div class="form form-space">
        <label for="password">Nouveau mot de passe</label>
        <input class="form__input" type="password" name="poste" v-model="passwordCheck.password"/>
        <label for="passwordCheck">Saisissez une seconde fois le nouveau mot de passe</label>
        <input class="form__input" type="passwordCheck" name="poste" v-model="dataEdit.password"/>
        <p class="form__button button-create" @click="editUserPassword">Modifier le mot de passe</p>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

export default {
  name: "EditUser",

  data() {
    return {
      dataEdit: {
        nom: null,
        email: null,
        biographie: null,
        poste: null,
        prenom: null,
        password: null,
        image: null,
      },
      passwordCheck : {
        password: null,
      },
    }
  },

  mounted() {
    let userInLocalStorage = JSON.parse(localStorage.getItem('user'));

    if (userInLocalStorage == null) {
      this.$router.push('/');
    } else {
      this.$store.dispatch('getUserInfos');
    } 
  },

  computed: {
    ...mapState({ user: 'userInfos' })
  },

  methods: {
    selectFile(event) {
      this.dataEdit.image = event.target.files[0] || event.dataTransfer.files;
    },
    editUser() {
      const id = this.$route.params.id;

      const emailRegex = /^[^@&"/()!_$*€£`+=;?#]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

      let userToken = userInLocalStorage.map(user => user.token);

      let userId = userInLocalStorage.map(user => user.userId);
      /*Toutes la dataEdit est copiée dans un objet*/
      const copy = Object.assign({}, this.dataEdit);
      /*Grâce à cet objet on peut créer une boucle qui va supprimer toutes les valeurs "null"*/
      /*On envoie "...copy" dans la requête à l'API et ainsi seules les valeurs complétées sont envoyées à l'API*/
      for(const key in copy) {
        if (copy[key] == null) {
          delete copy[key]
        }
      }

      if(emailRegex.test(this.dataEdit.email) == true || this.dataEdit.email == null) {

        axios.put(`http://localhost:3000/api/auth/${id}`, {
          ...copy, 
          userIdOrder: userId[0],
          }, { 
          headers: {
            Authorization: "Bearer " + userToken
          } 
        })
        .then(() => {  
          this.$store.dispatch('getUserInfos'); 
          alert('Le profil a été modifié');
        })
        .catch(() => { 
          alert('Impossible de modifier le profil');
        });

      } else {
        alert('Cet email n\'est pas disponible');
      }
    },
    editUserPassword() {
      const id = this.$route.params.id;
      /*le mot de passe doit contenir :
        - de 8 à 30 caractères
        - au moins une lettre minuscule
        - au moins une lettre majuscule
        - au moins un chiffre
        - au moins un de ces caractères spéciaux: $ @ % * + - _ !
        - aucun autre caractère possible: pas de & ni de {
        */
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,30})$/;

      let userToken = userInLocalStorage.map(user => user.token);

      let userId = userInLocalStorage.map(user => user.userId);

      if(this.passwordCheck.password == this.dataEdit.password) {

        if (passwordRegex.test(this.dataEdit.password) == true) {

          axios.put(`http://localhost:3000/api/auth/${id}`, {
            password: this.dataEdit.password,
            userIdOrder: userId[0],
            }, { 
            headers: {
              Authorization: "Bearer " + userToken
            } 
          })
          .then(()=> {  
            alert('Mot de passe modifié');
            this.$store.dispatch('getUserInfos');
          })
          .catch(() => { 
            alert('Impossible de modifier le mot de passe');
          })

        } else {
          alert('Votre mot de mot de passe doit contenir au moins : une lettre minuscule, une lettre majuscule, un chiffre, un de ces caractères spéciaux: $ @ % * + - _ ! et 8 à 30 caractères');
        }

      } else {
        alert('Veuillez entrer deux fois le même mot de passe !');
      }
      
    },
    editUserPicture() {
      const id = this.$route.params.id;

      let userToken = userInLocalStorage.map(user => user.token);

      let userId = userInLocalStorage.map(user => user.userId);
      /*Création d'un objet FormData pour envoyer l'image à l'API*/
      const formData = new FormData();
      /*Ajout de toutes clés et valeur à l'objet pour les envoyer à l'API*/
      formData.append("image", this.dataEdit.image);
      formData.append("userIdOrder", userId[0]);
      /*Test de la bonne récupération de l'image => console.log("test", formData.get("image"));*/

      /*On passe le formData dans la requête*/
      axios.put(`http://localhost:3000/api/auth/image/${id}`, formData, {
        headers: {
          Authorization: "Bearer " + userToken
        },
      })
      .then(() => {  
        this.$store.dispatch('getUserInfos');
        alert('Votre photo a été modifiée');
      })
      .catch(() => {
        alert('Veuillez sélectionner une photo de profil');
      });
    },
    deleteUser() {
      const id = this.$route.params.id;

      let userId = userInLocalStorage.map(user => user.userId);

      let userToken = userInLocalStorage.map(user => user.token);

      axios.delete(`http://localhost:3000/api/auth/${id}`, { 
        headers: {
          Authorization: "Bearer " + userToken
        }, 
        data: {
          userIdOrder: userId[0],
        }
      })
      .then(() => {
        localStorage.clear();
        this.$router.push('/');
      })
      .catch(() => {
        alert('Impossible de supprimer le profil');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  display:flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  h1 {
    text-align: left;
  }
  .delete-button {
    width: 25%;
  }
}

.container-edit {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-infos {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  background-color: #f2f2f2;
  padding: 5%;
  border-radius: 10px;
  align-items: center;
  justify-content: space-between;
  
}

.picture {
  display: flex;
  flex-direction: column;
  width: 50%;
  align-items: center;
  justify-content: center;
  label {
    margin-bottom: 10px;
  }
  input {
    margin-bottom: 10px;
  }
}

.user {
  display: flex;
  flex-direction: column;
  width: 50%;
  align-items: center;
  justify-content: center;
  &__input-infos {
    width: 100%;
    margin-bottom: 20px;
  }
  &__button {
    width:100%;
    border-radius: 10px;
  }
}

.form {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  background-color: #f2f2f2;
  padding: 5%;
  border-radius: 10px;
  &__input  {
    width:50%;
    margin-bottom: 20px;
  }
  &__button {
      width:50%;
      border-radius: 10px;
  }
}

.form-space {
  margin-top: 30px;
}

/*****************************/
/*VERSION MOBILE ET TABLETTE*/ 
/*****************************/

@media only screen and (max-width: 768px) {
.picture {
  width: 100%;
  margin-bottom: 20px;
}

.user {
  width: 100%;
  &__button {
    width: 50%;
    font-size: 12px;
  }
}

.form {
  &__input {
    width: 100%;
  }
  &__button {
    font-size: 12px;
  }
}

}

</style>
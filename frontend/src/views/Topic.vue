<template>
    <main>
        <div class="container-topic">
            <div class="container-topic__card" @click="this.$router.push('/multitopic')">
                <img src="../assets/multimedia-icon.png" alt="Illustration d'éléments multimédias">
                <h2>Viens partager tes photos et vidéos sur ce forum !</h2>
            </div>
            <div class="container-topic__card" @click="this.$router.push('/texttopic')">
                <img src="../assets/discussion-icon.png" alt="Illustration de conversation">
                <h2>Viens poser tes questions ou simplement discuter avec tes collègues sur ce forum !</h2>
            </div>
        </div>
    </main>
</template>

<script>
export default {

    mounted() {
        let userInLocalStorage = JSON.parse(localStorage.getItem('user'));
        
        if (userInLocalStorage == null) {
            this.$router.push('/')
        } 
    }
}
</script>

<style lang="scss" scoped> 
.container-topic {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    &__card {
        display: flex;
        flex-direction: column;
        width: 40%;
        background-color: #f2f2f2;
        padding: 10px;
        margin-top: 10%;
        border-radius: 30px;
        transform: scale(1);
        transition-duration: 500ms;
        transition-timing-function: ease-in-out;
        &:hover {
            cursor: pointer;
            transition-duration: 500ms;
            transition-timing-function: ease-in-out;
            transform: scale(1.05);
            animation-fill-mode: both;
        }
    }
}

/*****************************/
/*VERSION MOBILE ET TABLETTE**/ 
/*****************************/

@media only screen and (max-width: 480px) {
    .container-topic {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &__card {
            width: 90%;
        }
    }
}

</style>
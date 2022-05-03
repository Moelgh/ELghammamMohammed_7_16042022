<template>
    <div class="newcomments">
                <form class="newcomments__form">
                    <input type="text" class="newcomments__form--text" v-model="commentText" placeholder="Votre commentaire..." aria-label="Ecrivez ici votre commentaire" required>
                    <button id="btn" class="newcomments__form--btn" type="submit"><img class="comments__form--btn-img" src="../assets/send.svg" alt="Envoyer le commentaire"></button>
                </form>
    </div>
</template>

<script>


export default {
    name: 'NewComment',

    data() {
        return {
            input: {
                commentText: ''
            },
            comments: []
        }
    }

}
</script>

<style lang="scss" scoped>
.newcomments {
    width: 100%;
    &__form {
        width: 100%;
        height: 50px;
        text-align: left;
        display: flex;
        align-items: center;
    }
    &__form--btn {
        /*position: relative;*/
        /*right: 0px;*/
        width: 37px;
        height: 37px;
        margin: 0px !important;
        padding: 2px 2px 2px 2px !important;
        display: inline;
    }
    &__form--text {
        margin-bottom: 0px;
        width: 80%;
        margin-right: 5px;
        font-style: italic;
    }
}


</style>
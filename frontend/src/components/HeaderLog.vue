<template>
    <header>
        <div class="header__icon">
            <img src="../assets/icon.svg" alt="Logo de Groupomania">
            <p>Groupomania</p>
        </div>
  </header>
</template>

<script>
export default {
    name: "HeaderLog",
}
</script>


<style lang="scss" scoped>

.header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    max-width: 1024px;
    margin: auto;
    align-items: center;
    width: 100%;
    &__icon {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        img {
            max-height: 100px;
            width: auto;
        }
        p {
            font-size: 40px;
            color: red;
        }
    }
}

</style>
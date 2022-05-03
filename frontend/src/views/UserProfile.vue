<template>
    <Header />
    <router-link to="/" id="link" class="link-home">Accueil</router-link>
    <div class="page-container">
    <UserInfos />
    <UserPosts />
    </div>
</template>

<script>
import Header from '@/components/Header.vue'
import UserPosts from '@/components/UserPosts.vue'
import UserInfos from '@/components/UserInfos.vue'

export default {
    name: 'UserProfile',
    components: {
        Header,
        UserPosts,
        UserInfos,
    } 
}
</script>

<style scoped>
.page-container {
    margin: 40px auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid #FFD7D7 ;
    border-radius: 5px;
    background-color: #FFD7D7;
    box-shadow: 3px 3px #be9b9b ;

}
</style>
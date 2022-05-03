<template>
    <Header />
    <nav><router-link to="/" id="link" class="link-home">Accueil</router-link></nav>
    <main class="page-container"> 
        <UserInfos />  
        <UserPosts />
    </main> 
</template>

<script>
import Header from '@/components/Header.vue'
import UserPosts from '@/components/UserPosts.vue'
import UserInfos from '@/components/UserInfos.vue'
//import router from '../router'

export default {
    name: 'ToUserprofile',
    components: {
        Header,
        UserPosts,
        UserInfos,
    },


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

<template>
    <!--<router-link to="/">Home</router-link> |
    <router-link to="/signup">About</router-link>-->
  <router-view/>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #DB2600;
  //color: #2c3e50;
  box-sizing: border-box;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.btn {
  margin: 10px;
  padding: 10px;
  border: none;
  border-radius: 10px;
  box-shadow: 3px 3px #daC1c1;
  color: white;
  background-color: #DB2600;
  font-size: 17px;
  font-weight: bold;
  display: inline-block;
  margin: 15px auto; 
  transition: opacity 200ms, box-shadow 300ms;
  transition-delay: 0ms, 100ms;
  &:hover {
    opacity: 0.9;
    box-shadow: 3px 3px #a89292;
  }
}

body {
    box-sizing: border-box;
    margin: 0px;
    padding: 0px;
    display: block;
    width: 100%;
}

h1, p, label {
  color: #DB2600;
}

#container-form {
    max-width: 400px;
    margin: 70px auto;
    padding: 20px;
    border: 2px solid #FFD7D7;
    border-radius: 5px;
    box-shadow: 3px 3px #be9b9b ;
}
    @media screen and (max-width: 769px) {
        .container-form {
            margin: 70px auto;
        }
    }

#login-form {
    display: flex;
    flex-direction: column;
}
label {
        text-align: left;
        padding: 10px 0px 10px 0px;
        font-weight: bold;
}

input {
    height: 25px;
    max-width: 400px;
    border-radius: 5px;
    border: 2px inset #FFD7D7;
    margin-bottom: 10px;
}
#link {
  width:70px;
  text-align: center;
  color: #DB2600;
  font-size: 17px;
  font-weight: bold;
  margin: auto;
  text-decoration: none;
  padding: 10px;
  margin-top: 10px;
  transition: text-shadow 250ms;
  &:hover {
    text-shadow: 2px 2px #FFD7D7;
  }
}

#page-container {
    margin: 20px auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid #FFD7D7 ;
    border-radius: 5px;
    background-color: #FFD7D7;
    box-shadow: 3px 3px #be9b9b ;
}

</style>

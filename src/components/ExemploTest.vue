<template>
  <div>
    <h1>Primeiro Componente</h1>
    <q-input v-if="banana" class="q-gutter-md" style="max-width: 300px" v-model="text" label="Standard" />
    <q-btn color="primary" label="Salvar" @click="salvar()"/>
    {{text}}
  </div>
</template>

<script>
export default {
  data(){
    return {
      text:'',
      lista:[],
      numero:0,
      banana:true
    }
  },
  methods:{
   salvar() {
      alert(this.text)
      this.banana = !this.banana

     
   },
   outraFuncoa(){

   }
  }
}
</script>

<style scoped>

  h1 {
    text-align: center;
  }

</style>
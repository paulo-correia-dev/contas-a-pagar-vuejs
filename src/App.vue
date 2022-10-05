<template>

  <div id="base_cabeca">
    <div id="cabeca">
    
        <div id="titulo">
          <h1 >Lista de Contas: </h1>
        </div>
    
          <div id="tabela">
            <q-virtual-scroll
              type="table"
              style="max-height: 600px; background-color: whitesmoke; color: #9C9D7E; width: 100%; margin-right: 10px;"
              :virtual-scroll-item-size="48"
              :virtual-scroll-sticky-size-start="48"
              :virtual-scroll-sticky-size-end="32"
              :items="this.contas"
    
            >
              <template v-slot:before>
                <thead class="thead-sticky text-left">
                  <tr>
                    <th id="td">Índice</th>
                    <th id="td" v-for="col in columns" :key="col">

                      <div v-if="col == 'opcoes'">
                      
                        {{'OPÇÕES'}}
                      </div>
                      <div v-else-if="col == 'descricao'">
    
                        {{'DESCRIÇÃO'}}
                      </div>
                      <div v-else-if="col == 'data_vencimento'">
    
                        {{'DATA DE VENCIMENTO'}}
                      </div>
                      <div v-else-if="col == 'valor'">
                        {{'VALOR'}}
                      </div>
                      <div v-else-if="col == 'baixado'">
    
                        {{'PAGAMENTO'}}
                      </div>
                    </th>
                  </tr>
                </thead>
              </template>
              <template v-slot="{ item: linha, index }">
                <tr :key="index" >
                  <td id="td">#{{ index }}</td>
    
    
                  <td id="td" v-for="col in columns" :key="col">

                    <div v-if="col == 'opcoes'">

                      <q-btn id="botao_projetar" @click="projetar(linha)" color="blue-9" icon="edit" push style="margin-left: 10px; margin-top: 10px;"/>
                      <!--<q-btn id="botao_confirmar" @click="atualizar(linha)" color="green-10" icon="done" push style="margin-left: 10px; margin-top: 10px;"/>-->
                      <q-btn id="botao_confirmar" @click="excluir(linha)" color="red-10" icon="delete" push style="margin-left: 10px; margin-top: 10px;"/>
          
                    </div>
                    <div v-else-if="col == 'descricao'">
    
                      {{linha[col]}}
                    </div>
                    <div v-else-if="col == 'data_vencimento'">
                      {{linha['data_vencimento'].slice(8, 10) + '/' + linha['data_vencimento'].slice(5, 7)
                      + '/' + linha['data_vencimento'].slice(0, 4)}}
    
                    </div>
                    <div v-else-if="col == 'valor'">
                      {{"R$ " + linha[col]}}
                    </div>
                    <div v-else-if="col == 'baixado'">
    
                      <div v-if="linha[col] == true"> {{'PAGA'}} </div>
                      <div v-if="linha[col] == false"> {{'PENDENTE'}} </div>
    
                    </div>
    
                  </td>
                </tr>
              </template>
            </q-virtual-scroll>
          </div>
      </div>
  </div>
  

    <div id="cadastro">
      <div id="base_cadastro">

        <div id="desc_val">

          <q-input class="input_manual" v-model="conta_nova.descricao" label="Descrição:" stack-label :dense="dense"/>

          <q-input class="input_manual" v-model="conta_nova.valor" label="Valor da Conta:" stack-label :dense="dense"/>

        </div>
        
        <div id="data_status">
          <div id="data">
            <q-input filled v-model="date" mask="##/##/####" label="Data de Vencimento" color="brand">
              <template v-slot:append>
                <div class="q-pa-md">
                  <q-btn icon="event" round color="brand">
                    <q-popup-proxy @before-show="atualizarData" cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="dataSelecionada" mask="DD-MM-YYYY" color="brand" title="Data de Vencimento:" subtitle=' '>
                        <div class="row items-center justify-end q-gutter-sm">                          
                          <q-btn label="OK" color="brand" flat @click="save" v-close-popup />
                        </div> 
                      </q-date>
                    </q-popup-proxy>                    
                  </q-btn>
                </div>  
              </template>
            </q-input>
          </div>

          <div id="status">
            <q-toggle v-model="conta_nova.baixado" label="PAGA" style="width: 400px;" color="brand"/>
          </div>

        </div>
    
        <div id="cadastrar">
          <q-btn @click="cadastrar" push label="Cadastar" style="width: 100%; font-weight: bold;" color="brand"/>
        </div>

      </div>

    </div>

</template>

<script>

  import Conta from '@/services/contas' 
  import { ref } from 'vue'
  
  const columns = [
  
  'descricao',
  'data_vencimento',
  'valor',
  'baixado',
  'opcoes'
  ]

  var valor = 0.0
  valor = parseFloat(valor)

  
  export default{   

    data () {

    const date = ref('')
    const dataSelecionada = ref('')
    
      
      return {
        conta_nova: {
        descricao: '',
        data_vencimento: '',
        valor: valor,
        baixado: true
      
        },

        contas: [],

        columns,
        
        date,
      
        dataSelecionada,
        
        atualizarData () {
          dataSelecionada.value = date.value

        },
      
        save () {
          date.value = dataSelecionada.value
          
        }

      }
     
    },

    mounted () {

      this.listar()
      
    },
  
    methods: {

      listar(){

      Conta
      .listar('/consultarContas')
      .then(resposta => {
        console.log(resposta.data)
        this.contas = resposta.data[1]        
      })
      },

      cadastrar(){  
        
        this.datarBanco()
        
            
        Conta
        .cadastrar(this.conta_nova)
        .then(
        alert('Conta cadastrada com sucesso!')
        ) 

        this.limparCampos()
        this.listar()
      },

      atualizar(conta){

        this.datarBanco()
      
        conta = this.conta_nova

        Conta
        .atualizar(conta)
        .then(
          alert('Conta atualizada com sucesso!')
        )

        this.limparCampos()
        this.listar()
      },

      excluir(conta){
                
        Conta
        .excluir(conta.id)
        .then(
          alert('Conta excluída com sucesso!')
        )

        this.limparCampos()
        this.listar()
      },

      limparCampos(){

        this.conta_nova.descricao = ''
        this.date = ''
        this.conta_nova.valor = this.valor
        this.conta_nova.baixado = false
      },

      datarBanco(){

        var dataNova = this.date.split('/')
        dataNova = dataNova[2] + "-" + dataNova[1] + "-" + dataNova[0] 
        this.conta_nova.data_vencimento = dataNova
      },

      datarFormulario(conta){

        var dataObj = conta.data_vencimento.split('-')
        dataObj = dataObj[2] + "/" + dataObj[1] + "/" + dataObj[0] 
        this.date = dataObj
        
      },

      projetar(conta){
        
        this.conta_nova = conta
        this.datarFormulario(conta)

      }  
           
      }
  }

</script>

<style>

h1{
    
    color: #9C9D7E;
    font-family: 'Times New Roman', Times, serif;
    text-align: center;
  
  }
  #cadastro{
  
    height: 500px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #9C9D7E;
  }
  #base_cadastro{
  
    display: flex;
    flex-direction: column;
    height: 400px;
    align-items: center;
    background-color: whitesmoke;
    width: 95%;
    border-radius: 30px;
  }
  #edicao{

  height: 500px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #9C9D7E;
  }
  #base_edicao{

  display: flex;
  flex-direction: column;
  height: 400px;
  align-items: flex-start;
  background-color: whitesmoke;
  width: 95%;
  border-radius: 30px;
  }
  #cabeca{

    display: flex;
    flex-direction: row;
    align-items: center; 
    width: 95%;   
  }
  #base_cabeca{

    display: flex;
    height: 700px;
    background-color: #9C9D7E;
    justify-content: center;
    align-items: center;
  }
  #titulo{

    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: whitesmoke;
    margin-left: 5px;
    margin-right: 5px;
    border-radius: 10px;
  }
  #td{
  
    font-size: large;
  }
  #desc_val{
  
    display: flex;
    flex-direction: row;
    width: 90%;
    justify-content: space-between;
    margin-top: 50px;
  
  }
  .input_manual{
  
    width: 400px;
  }
  #data_status{

    display: flex;
    width: 90%;
    justify-content: space-between;
    margin-top: 50px;
    
  }
  #cadastrar{

    display: flex;
    width: 90%;
    justify-content: center;  
    margin-top: 50px;  
  }
  #tabela{

    width: 100%;
  }
  .text-brand {
  color: #9C9D7E !important;
  }
  .bg-brand {
  background: #9C9D7E !important;
  }
</style>  

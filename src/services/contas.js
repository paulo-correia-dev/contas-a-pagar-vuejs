import { api } from '@/services/config';

export default{

  listar(url){

    return api.get(url)
  },

  cadastrar(conta){
   return api.post('/cadastrarContas', conta)
  },

  atualizar(conta){
    return api.put('/atualizarContas', conta)
  },

  excluir(contaId){
    return api.delete('/excluirContas/' + contaId)
  }

}
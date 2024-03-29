import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/firebase-firestore';
import 'firebase/firebase-storage';
import { ServerStyleSheet } from 'styled-components';

import firebaseConfig from './JSONS/firebaseConfig';

const firebaseApp =  firebase.initializeApp(firebaseConfig);
const Auth =firebaseApp.auth();
const db = firebaseApp.firestore();
const storage = firebaseApp.storage();

export default {


  cadastroserv:async (EmailCad, SenhaCad, NomeCad, TelCad, CidadeCad, 
    EstadoCad, InstCad, ContaCad,  NomeGuerra, Patente) => {

            

              return await Auth.createUserWithEmailAndPassword(EmailCad, SenhaCad)
              .then( async () => {
                            const user =  await Auth.currentUser;
                            await user.sendEmailVerification();
                            const id = user.uid;

                                  if(ContaCad === "Lider") {

                                    return await db.collection("users").doc(id).set({
                                      patente:Patente,
                                      nomeGuerra:NomeGuerra,
                                      ocupado:false,
                                      tempAtiva: 0,
                                      ativaPerman:false,
                                      nome: NomeCad, 
                                      telefone: TelCad, 
                                      cidade: CidadeCad, 
                                      estado: EstadoCad, 
                                      instituicao: InstCad,
                                      conta:{ admin:{ativo:false, desbloqueado:false, tipo:""},
                                              app:{ativo:false, desbloqueado:false, tipo:""},
                                              NegApp:{ativo:false, desbloqueado:false, tipo:""},
                                              serv:{ativo:true, desbloqueado:false, tipo:ContaCad},
                                              servApp:{ativo:false, desbloqueado:false, tipo:"App"},
                                            },
                                      grupoid:"XUq86JOsd3YtxPRj9Qjy",
                                     
                                                
                                    })
                                    .then(() => {
                                            return db.collection("movimentacao").add({
                                              id: id,
                                              instituicao: InstCad,
                                              cidade: CidadeCad,
                                              estado: EstadoCad,
                                              telefone: TelCad,
                                              conta:ContaCad,
                                              acao:"criar",
                                              setor:"Cadastro conta serv",
                                              data: firebase.firestore.FieldValue.serverTimestamp(),
                                                
                                            })
                                          .then(async () => {
                                              return "ok";
                                        });
                                    });
                      
                                } else {

                                  
                                  return await db.collection("users").doc(id).set({
                                    nome: NomeCad, 
                                      telefone: TelCad, 
                                      cidade: CidadeCad, 
                                      estado: EstadoCad,
                                      tempAtiva: 0,
                                      ativaPerman:false, 
                                      instituicao: InstCad,
                                      conta:{ admin:{ativo:false, desbloqueado:false, tipo:""},
                                              app:{ativo:false, desbloqueado:false, tipo:""},
                                              NegApp:{ativo:false, desbloqueado:false, tipo:""},
                                              serv:{ativo:true, desbloqueado:false, tipo:ContaCad},
                                              servApp:{ativo:false, desbloqueado:false, tipo:"App"},
                                      
                                            },
                                      grupoid:"XUq86JOsd3YtxPRj9Qjy",
                                  })
                                  .then( () => {
                                          return db.collection("movimentacao").add({
                                            id: id,
                                            instituicao: InstCad,
                                            cidade: CidadeCad,
                                            estado: EstadoCad,
                                            telefone: TelCad,
                                            conta:ContaCad,
                                            acao:"criar",
                                            setor:"Cadastro conta serv",
                                            data: firebase.firestore.FieldValue.serverTimestamp(),
                                          })
                                        .then( () => {
                                            return "ok";
                                      });
                              });
                            }
                            })
                              .catch(error =>{
                                      if (error.code === 'auth/email-already-in-use') {
                                        return 'Esse endereço de email já esta em uso!';
                                      }

                                      if (error.code === 'auth/invalid-email') {
                                        return 'Esse endereço de e-mail é inválido!';
                                      }

                                      if (error.code === 'auth/operation-not-allowed') {
                                        return 'Tente novamente mais tarde!';
                                      }

                                      if (error.code === 'auth/weak-password') {
                                        return 'Digite uma senha melhor!';
                                      }
                              });
                          
                         
                        },

  LogandocontaServ:async (EmailCad, SenhaCad, setLoading, setDados) => {
    return await Auth.signInWithEmailAndPassword(EmailCad, SenhaCad).then( async() => {
            const autenticado =  await Auth.currentUser;
            const id = await autenticado.uid;
            const dados = await db.collection('users').doc(id).get();
            const result = await dados.data();
           
            const verificar = await autenticado.emailVerified;
            
              if( verificar === false ) {               
                  await localStorage.setItem('roma', "V23736478");
                  await localStorage.setItem('brasil', "serv");  
                  } else { 
                          if(result.conta.serv.desbloqueado === false){
                            await localStorage.setItem('roma', "B23987845");
                            await localStorage.setItem('brasil', "serv");
                                 setDados(result);
                                 setLoading(false);               
                          } else {                                  
                                    if(result.conta.serv.ativo === false) {
                                      await localStorage.setItem('roma', "A23569874");
                                      await localStorage.setItem('brasil', "serv");
                                      setDados(result);
                                      setLoading(false);
                                  } else {
                                    await localStorage.setItem('roma', "S23458765");
                                    await localStorage.setItem('brasil', "serv");
                                    setDados(result);
                                    setLoading(false);
                                    
                                        }
                                }         
                      }
        return "ok";
      }).catch(error => {
          if (error.code === 'auth/invalid-email') {
            return "Esse endereço de e-mail é inválido!";
           }
           if (error.code === 'auth/user-disabled') {
            return "Seu usuário está desativado!";
          }
          if (error.code === 'auth/user-not-found') {
            return "Não existe esse usuário!";
          }
          if (error.code === 'auth/wrong-password') {
            return  "E-mail e/ou senha errados!";
          }
    });
    
  },

  AtivarcontaServ: async()=> {
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;
   return await db.collection("users").doc(id).update({
      "conta.serv.ativo": true,
  })
  .then(() => {
      return "Atualizado com sucesso!";
  });

  },

  VariacaoTemp: async()=> {
   
    await Auth.onAuthStateChanged( async function(user) {
      if (user) {
        let now = new Date()
        const id = user.uid;
        const dados = await db.collection('TempVariacao').doc(id)
        .set({
          Servidor: firebase.firestore.FieldValue.serverTimestamp(),
          Sitema: now,
      })
      }
    });
   
  },

  VarTempPegar: async(Dados, setVaria)=> {
   
    await Auth.onAuthStateChanged( async function(user) {
      if (user) {
        const id = user.uid;
        const dados = await db.collection('TempVariacao')
        .doc(id).onSnapshot((doc) => {
          if(doc.data().Servidor){
            let Vari = doc.data().Servidor.seconds - doc.data().Sitema.seconds;
            setVaria(Vari);
          }
         
      });
      }
    });
   
  },

  AnliseDados: async(Dados, setDados, setLoading)=> {
   
    await Auth.onAuthStateChanged( async function(user) {
      if (user) {
      const id = user.uid;
      let res = {};
      const dados = await db.collection('users').doc(id)
      .onSnapshot((doc) => {
        if(doc.data()){

        let cid = doc.data().cidade;
        let est = doc.data().estado;
        let con = doc.data().conta;
        let nome = doc.data().nome;
        let tel = doc.data().telefone;
        let inst = doc.data().instituicao;
        let grupoid = doc.data().grupoid; 
        db.collection('gruposerv').doc(grupoid)
        .onSnapshot((doce) => {
          res ={
            cidade:cid, 
            estado: est,
            conta: con,
            nome: nome,
            telefone: tel,
            instituicao: inst,
            grupo:doce.data(),
          };
        
          setLoading(false);
          
          setDados(res);
          
      });
    }  
    });
     
     
      } else {
        console.log("não está logado");
        setLoading(false);
      }
    });
    
  },

  AtualizandoUsersServ: async(Nome, Telefone, Estado, Cidade, Inst, ContaTipo, setDados)=> {
    
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;
    const Setor = "Caixa de Edição Conta Serv";


    return await db.collection("users").doc(id).update({
      "nome": Nome,
      "telefone":Telefone,
    })
    .then(() => {
            return db.collection("movimentacao").add({
            id:id,
            instituicao: Inst,
            cidade: Cidade,
            estado: Estado,
            Conta:ContaTipo,
            acao:"Atualizar",
            setor: Setor,
            data:firebase.firestore.FieldValue.serverTimestamp(),
            })
          .then( () => {
              return db.collection('users').doc(id).get()
              .then( async (dados) => {
                const result = await dados.data();
                return result;
              });
              
        });
    });
    
  },

  ListServApp: async(Dados, setQuant, setUsuariosContServ, setCarreg )=> {
   
    await Auth.onAuthStateChanged( async function(user) {
      if (user) {
      const ID = user.uid;
      const Setor = "Lista de Apps Serv";
      const dados = await db.collection('users')
      .doc(ID).
      get()
      .then(async(dados)=>{
        const result = await dados.data();
       

          await db.collection("users")
          .where("estado", "==", result.estado)
          .where("cidade", "==", result.cidade)
          .where("instituicao", "==", result.instituicao)
          .where("conta.servApp.desbloqueado", "==", true)
            .onSnapshot((querySnapshot) => {
            setQuant(querySnapshot.size);
            var res = []; 
            querySnapshot.forEach((doc) => {
                res.push({
                  id: doc.id,
                  nome: doc.data().nome,
                  telefone: doc.data().telefone,
                  ativo: doc.data().conta.servApp.ativo,
                  nomeGuerra: doc.data().nomeGuerra? doc.data().nomeGuerra : "",
                  patente: doc.data().patente? doc.data().patente : "",
                  ativaPerman: doc.data().ativaPerman? doc.data().ativaPerman : "",
                  tempAtiva: doc.data().tempAtiva,
                  LocAtiva: doc.data().LocAtiva?doc.data().LocAtiva:false, 
                });      
            });
            console.log(res);
            setUsuariosContServ(res);
    
              });

          
        
   
       }); 
     
      } 
  
    });
    
    
  },

  LocRast: async(Cidade, Estado, setViat)=> {
    console.log(Cidade);
    console.log(Estado);
  //   db.collection("TestLoc").doc("joVmlQ9WO8mhaGGliRDS")
  //   .onSnapshot((doc) => {
  //     var tesV = doc.data().Loc.split(", ");
  //     var lati = parseFloat(tesV[0]);
  //     var longi =parseFloat(tesV[1]);
  //     setViat([{Loc:{lat:lati, lng:longi}, nome:"Renan"}])
  // });

    await db.collection("users")
    .where("LocAtiva", "==", true)
    .where("cidade", "==", Cidade)
    .where("estado", "==", Estado)
    .onSnapshot((querySnapshot) => {
      var cities = [];
      querySnapshot.forEach((doc) => {
          cities.push({
            id:doc.id,
           nome: doc.data().nome,
           Loc:doc.data().localizacao?doc.data().localizacao: null,
          });
      });
      setViat(cities)

    });

  },

  AtivandoApp: async(Id, Nome, Varia, TempAtiv, setAlertTipo, setAlert, )=> {
    let numberTem = parseInt(TempAtiv);
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;
    let temp = new Date().getTime();
    let now = temp + (Varia*1000);

    await db.collection("users")
    .where("ativaPerman", "==", true)
    .get().then((doc) => {
      console.log(doc.size)
      if (doc.size !== 0) {
          doc.forEach((doc) => {

            db.collection("chat").add({
              dateCriacao:now,
              ativo:true,
              idCriador:Id,
              nomeCriador:Nome,
              idSofrer:doc.id,
              userChat:[Id,doc.id],
              nomeSofrer:doc.data().nome,
              mensagem: [{autor:Id, 
                body:"Fui ativado agora e estou iniciando um chat com você",
                date:now,
                nome:Nome,
                type:"text" 
                  }],
              ultimaMsg:{data:now, id:Id, nome:Nome, msg:"Fui ativado agora e estou iniciando um chat com você"},
              vizualS:0,
              vizualC:0,
              digiC:false,
              digiS:false,
          })
          .then((docRef) => {
              
          })
 
        });
      } 
  }).catch((error) => {
      
  });

  await db.collection("users")
  .where("tempAtiva", "!=", 0)
  .get().then((doc) => {
    if (doc.size !== 0) {
        doc.forEach((doc) => {

          db.collection("chat").add({
            dateCriacao:now,
            ativo:true,
            idCriador:Id,
            nomeCriador:Nome,
            idSofrer:doc.id,
            nomeSofrer:doc.data().nome,
            userChat:[Id,doc.id],
            mensagem: [{autor:Id, 
              body:"Fui ativado agora e estou iniciando um chat com você",
              date:now,
              nome:Nome,
              type:"text" 
                }],
            ultimaMsg:{data:now, id:Id, nome:Nome, msg:"Fui ativado agora e estou iniciando um chat com você"},
            vizualS:0,
            vizualC:0,
            digiC:false,
            digiS:false,
        })
        .then((docRef) => {
            
        })

      });
    } 
}).catch((error) => {
    console.log("Error getting document:", error);
});

 await db.collection("users").doc(Id).update({
      "ativaPerman": false,
      "tempAtiva": numberTem,
      "conta.servApp.ativo": true,
  })
  .then(() => {
    setAlert("Ativado com sucesso!");
    setAlertTipo("success");
  });

  },

  AtivadoSempe: async( Id,  Nome, Varia, setAlertTipo, setAlert )=> {
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;
    let temp = new Date().getTime();
    let now = temp + (Varia*1000);


    await db.collection("users")
    .where("ativaPerman", "==", true)
    .get().then((doc) => {
      console.log(doc.size)
      if (doc.size !== 0) {
          doc.forEach((doc) => {

            db.collection("chat").add({
              dateCriacao:now,
              ativo:true,
              idCriador:Id,
              nomeCriador:Nome,
              idSofrer:doc.id,
              nomeSofrer:doc.data().nome,
              userChat:[Id,doc.id],
              mensagem: [{autor:Id, 
                body:"Fui ativado agora e estou iniciando um chat com você",
                date:now,
                nome:Nome,
                type:"text" 
                  }],
              ultimaMsg:{data:now, id:Id, nome:Nome, msg:"Fui ativado agora e estou iniciando um chat com você"},
              vizualS:0,
              vizualC:0,
              digiC:false,
              digiS:false,
          })
          .then((docRef) => {
              console.log("Document written with ID: ", docRef.id);
          })
 
        });
      } 
  }).catch((error) => {
      console.log("Error getting document:", error);
  });

  await db.collection("users")
  .where("tempAtiva", "!=", 0)
  .get().then((doc) => {
    if (doc.size !== 0) {
        doc.forEach((doc) => {

          db.collection("chat").add({
            dateCriacao:now,
            ativo:true,
            idCriador:Id,
            nomeCriador:Nome,
            idSofrer:doc.id,
            nomeSofrer:doc.data().nome,
            userChat:[Id,doc.id],
            mensagem: [{autor:Id, 
              body:"Fui ativado agora e estou iniciando um chat com você",
              date:now,
              nome:Nome,
              type:"text" 
                }],
            ultimaMsg:{data:now, id:Id, nome:Nome, msg:"Fui ativado agora e estou iniciando um chat com você"},
            vizualS:0,
            vizualC:0,
            digiC:false,
            digiS:false,
        })
        .then((docRef) => {
            
        })

      });
    } 
}).catch((error) => {
    console.log("Error getting document:", error);
});

  



    await db.collection("users").doc(Id).update({
      "ativaPerman": true,
      "tempAtiva":0,
      "conta.servApp.ativo": true,
  })
  .then(() => {

    setAlert("Ativado com sucesso!");
    setAlertTipo("success");
  });
   
  },
  BloqueandoAppServ: async(Dados, Id, setAlertTipo, setAlert)=> {
    
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;
    const Setor = "Bloquear App Serv";


    await db.collection("users").doc(Id).update({
      "conta.servApp.desbloqueado": false,
      "conta.serv.desbloqueado": false,
    })
    .then(() => {
            setAlert("Bloqueado Com Sucesso!");
            setAlertTipo("success");
             db.collection("movimentacao").add({
            id:id,
            instituicao: Dados.instituicao,
            cidade: Dados.cidade,
            estado: Dados.estado,
            Conta: Dados.conta.serv.tipo,
            acao:"Atualizar",
            setor: Setor,
            data:firebase.firestore.FieldValue.serverTimestamp(),
            idSofrer:Id,
            })
              
        });
    
  },

  DesbloqueandoAppServ: async(Dados, Id, setAlertTipo, setAlert)=> {
    
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;
    const Setor = "Desbloquear App Serv";


    await db.collection("users").doc(Id).update({
      "conta.servApp.desbloqueado": true,
      "tempAtiva":0,
      "ativaPerman":false,
    })
    .then(() => {
            setAlert("Desbloqueado Com Sucesso!");
            setAlertTipo("success");
             
              
        });
    
  },
  DesativandoAltoma: async()=> {
    
    const autenticado =  await Auth.currentUser;
    let temp = new Date().getTime();
  


    await db.collection("users")
    .where("tempAtiva", "!=", 0)
    .get().then((doc) => {
     
      if (doc.size !== 0) {
       
          doc.forEach(async(doc) => {
            if(doc.data().tempAtiva < temp){

              let Id = doc.id;
              await db.collection("chat")
              .where("userChat", "array-contains", Id)
              .get().then((doc) => {
                
                if (doc.size !== 0) {
                    doc.forEach((doc) => {
          
                      db.collection("chat").doc(doc.id).update({
                        "ativo": false,
                    })
                    
           
                  });
                } 
            }).catch((error) => {
               
            });
          
              await db.collection("users").doc(Id).update({
                "ativaPerman": false,
                "tempAtiva":0,
                "conta.servApp.ativo": false,
            })
            .then(() => {
              
            });


            }
        });


      } 
  }).catch((error) => {
     
  });

    
  },

  DesativandoApp: async(Dados, Id, setAlertTipo, setAlert)=> {
   
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;

    await db.collection("chat")
    .where("userChat", "array-contains", Id)
    .get().then((doc) => {
      console.log(doc.size)
      if (doc.size !== 0) {
          doc.forEach((doc) => {

            db.collection("chat").doc(doc.id).update({
              "ativo": false,
          })
          
 
        });
      } 
  }).catch((error) => {
     
  });


    await db.collection("users").doc(Id).update({
      "ativaPerman": false,
      "tempAtiva":0,
      "conta.servApp.ativo": false,
  })
  .then(() => {
    setAlert("Desativado com sucesso!");
    setAlertTipo("success");
  });
   
    
  },

  DesativandoLoc: async( item, setAlertTipo, setAlert)=> {
   
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;



    await db.collection("users").doc(item).update({
      "LocAtiva": false,
      
  })
  .then(() => {
    setAlert("Desativado Localização com sucesso!");
    setAlertTipo("success");
  });
   
    
  },

  AtivandoLoc: async( item, setAlertTipo, setAlert)=> {
   
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;



    await db.collection("users").doc(item).update({
      "LocAtiva": true,
      
  })
  .then(() => {
    setAlert("Ativado Localização com sucesso!");
    setAlertTipo("success");
  });
   
    
  },


  VizualizarApp: async(Id, Dados, setInfor)=> {

    await Auth.onAuthStateChanged( async function(user) {
      if (user) {
      const ID = user.uid;
      const Setor = "Vizualizar App Serv";
      await db.collection("users")
      .doc(Id)
      .get()
      .then((doc)=>{
          setInfor(doc.data());
          db.collection("movimentacao").add({
            id:ID,
            instituicao: Dados.instituicao,
            cidade: Dados.cidade,
            estado: Dados.estado,
            Conta: Dados.conta.serv.tipo,
            acao:"Vizualizar",
            setor: Setor,
            data:firebase.firestore.FieldValue.serverTimestamp(),
            idSofrer:Id,
            })
      })

      }
  
    });
    
    
  },

  ListCondicionais: async(Dados, setQuant, setUsuariosContServ)=> {
   
    await Auth.onAuthStateChanged( async function(user) {
      if (user) {
      const ID = user.uid;
      const Setor = "Lista de Condicionais";
      const dados = await db.collection('users')
      .doc(ID).
      get()
      .then(async(dados)=>{
        const result = await dados.data();
        await db.collection("movimentacao").add({
          id:ID,
          instituicao: result.instituicao,
          cidade: result.cidade,
          estado: result.estado,
          Conta: result.conta.serv.tipo,
          acao:"Vizualizar",
          setor: Setor,
          data:firebase.firestore.FieldValue.serverTimestamp(),
          });

          await db.collection("condicionais")
          .where("estado", "==", result.estado)
          .where("cidade", "==", result.cidade)
          .where("instituicao", "==", result.instituicao)
            .onSnapshot((querySnapshot) => {
            setQuant(querySnapshot.size);
            var res = []; 
            querySnapshot.forEach((doc) => {
                res.push({
                  id: doc.id,
                  nome: doc.data().nome,
                  ativo: doc.data().ativo,
    
                });      
            });
            setUsuariosContServ(res);
    
              });

          
        
   
       }); 
     
      } 
  
    });
    
    
  },
  ListAnuncio: async(Dados, setQuant, setUsuariosContServ)=> {
   
    await Auth.onAuthStateChanged( async function(user) {
      if (user) {
      const ID = user.uid;
      const Setor = "Lista de Condicionais";
      const dados = await db.collection('users')
      .doc(ID).
      get()
      .then(async(dados)=>{
        const result = await dados.data();
       
          await db.collection("anuncios")
          .where("estado", "==", result.estado)
          .where("cidade", "==", result.cidade)
          .where("instituicao", "==", result.instituicao)
            .onSnapshot((querySnapshot) => {
            setQuant(querySnapshot.size);
            var res = []; 
            querySnapshot.forEach((doc) => {
                res.push({
                  id: doc.id,
                  nome: doc.data().nome,
                  ativo: doc.data().ativo,
                  visita: doc.data().visitas,
                });      
            });
            setUsuariosContServ(res);
    
              });

          
        
   
       }); 
     
      } 
  
    });
    
    
  },


  CriarCondicionalServ: async(Dados, Nome, setAlertTipo, setAlert)=> {
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;
    const Setor = "Criar Condicional Serv";
    await db.collection("condicionais")
          .where("estado", "==", Dados.estado)
          .where("cidade", "==", Dados.cidade)
          .where("instituicao", "==", Dados.instituicao)
          .where("nome", "==", Nome)
          .get()
          .then((doc)=>{
            
              if(doc.size === 0){
                db.collection("condicionais").add({
                  nome:Nome,
                  criador:id,
                  dataCriar:firebase.firestore.FieldValue.serverTimestamp(),
                  estado:Dados.estado,
                  cidade:Dados.cidade,
                  instituicao: Dados.instituicao,
                  ativo:true
                  }).then((doc)=>{
                    const res= doc.id;
                    setAlert("Criado com Sucesso");
                    setAlertTipo("success");
                    db.collection("movimentacao").add({
                      id:id,
                      instituicao: Dados.instituicao,
                      cidade: Dados.cidade,
                      estado: Dados.estado,
                      Conta: Dados.conta.serv.tipo,
                      acao:"Criar",
                      setor: Setor,
                      data:firebase.firestore.FieldValue.serverTimestamp(),
                      idSofrer:res,
                      })
                  });
                
              } else {
                setAlert("Esse Nome de Condicional já existe!");
                setAlertTipo("danger");
              }
          });


      
  },

  EditandoCondicional: async(Dados, Id, NomeEdit, setAlert, setAlertTipo)=> {
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;
    const Setor = "Editar Condicional Serv";
    await db.collection("condicionais").doc(Id).update({
      "nome":NomeEdit,
    }).then(()=>{
      setAlert("Editado com Sucesso");
      setAlertTipo("success");
      db.collection("movimentacao").add({
        id:id,
        instituicao: Dados.instituicao,
        cidade: Dados.cidade,
        estado: Dados.estado,
        Conta: Dados.conta.serv.tipo,
        acao:"Atualizar",
        setor: Setor,
        data:firebase.firestore.FieldValue.serverTimestamp(),
        idSofrer:Id,
        })

    })
  },

  DesativandoCondicional: async(Dados, Id, setAlertTipo, setAlert)=> {
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;
    const Setor = "Desativando Condicional Serv";
    await db.collection("condicionais").doc(Id).update({
     "ativo":false, 
    }).then(()=>{
      setAlert("Desativado com Sucesso");
      setAlertTipo("success");
      db.collection("movimentacao").add({
        id:id,
        instituicao: Dados.instituicao,
        cidade: Dados.cidade,
        estado: Dados.estado,
        Conta: Dados.conta.serv.tipo,
        acao:"Atualizar",
        setor: Setor,
        data:firebase.firestore.FieldValue.serverTimestamp(),
        idSofrer:Id,
        })

    });
  },

  AtivandoCondicional: async(Dados, Id, setAlertTipo, setAlert)=> {
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;
    const Setor = "Ativando Condicional Serv";
    await db.collection("condicionais").doc(Id).update({
     "ativo":true, 
    }).then(()=>{
      setAlert("Ativado com Sucesso");
      setAlertTipo("success");
      db.collection("movimentacao").add({
        id:id,
        instituicao: Dados.instituicao,
        cidade: Dados.cidade,
        estado: Dados.estado,
        Conta: Dados.conta.serv.tipo,
        acao:"Atualizar",
        setor: Setor,
        data:firebase.firestore.FieldValue.serverTimestamp(),
        idSofrer:Id,
        })

    });
  },

  ListContasServ: async(Dados, setQuant, setUsuariosContServ)=> {
   
    await Auth.onAuthStateChanged( async function(user) {
      if (user) {
      const ID = user.uid;
      const Setor = "Lista Conta Serv";
      const dados = await db.collection('users')
      .doc(ID).
      get()
      .then(async(dados)=>{
        const result = await dados.data();
      

          await db.collection("users")
          .where("estado", "==", result.estado)
          .where("cidade", "==", result.cidade)
          .where("instituicao", "==", result.instituicao)
          .where("conta.serv.tipo", 'in', ['Lider', "Subordinada"])
            .onSnapshot((querySnapshot) => {
            setQuant(querySnapshot.size);
            var res = []; 
            querySnapshot.forEach((doc) => {
                res.push({
                  id: doc.id,
                  nome: doc.data().nome,
                  nomeGuerra: doc.data().nomeGuerra? doc.data().nomeGuerra : "",
                  patente: doc.data().patente? doc.data().patente : "",
                  desbloqueado: doc.data().conta.serv.desbloqueado,
    
                });      
            });
            setUsuariosContServ(res);
    
              });

          
        
   
       }); 
     
      } 
  
    });
    
    
  },


  ListAppServ: async(Dados, setQuantApp, setUsuarioApp)=> {
   
    await Auth.onAuthStateChanged( async function(user) {
      if (user) {
      const ID = user.uid;
      const Setor = "Lista Conta Serv";
      const dados = await db.collection('users')
      .doc(ID).
      get()
      .then(async(dados)=>{
        const result = await dados.data();
          await db.collection("users")
          .where("conta.servApp.tipo", "==", "App")
            .onSnapshot((querySnapshot) => {
            setQuantApp(querySnapshot.size);
            var res = []; 
            querySnapshot.forEach((doc) => {
                res.push({
                  id: doc.id,
                  nome: doc.data().nome,
                  telefone: doc.data().telefone,
                  desbloqueado: doc.data().conta.servApp.desbloqueado,
                  ativo: doc.data().conta.servApp.ativo,
    
                });      
            });
            setUsuarioApp(res);
    
              });

          
        
   
       }); 
     
      } 
  
    });
    
    
  },

  VizualizandoContas: async(Id, Dados, setInfor)=> {
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;
    const Setor = "Vizualizar Conta Serv";
    let res = {};
    await db.collection("users").doc(Id)
    .onSnapshot((doc) => {
       let cid = doc.data().cidade;
        let est = doc.data().estado;
        let con = doc.data().conta;
        let nome = doc.data().nome;
        let tel = doc.data().telefone;
        let inst = doc.data().instituicao;
        let grupoid = doc.data().grupoid; 
        db.collection('gruposerv').doc(grupoid)
        .onSnapshot((doce) => {
          res ={
            cidade:cid, 
            estado: est,
            conta: con,
            nome: nome,
            telefone: tel,
            instituicao: inst,
            grupo:doce.data(),
          };
          console.log(res)
        setInfor(res);
      });
    });

    await db.collection("movimentacao").add({
      id:id,
      instituicao: Dados.instituicao,
      cidade: Dados.cidade,
      estado: Dados.estado,
      Conta: Dados.conta.serv.tipo,
      acao:"Vizualizar",
      setor: Setor,
      data:firebase.firestore.FieldValue.serverTimestamp(),
      });
    
  },

  VizualizandoNoti: async(Id, Dados, setInfor)=> {
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;
    const Setor = "Vizualizar Conta Serv";
    await db.collection("noticias").doc(Id)
    .onSnapshot((doc) => {
        setInfor(doc.data());
    });
 
  },
  
  VizualizandoAnun: async(Id, Dados, setInfor, setNoticia)=> {
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;
    await db.collection("anuncios").doc(Id)
    .onSnapshot((doc) => {
        setInfor(doc.data());
    });

    await db.collection("noticias")
    .where("estado", "==", "Maranhão" )
    .where("cidade", "==", "Bacabal")
    .where("instituicao", "==", "Polícia Militar")
    .get()
    .then((querySnapshot) => {
      var res = []; 
      querySnapshot.forEach((doc) => {
       
          res.push({
            id: doc.id,
            dateNoti: doc.data().dataDanoti,
            titulo: doc.data().TituloAnun,
          });    
       
      });
     

      res.sort((a,b)=>{
        if(a.dateNoti < b.dateNoti) {
          return 1;
        } else {
          return -1;
        }
      });
    console.log(res);
      setNoticia(res);
    

        });
 
  },

  VizualizandoOcorren: async(Id, Dados, setInfor)=> {
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;
    const Setor = "Vizualizar Conta Serv";
    await db.collection("ocorrencia").doc(Id)
    .onSnapshot((doc) => {
        setInfor(doc.data());
    });

 
    
  },

  BloqueandoContas: async(Dados, Id, setAlertTipo, setAlert)=> {
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;
    const Setor = "Bloqueando Conta Serv";
    await db.collection("users")
    .doc(Id)
    .update({ 
      "conta.serv.desbloqueado": false,
      "conta.servApp.desbloqueado": false,
    }).then(()=>{
      setAlertTipo("success");
      setAlert("Bloqueado com sucesso!")
      db.collection("movimentacao").add({
        id:id,
        instituicao: Dados.instituicao,
        cidade: Dados.cidade,
        estado: Dados.estado,
        Conta: Dados.conta.serv.tipo,
        acao:"Atualizar",
        setor: Setor,
        data:firebase.firestore.FieldValue.serverTimestamp(),
        idSofrer:Id,
        });
    });

    
    
  },

  CriarGrupo: async(Dados, Nome, Valor, setAlertTipo, setAlert, setAlert1, setAlertTipo1)=> {
    const autenticado =  await Auth.currentUser;
    const id = await autenticado.uid;
    const Setor = "Criando Grupo Serv";
    await db.collection("gruposerv")
          .where("estado", "==", Dados.estado)
          .where("cidade", "==", Dados.cidade)
          .where("instituicao", "==", Dados.instituicao)
          .where("nome", "==", Nome)
          .get()
          .then(async(doc)=>{
            
              if(doc.size === 0){
                await db.collection("gruposerv").add({
                  id_criador:id,
                  nome:Nome,
                  dataCriar:firebase.firestore.FieldValue.serverTimestamp(),
                  estado:Dados.estado,
                  cidade:Dados.cidade,
                  instituicao: Dados.instituicao,
                  menu:Valor,
                  }).then((doc)=>{
                    const res= doc.id;
                    setAlert("Criado com Sucesso");
                    setAlertTipo("success");
                    db.collection("movimentacao").add({
                      id:id,
                      instituicao: Dados.instituicao,
                      cidade: Dados.cidade,
                      estado: Dados.estado,
                      Conta: Dados.conta.serv.tipo,
                      acao:"Criar",
                      setor: Setor,
                      data:firebase.firestore.FieldValue.serverTimestamp(),
                      idSofrer:res,
                      })
                  });
                
              } else {
                setAlert1("Esse Nome de Grupo já existe!");
                setAlertTipo1("danger");
              }
          });


  },

  ListGrupos: async(Dados, setQuant, setUsuariosContServ)=> {
   
    await Auth.onAuthStateChanged( async function(user) {
      if (user) {
      const ID = user.uid;
      const Setor = "Lista Grupos Serv";
      const dados = await db.collection('users')
      .doc(ID).
      get()
      .then(async(dados)=>{
        const result = await dados.data();
        await db.collection("movimentacao").add({
          id:ID,
          instituicao: result.instituicao,
          cidade: result.cidade,
          estado: result.estado,
          Conta: result.conta.serv.tipo,
          acao:"Vizualizar",
          setor: Setor,
          data:firebase.firestore.FieldValue.serverTimestamp(),
          });

          await db.collection("gruposerv")
          .where("estado", "==", result.estado)
          .where("cidade", "==", result.cidade)
          .where("instituicao", "==", result.instituicao)
            .onSnapshot((querySnapshot) => {
            setQuant(querySnapshot.size);
            var res = []; 
            querySnapshot.forEach((doc) => {
                res.push({
                  id: doc.id,
                  nome: doc.data().nome,   
                });      
            });
            setUsuariosContServ(res);
    
              });

          
        
   
       }); 
     
      } 
  
    });
    
    
  },

  ListRotasVtr: async(IdVtr, DataA, DataD, setListRotaVt, setVerRtVt, setLoading)=> {
   
          console.log(DataA)
          console.log(DataD)
          console.log(IdVtr)
      
          await db.collection("rotas")
            .where("Id", "==", IdVtr)
            .where("date", ">=", DataA)
            .where("date", "<=", DataD)
            .get().then((querySnapshot) => {
              console.log(querySnapshot.size)
              var res = []
            querySnapshot.forEach((doc) => {

              let currentDate = '';
            let now =new Date(doc.data().date);
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let Dia = now.getDate();
            let Mes = (now.getMonth()+1);
            let Ano = now.getFullYear(); 
            hours = hours < 10 ? '0'+hours : hours;
            minutes = minutes < 10 ? '0'+minutes : minutes;
            Dia = Dia < 10 ? '0'+Dia : Dia;
            Mes = Mes < 10 ? '0'+Mes : Mes;
            currentDate = Dia+'/'+Mes+'/'+Ano;
            currentDate += ' ';
            currentDate += hours+':'+minutes;

               res.push({
                localizacao:doc.data().localizacao,
                date:currentDate,
              }) 
            });

            setListRotaVt(res)

              }).then(()=>{
                setLoading(false);
                setVerRtVt(true);

              });

          
        
  
     
     
  
  
    
    
  },

  ListOcorr: async(Dados, setQuant, setUsuariosContServ, setCarreg, Dat, Dat2)=> {
    console.log(Dat);
    console.log(Dat2);
   let Antes = Dat/1000;
   let Depois = Dat2/1000;
    await Auth.onAuthStateChanged( async function(user) {
      if (user) {
      const ID = user.uid;
      const Setor = "Lista Grupos Serv";
      const dados = await db.collection('users')
      .doc(ID).
      get()
      .then(async(dados)=>{
        const result = await dados.data();
          console.log(Dat);
          console.log(Dat2);
          await db.collection("ocorrencia")
            .where("dataInicio.seconds", ">=", Antes)
            .where("dataInicio.seconds", "<=", Depois)
            .get().then((querySnapshot) => {
            setQuant(querySnapshot.size);
            var res = []; 
            querySnapshot.forEach((doc) => {
              if(doc.data().dataInicio){
                res.push({
                  id: doc.id,
                  date: doc.data().dataInicio.seconds,
                  ativo: doc.data().ativo, 
                  dateIn: doc.data().dataInicio.seconds*1000,
                  condi: doc.data().condicionais,
                  bairro: doc.data().bairro,
                  resultado:doc.data().resultado,
                  rua:doc.data().rua,
                  vtr:doc.data().vtr,
                  atendenteCopom:doc.data().atendenteCopom,
                  componentesVtr: doc.data().componentesVtr,
                  conduzidos: doc.data().conduzidos,
                  vitimas: doc.data().vitimas,
                  objetosApre: doc.data().objetosApre,
                  excluir: doc.data().excluir,
                  periodo:doc.data().periodo,
                  numero:doc.data().numero,
                  oCorr:doc.data().Ocorr,
                  InfVeiculo:doc.data().InfVeiculo?doc.data().InfVeiculo: "" ,
                  PlacaVeiculo:doc.data().PlacaVeiculo?doc.data().PlacaVeiculo: [] ,
                  ChassisVeiculo:doc.data().ChassisVeiculo?doc.data().ChassisVeiculo:[] ,
                });    
              }
              setCarreg(false);    
            });

            res.sort((a,b)=>{
              if(a.date < b.date) {
                return 1;
              } else {
                return -1;
              }
            });
          
            setUsuariosContServ(res);
            
    
              });

          
        
   
       }); 
     
      } 
  
    });
    
    
  },

 

  ListNoti: async(Dados, setQuant, setUsuariosContServ, setCarreg)=> {
   
    await Auth.onAuthStateChanged( async function(user) {
      if (user) {
      const ID = user.uid;
      const Setor = "Lista Grupos Serv";
      const dados = await db.collection('users')
      .doc(ID).
      get()
      .then(async(dados)=>{
        const result = await dados.data();

          await db.collection("noticias")
          .where("estado", "==", result.estado)
          .where("cidade", "==", result.cidade)
          .where("instituicao", "==", result.instituicao)
            .onSnapshot((querySnapshot) => {
            setQuant(querySnapshot.size);
            var res = []; 
            querySnapshot.forEach((doc) => {
             
                res.push({
                  id: doc.id,
                  dateNoti: doc.data().dataDanoti,
                  titulo: doc.data().TituloAnun,
                  body:doc.data().body,
                  ativo:doc.data().ativo,
                  visitas:doc.data().visitas,
                });    
              setCarreg(false);    
            });

            res.sort((a,b)=>{
              if(a.dateNoti < b.dateNoti) {
                return 1;
              } else {
                return -1;
              }
            });
          
            setUsuariosContServ(res);
            
    
              });

          
        
   
       }); 
     
      } 
  
    });
    
    
  },
  

DadosGruposServ: async(Dados, Id, setInfor)=> {
  const autenticado =  await Auth.currentUser;
  const id = await autenticado.uid;
  const Setor = "Vizualizar Grupo Serv";
  await db.collection("gruposerv").doc(Id)
  .onSnapshot((doc) => {
      setInfor(doc.data().menu);
  });

  await db.collection("movimentacao").add({
    id:id,
    instituicao: Dados.instituicao,
    cidade: Dados.cidade,
    estado: Dados.estado,
    Conta: Dados.conta.serv.tipo,
    acao:"Vizualizar",
    setor: Setor,
    data:firebase.firestore.FieldValue.serverTimestamp(),
    });
  
},

EditarGrupo: async(Dados, Id, nome, Valor, setAlertTipo, setAlert)=> {
  const autenticado =  await Auth.currentUser;
  const id = await autenticado.uid;
  const Setor = "Editando Grupo Serv";
  await db.collection("gruposerv").doc(Id).update({
    "nome":nome,
    "menu":Valor,
    }).then((doc)=>{

     const colle =  db.collection("users")
     colle.where('grupo.id', '==', Id).get().then(response => {
      let batch = db.batch()
      response.docs.forEach((doc) => {
          const docRef = db.collection("users").doc(doc.id)
          batch.update(docRef, {"grupo.nome":nome, "grupo.menu":Valor})
      })
      batch.commit().then(() => {
        setAlert("Editado com Sucesso!");
        setAlertTipo("success");
      })
  })

      

    });

},


    Gruposconta: async(Dados, setListGrupo)=> {
      await db.collection("gruposerv")
      .where("estado", "==", Dados.estado)
      .where("cidade", "==", Dados.cidade)
      .where("instituicao", "==", Dados.instituicao)
        .onSnapshot((querySnapshot) => {
        var res = []; 
        querySnapshot.forEach((doc) => {
            res.push({
              id: doc.id,
              select: doc.data().nome,   
            });      
        });
       
        setListGrupo(res);
      
          });
      
    },

    Condconta: async(Dados, setListCond)=> {
      await db.collection("condicionais")
      .where("estado", "==", "Maranhão")
      .where("cidade", "==", "Bacabal")
      .where("instituicao", "==", "Polícia Militar")
        .onSnapshot((querySnapshot) => {
        var res = []; 
        querySnapshot.forEach((doc) => {
            res.push({
              id: doc.id,
              select: doc.data().nome,   
            });      
        });
        setListCond(res);
      
          });
      
    },

    MudAtivo: async(IdVtr, setAtiVtr, setAlert, setAlertTipo)=> {
     
      await db.collection("servAtivo")
      .where("IdUser", "==", IdVtr)
      .get()
      .then((querySnapshot) => {
       if(querySnapshot.size !== 0 ){
        let res = "";
        querySnapshot.forEach((doc) => {
          res = doc.id;           
        });
         db.collection("servAtivo")
        .doc(res)
        .update({
        "Ativo":1,
        }).then(()=>{
          setAlert("Espere Um Momento para Analise!");
          setAlertTipo("success");
        });

       } else {
        db.collection("servAtivo").add({
          IdUser: IdVtr,
          Ativo:1,
      })
      .then((docRef) => {
        setAlert("Espere Um Momento para Analise!");
        setAlertTipo("success");
      })
        
       }
      

        
        
      });
        
    },

    VendoAtivo: async(IdVtr, setAtiVtr)=> {
     
      await db.collection("servAtivo")
      .where("IdUser", "==", IdVtr)
      .onSnapshot((querySnapshot) => {
       if(querySnapshot.size !== 0 ){
        let res = 1;

        querySnapshot.forEach((doc) => {
          res = doc.data().Ativo;           
        });
        
        setAtiVtr(res)
       } else {
        setAtiVtr(1)
        
       }
      

        
        
      });
        
    },
    
    DesbloquearConta: async(Dados, Id, Grupo, setAlert, setAlertTipo)=> {
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
      const Setor = "Desbloqueando Conta Serv";
      await db.collection("gruposerv")
      .where("estado", "==", Dados.estado)
      .where("cidade", "==", Dados.cidade)
      .where("instituicao", "==", Dados.instituicao)
      .where("nome", "==", Grupo)
      .get()
      .then((querySnapshot) => {
       
       let res = "";

        querySnapshot.forEach((doc) => {
          res = doc.id;           
        });
         db.collection("users")
        .doc(Id)
        .update({
         "grupoid": res,
          "conta.serv.desbloqueado": true,
          "conta.servApp.desbloqueado": true,
          "tempAtiva":0,
          "ativaPerman":false,
        }).then(()=>{
          setAlert("Desbloqueado com Sucesso!");
          setAlertTipo("success");
          db.collection("movimentacao").add({
            id:id,
            instituicao: Dados.instituicao,
            cidade: Dados.cidade,
            estado: Dados.estado,
            Conta: Dados.conta.serv.tipo,
            acao:"Atualizar",
            setor: Setor,
            data:firebase.firestore.FieldValue.serverTimestamp(),
            idSofrer:Id,
            })
        });
        
      });
        
    },

    DadosdeGraficos: async(Dados, ListDias, setListDados, setListLoc, QuatD,  setLoading )=> {
      
      let list = [];
      let listCod = [];
      for (var i = 0; i < QuatD; i++) {
        let march = i+1;
        let Antes = ListDias[i]/1000;
        let Depois = ListDias[march]/1000;

      await db.collection("ocorrencia")
      .where("dataInicio.seconds", ">=", Antes)
      .where("dataInicio.seconds", "<=", Depois)
      .get()
      .then((querySnapshot) => {
          

        list.push(
          querySnapshot.size,
          );  
         

        querySnapshot.forEach((doc) => {
           
          listCod.push({
            Loc:doc.data().localizacao,
            cidade:doc.data().cidade,
            estado:doc.data().estado,
            id: doc.id,
            date: doc.data().dataInicio.seconds,
            ativo: doc.data().ativo, 
            dateIn: doc.data().dataInicio.seconds*1000,
            condi: doc.data().condicionais,
            bairro: doc.data().bairro,
            resultado:doc.data().resultado,
            rua:doc.data().rua,
            vtr:doc.data().vtr,
            atendenteCopom:doc.data().atendenteCopom,
            componentesVtr: doc.data().componentesVtr,
            conduzidos: doc.data().conduzidos,
            vitimas: doc.data().vitimas,
            objetosApre: doc.data().objetosApre,
            excluir: doc.data().excluir,
            periodo:doc.data().periodo,
            numero:doc.data().numero,
            oCorr:doc.data().Ocorr,
          });  
               
        });
       
      });
      }

     
    setListLoc(listCod);
    setListDados(list);
    setLoading(false)

      // await db.collection("gruposerv")
      // .where("estado", "==", Dados.estado)
      // .where("cidade", "==", Dados.cidade)
      // .where("instituicao", "==", Dados.instituicao)
      // .where("nome", "==", Grupo)
      // .get()
      // .then((querySnapshot) => {
       
      //  const res = [];

      //   querySnapshot.forEach((doc) => {
      //     res.push({
      //       id: doc.id,
      //       menu: doc.data().menu,   
      //     });             
      //   });
       
      
        
      // });
        
    },

    TelefoneCriar: async(Dados, Telefone, setAlert, setAlertTipo)=> {
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
      const Setor = "Criar Telefone Serv";
      await db.collection("telefone")
      .add({
        numero:Telefone,
        ativo:true,
        cidade:Dados.cidade,
        estado: Dados.estado,
        instituicao: Dados.instituicao,
      }).then((doc)=>{
        setAlert("Telefone criado com Sucesso!");
          setAlertTipo("success");
        const res = doc.id;
        db.collection("movimentacao").add({
          id:id,
          instituicao: Dados.instituicao,
          cidade: Dados.cidade,
          estado: Dados.estado,
          Conta: Dados.conta.serv.tipo,
          acao:"Criar",
          setor: Setor,
          data:firebase.firestore.FieldValue.serverTimestamp(),
          idSofrer:res,
          })
      })

    },

    ListTelefone: async(Dados, setQuant, setUsuariosContServ)=> {
   
      await Auth.onAuthStateChanged( async function(user) {
        if (user) {
        const ID = user.uid;
        const Setor = "Lista Telefone Serv";
        const dados = await db.collection('users')
        .doc(ID).
        get()
        .then(async(dados)=>{
          const result = await dados.data();
          await db.collection("movimentacao").add({
            id:ID,
            instituicao: result.instituicao,
            cidade: result.cidade,
            estado: result.estado,
            Conta: result.conta.serv.tipo,
            acao:"Vizualizar",
            setor: Setor,
            data:firebase.firestore.FieldValue.serverTimestamp(),
            });
  
            await db.collection("telefone")
            .where("estado", "==", result.estado)
            .where("cidade", "==", result.cidade)
            .where("instituicao", "==", result.instituicao)
              .onSnapshot((querySnapshot) => {
              setQuant(querySnapshot.size);
              var res = []; 
              querySnapshot.forEach((doc) => {
                  res.push({
                    id: doc.id,
                    numero: doc.data().numero,
                    ativo: doc.data().ativo,   
                  });      
              });
              setUsuariosContServ(res);
      
                });
  
            
          
     
         }); 
       
        } 
    
      });
      
      
    },

    DesativandoTelefone: async(Dados, Id, setAlertTipo, setAlert)=> {
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
      const Setor = "Desativando Telefone Serv";
      await db.collection("telefone").doc(Id).update({
       "ativo":false, 
      }).then(()=>{
        setAlert("Desativado com Sucesso");
        setAlertTipo("success");
        db.collection("movimentacao").add({
          id:id,
          instituicao: Dados.instituicao,
          cidade: Dados.cidade,
          estado: Dados.estado,
          Conta: Dados.conta.serv.tipo,
          acao:"Atualizar",
          setor: Setor,
          data:firebase.firestore.FieldValue.serverTimestamp(),
          idSofrer:Id,
          })
  
      });
    },

    AtivandoTelefone: async(Dados, Id, setAlertTipo, setAlert)=> {
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
      const Setor = "Ativando Telefone Serv";
      await db.collection("telefone").doc(Id).update({
       "ativo":true, 
      }).then(()=>{
        setAlert("Ativado com Sucesso");
        setAlertTipo("success");
        db.collection("movimentacao").add({
          id:id,
          instituicao: Dados.instituicao,
          cidade: Dados.cidade,
          estado: Dados.estado,
          Conta: Dados.conta.serv.tipo,
          acao:"Atualizar",
          setor: Setor,
          data:firebase.firestore.FieldValue.serverTimestamp(),
          idSofrer:Id,
          })
  
      });
    },

    AvisandoMsg: async(Dados, setAvisando)=> {
      await db.collection("aviso")
      .where("estado", "==", Dados.estado)
      .where("cidade", "==", Dados.cidade)
      .where("instituicao", "==", Dados.instituicao)
      .onSnapshot((querySnapshot) => {
        
       const res = [];

        querySnapshot.forEach((doc) => {
          res.push({
            id: doc.id,
            tipo: doc.data().tipo,
            icons: doc.data().icons,
            frase: doc.data().frase,
            ativo: doc.data().ativo,
            cor: doc.data().cor,  
          });             
        });
        
        setAvisando(res);
        
      });
        
    },

    AtivandoAviso: async(Dados, Msg, Cor, setAlertTipo, setAlert)=> {
     
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
      const Setor = "Ativando Aviso Serv";
      await db.collection("tagaviso")
      .where("nome", "==", Cor)
      .onSnapshot((querySnapshot) => {
        const res = [];
        querySnapshot.forEach((doc) => {
          res.push({
            simb:doc.data().simbolo,
            tom:doc.data().cor,
          });
   
        });
        
       db.collection("aviso")
        .where("estado", "==", Dados.estado)
        .where("cidade", "==", Dados.cidade)
        .where("instituicao", "==", Dados.instituicao)
        .get()
        .then((querySnapshot) => {
         
            
          if(querySnapshot.size === 0){
            
             db.collection("aviso")
            .add({
              frase: Msg,
              ativo: true,
              cor: Cor,
              icons: res[0].simb,
              tipo: res[0].tom,
              cidade: Dados.cidade,
              estado: Dados.estado,
              instituicao: Dados.instituicao,
            }).then((doc)=>{
              setAlert("Ativado com Sucesso!");
                setAlertTipo("success");
              const resu = doc.id;
              db.collection("movimentacao").add({
                id:id,
                instituicao: Dados.instituicao,
                cidade: Dados.cidade,
                estado: Dados.estado,
                Conta: Dados.conta.serv.tipo,
                acao:"Criar",
                setor: Setor,
                data:firebase.firestore.FieldValue.serverTimestamp(),
                idSofrer:resu,
                })
            })

          } else {
            
            querySnapshot.forEach((doc) => {   
           
           
            
             
             db.collection("aviso").doc(doc.id).update({
              "frase": Msg,
              "ativo": true,
              "cor": Cor,
              "icons": res[0].simb,
              "tipo": res[0].tom,
              "cidade": Dados.cidade,
              "estado": Dados.estado,
              "instituicao": Dados.instituicao,
             }).then(()=>{
               setAlert("Ativado com Sucesso");
               setAlertTipo("success");
               db.collection("movimentacao").add({
                 id:id,
                 instituicao: Dados.instituicao,
                 cidade: Dados.cidade,
                 estado: Dados.estado,
                 Conta: Dados.conta.serv.tipo,
                 acao:"Atualizar",
                 setor: Setor,
                 data:firebase.firestore.FieldValue.serverTimestamp(),
                 idSofrer:doc.id,
                 })
         
             });
            });
          }
          
        });
      });
    },

    CriandoAvisoApp: async(Dados, MsgApp, setAlertTipo, setAlert)=> {
     
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
      await db.collection("avisoAppVit")
      .where("estado", "==", Dados.estado)
      .where("cidade", "==", Dados.cidade)
      .where("instituicao", "==", Dados.instituicao)
      .get()
      .then((querySnapshot) => {
       
          
        if(querySnapshot.size === 0){
    
      db.collection("avisoAppVit").add({
        ativo:true,
        body: MsgApp,
        cidade: Dados.cidade,
        estado:  Dados.estado,
        instituicao: Dados.instituicao,
      }).then((docRef) => {
        setAlert("Ativado com Sucesso");
        setAlertTipo("success");
       })
        }else {

          querySnapshot.forEach((doc) => {
            db.collection("avisoAppVit").doc(doc.id).update({
              "ativo": true,
              "body":  MsgApp,
             }).then(()=>{
              setAlert("Ativado com Sucesso");
              setAlertTipo("success");
            });

          });


        }


      });
  
    },

    DesativandoAviso: async(Dados, IdAviso, setAlertTipo, setAlert)=> {
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
      const Setor = "Desativando Aviso Serv";
      await db.collection("aviso").doc(IdAviso).update({
       "ativo":false, 
      }).then(()=>{
        setAlert("Desativado com Sucesso");
        setAlertTipo("success");
        db.collection("movimentacao").add({
          id:id,
          instituicao: Dados.instituicao,
          cidade: Dados.cidade,
          estado: Dados.estado,
          Conta: Dados.conta.serv.tipo,
          acao:"Atualizar",
          setor: Setor,
          data:firebase.firestore.FieldValue.serverTimestamp(),
          idSofrer:IdAviso,
          })
  
      });
    },

    DesativandoAvisoApp: async(AppAvi, setAlertTipo, setAlert)=> {
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
      await db.collection("avisoAppVit").doc(AppAvi).update({
       "ativo":false, 
      }).then(()=>{
        setAlert("Desativado com Sucesso");
        setAlertTipo("success");
      });
    },

    ExcluirTelefone: async(Dados, Id, setAlertTipo, setAlert)=> {
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
      const Setor = "Excluir Telefone Serv";
      await db.collection("telefone").doc(Id).delete().then(() => {
        setAlert("Excluido com Sucesso");
        setAlertTipo("success");
    }).catch((error) => {
      setAlert("Erro ao Excluir");
      setAlertTipo("danger");
      db.collection("movimentacao").add({
        id:id,
        instituicao: Dados.instituicao,
        cidade: Dados.cidade,
        estado: Dados.estado,
        Conta: Dados.conta.serv.tipo,
        acao:"Remover",
        setor: Setor,
        data:firebase.firestore.FieldValue.serverTimestamp(),
        })
    });
    },


    PegarCondicionais: async(Condicao,  setCondicao)=> {
      await Auth.onAuthStateChanged( async function(user) {
        if (user) {
        const ID = user.uid;
        const dados = await db.collection('users')
        .doc(ID).
        get()
        .then(async(dados)=>{
          const result = await dados.data();
    
              await db.collection("condicionais")
              .where("estado", "==", result.estado)
              .where("cidade", "==", result.cidade)
              .where("instituicao", "==", result.instituicao)
              .where("ativo", "==", true)
              .onSnapshot((querySnapshot) => {
                
              const res = [];
  
                querySnapshot.forEach((doc) => {
                  res.push({
                    id: doc.id,
                    nome: doc.data().nome,
                  });             
                });
               
                setCondicao(res);
                
              });
            });
          }
        });
        
    },

    PegarAvisoApp: async(AvApp, setAvApp)=> {
      await Auth.onAuthStateChanged( async function(user) {
        if (user) {
        const ID = user.uid;
        const dados = await db.collection('users')
        .doc(ID).
        get()
        .then(async(dados)=>{
          const result = await dados.data();
              console.log(result);
              await db.collection("avisoAppVit")
              .where("estado", "==", result.estado)
              .where("cidade", "==", result.cidade)
              .where("instituicao", "==", result.instituicao)
              .where("ativo", "==", true)
              .onSnapshot((querySnapshot) => {
                
                const res = [];
    
                  querySnapshot.forEach((doc) => {
                    res.push({
                      id: doc.id,
                      body: doc.data().body,
                      ativo: doc.data().ativo,
                    });             
                  });
                 
                setAvApp(res);
                  
                });
            });
          }
        });
        
    },

    EnviarAudio: async (Som) => {
      let now = new Date();
      const uploadUri = Som;
      let filename = Date.now() + '.mp4';
      const storageRef = storage.ref(`audio/${filename}`);
       await storageRef.put(uploadUri).then(function(snapshot) {
        console.log('Arquivo enviado com sucesso!');
      });;
     
   
    },

    PesquisarList: async(Dados, setChatlist)=> {
      await Auth.onAuthStateChanged( async function(user) {
        if (user) {
        const ID = user.uid;
        const Setor = "Lista de Condicionais";
    
         
            await db.collection("ocorrencia")
            .where("ativo", "==", true)
            .onSnapshot((querySnapshot) => {
        
              const res = [];
       
               querySnapshot.forEach((doc) => {
                if(doc.data().dataInicio) {
                  res.push({
                    id: doc.data().ultimaMsg.id,
                    nome: doc.data().nomevitima,
                    data: doc.data().ultimaMsg.data,
                    msg: doc.data().ultimaMsg.msg,
                    idOc:doc.id,
                    dataIn: doc.data().dataInicio.seconds,
                    QuantMsg: doc.data().mensagem.length,
                    Vizualizar: doc.data().vizualS,
                    PmIndo: doc.data().PmIndo ? doc.data().PmIndo : false,
                    IdPM:  doc.data().IdPM ? doc.data().IdPM : "",
                    NomePM: doc.data().NomePM? doc.data().NomePM: "",
                    Resolvido: doc.data().Resolvido ? doc.data().Resolvido : false,
                  });    
                }
                         
               });

               res.sort((a,b)=>{
                 if(a.data < b.data) {
                   return 1;
                 } else {
                   return -1;
                 }
               });
              setChatlist(res);
            
               
             });
           
           
     
       
       
        } 
    
      });
        
    },
    PegarBO: async(BoPesq, setInfo)=> {
    
    
         
            await db.collection("ocorrencia")
            .where("ativo", "==", true)
            .where("Ocorr", "==", BoPesq)
            .onSnapshot((querySnapshot) => {
        
       
               querySnapshot.forEach((doc) => {
            setInfo(doc.data())
                         
               });

           
            
        
    
      });
        
    },

    PegarBOAut: async(BoPesq, setInfo)=> {
    
    
         
      await db.collection("ocorrencia")
      .doc(BoPesq)
      .onSnapshot((querySnapshot) => {

      setInfo(querySnapshot.data())
                   });
  
},
    PesquisarListPM: async(Dados, setChatListPM)=> {
      await Auth.onAuthStateChanged( async function(user) {
        if (user) {
        let ID = user.uid;
        const Setor = "Lista de Condicionais";
       
          
            await db.collection("chat")
            .where("ativo", "==", true)
             .where("userChat", "array-contains", ID)
            .onSnapshot((querySnapshot) => {
        
              const res = [];
       
               querySnapshot.forEach((doc) => {
                 let NomeChat = "";
                 let Vizual = 0;
                 let digi =false;
                 let Status = "";
              
                  if(doc.data().idSofrer === ID) {
                    NomeChat = doc.data().nomeCriador;
                    Vizual = doc.data().vizualS;
                    digi = doc.data().digiC;
                    Status = "Sofredor";
                  } else {
                    NomeChat = doc.data().nomeSofrer
                    Vizual = doc.data().vizualC;
                    digi = doc.data().digiS;
                    Status = "Criador";
                  }
                  res.push({
                    id: doc.data().ultimaMsg.id,
                    nome: NomeChat,
                    data: doc.data().ultimaMsg.data,
                    msg: doc.data().ultimaMsg.msg,
                    idChat:doc.id,
                    QuantMsg: doc.data().mensagem.length,
                    Vizualizar: Vizual,
                    digitar: digi,
                    Sta: Status,
                    ocupado: doc.data().Ocupado? doc.data().Ocupado : false,
                    idOc: doc.data().idOC? doc.data().idOC : "",
                    NomeOc: doc.data().NomeOc? doc.data().NomeOc : "",
                  });    
                
                         
               });

               res.sort((a,b)=>{
                 if(a.data < b.data) {
                   return 1;
                 } else {
                   return -1;
                 }
               });
              
              setChatListPM(res);
            
               
             });
           
           
     
         
       
        } 
    
      });
        
    },
    
     PesquisarNumOc: async(Dados, setCodOc)=> {
        
        const dados = await db.collection('ultimaOcorr')
        .doc("FTKRA384rOgVMPawzEpf")
        .onSnapshot((querySnapshot) => {
          console.log(querySnapshot);
          setCodOc(querySnapshot.data());
      });
        
    },

    AddOcorrencia: async(Dados, came,  Varia, setAlert, setAlertTipo)=> {
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
      let temp = new Date().getTime();
      let now = temp + (Varia*1000);
      let nowD = now/1000
      await db.collection("ocorrencia")
      .add({
      ativo:true,
      cidade: Dados.cidade,
      estado: Dados.estado,
      instituicao:"Polícia Militar",
      nomevitima: came,
      condicionais:[],
      idvitima: id,
      localizacao:{lat: 0, lng: 0},
      userChat:[
        { id: id,
          nome: Dados.nome,}],
      mensagem:[{
        autor:id,
        nome: Dados.nome,
        body:"Ocorrência criada pelo sistema",
        date: now,
        type:"text"
      }],     
      dataInicio:{seconds: nowD},
      ultimaMsg:{id:id, nome: came, data:now, msg:"Ocorrência criada pelo sistema"},
      DigiS:false,
      DigiV:false,
      vizualS:0,
      vizualV:1,
      vtr: "",
      atendenteCopom: "",
      componentesVtr: "",
      periodo: "",
      rua: "",
      numero: "",
      bairro: "",
      conduzidos:"",
      vitimas:"",
      objetosApre:"",
      grupoOcrr:"",
      Ocorr:"",
      resultado: "",
      relato:"",
      providencias:"",
      testemunha:"",
      excluir:false,
      autores:"",
      objRoubados:"",
      Cpu:"",
      BO:{
        Codigo:"",
        Ca:"",
        Setor:"",
        Local:"",
        Bairro:"",
        PontoRef:"",
        Envolvido1:{
          Tipo:"",
          Nome:"",
          Alcunha: "",
          Filiacao: "",
          DataNasc:"",
          Sexo: "",
          EstadoCivil: "",
          Naturalidade: "",
          Nacionalidade: "",
          Endereco: "",
          Bairro: "",
          Cidade: "",
          Cep:"",
          Uf: "",
          Rg: "",
          Cnh: "",
          OrgExpe: "",
          Cpf: "",
          Fone: "",
          Celular: "",
        },
        Envolvido2:{
          Tipo:"",
          Nome:"",
          Alcunha: "",
          Filiacao: "",
          DataNasc:"",
          Sexo: "",
          EstadoCivil: "",
          Naturalidade: "",
          Nacionalidade: "",
          Endereco: "",
          Bairro: "",
          Cidade: "",
          Cep:"",
          Uf: "",
          Rg: "",
          Cnh: "",
          OrgExpe: "",
          Cpf: "",
          Fone: "",
          Celular: "",
        },
        Envolvido3:{
          Tipo:"",
          Nome:"",
          Alcunha: "",
          Filiacao: "",
          DataNasc:"",
          Sexo: "",
          EstadoCivil: "",
          Naturalidade: "",
          Nacionalidade: "",
          Endereco: "",
          Bairro: "",
          Cidade: "",
          Cep:"",
          Uf: "",
          Rg: "",
          Cnh: "",
          OrgExpe: "",
          Cpf: "",
          Fone: "",
          Celular: "",
        },
        Envolvido4:{
          Tipo:"",
          Nome:"",
          Alcunha: "",
          Filiacao: "",
          DataNasc:"",
          Sexo: "",
          EstadoCivil: "",
          Naturalidade: "",
          Nacionalidade: "",
          Endereco: "",
          Bairro: "",
          Cidade: "",
          Cep:"",
          Uf: "",
          Rg: "",
          Cnh: "",
          OrgExpe: "",
          Cpf: "",
          Fone: "",
          Celular: "",
        },
        InfoOc:{
          Historico: "",
          ObjApre: "",
        },
        Parentesco1:{
          Nome: "",
          Alcunha: "",
          Endereco: "",
          GrauPare: "",
          Bairro: "",
          Cidade: "",
          Uf: "",
        },
        Parentesco2:{
          Nome: "",
          Alcunha: "",
          Endereco: "",
          GrauPare: "",
          Bairro: "",
          Cidade: "",
          Uf: "",
        },
        Parentesco3:{
          Nome: "",
          Alcunha: "",
          Endereco: "",
          GrauPare: "",
          Bairro: "",
          Cidade: "",
          Uf: "",
        },
        Parentesco4:{
          Nome: "",
          Alcunha: "",
          Endereco: "",
          GrauPare: "",
          Bairro: "",
          Cidade: "",
          Uf: "",
        },
        CadasOC:{
          ModusOp: "",
          Veiculo: "",
          Armas: "",
        },
        Quadrilha:{
         ModusOp: "",
          Nome: "",
          Chefe: "",
        },
        CadasVeicu1:{
          Marca:"",
          Modelo: "",
          Chassi:"",
          Placa: "",
          Uf: "",
          Cor: "",
          Tipo: "",
          Proprietario: "",
          Endereco: "",
          Cidade: "",
          Estado: "",
          Historico: "",
        },
        CadasVeicu2:{
          Marca:"",
          Modelo: "",
          Chassi:"",
          Placa: "",
          Uf: "",
          Cor: "",
          Tipo: "",
          Proprietario: "",
          Endereco: "",
          Cidade: "",
          Estado: "",
          Historico: "",
        },

      }
      }).then(async (doc)=>{
       setAlert("Ocorrência Cirada Com sucesso");
       setAlertTipo("success");
       
      }).catch((error) => {
        setAlert("Ocorrência não Foi Criada Com sucesso");
        setAlertTipo("danger");
      });  
    },

    sendMessage: async(data, text, nome, TemUmlt, Varia, VizuS)=> {
      let Cont = VizuS + 1;
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
      let temp = new Date().getTime();
      let now = temp + (Varia*1000);
         await db.collection("ocorrencia")
         .doc(data).update({
           mensagem: firebase.firestore.FieldValue.arrayUnion ({
             autor:id,
             nome: nome,
             body: text,
             date: now,
             type:"text"
           }),
           ultimaMsg:{id:id, nome: nome, data: now, msg:text},
           vizualS: Cont, 
       }).then((doc)=>{
    
   
        // db.collection("ocorrencia")
        // .doc(data)
        // .get().then((doc) => {
         
        //   if (doc.exists) {
        //       console.log(res);
        //   } else {
        //       // doc.data() will be undefined in this case
        //       console.log("No such document!");
        //   }
      }).catch((error) => {
         
      });   
    },
    EnviandoOc: async(data, text, nome, TemUmlt, Varia, VizuS, IdPM, activeChatPM, NomePM, Nome)=> {
      let Cont = VizuS + 1;
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
      let temp = new Date().getTime();
      let now = temp + (Varia*1000);
         await db.collection("chat")
         .doc(activeChatPM).update({
           mensagem: firebase.firestore.FieldValue.arrayUnion ({
             autor:id,
             nome: nome,
             body: "Ocorrência foi enviada para seu celular, entre na sessão ocorrência",
             date: now,
             type:"text"
           }),
           ultimaMsg:{id:id, nome: nome, data: now, msg: "Ocorrência foi enviada para seu celular, entre na sessão ocorrência"},
           Ocupado:true,
           idOC:data,
           NomeOc: Nome,
       }).then((doc)=>{
    
   
       
      }).catch((error) => {
         
      }); 

      await db.collection("ocorrencia")
      .doc(data).update({
        mensagem: firebase.firestore.FieldValue.arrayUnion ({
          autor:id,
          nome: nome,
          body: "Viatura já está a caminho",
          date: now,
          type:"text"
        }),
        ultimaMsg:{id:id, nome: nome, data: now, msg:"Viatura já está a caminho"},
        vizualS: Cont,
        IdPM:IdPM,
        NomePM:NomePM,
        PmIndo:true,
        IdChat:activeChatPM,
        userChat:firebase.firestore.FieldValue.arrayUnion ({
          id: IdPM,
          nome: NomePM,
        }),
    }).then((doc)=>{

   }).catch((error) => {
      
   });     
    },

    ReenviandoOc: async(data, text, nome, TemUmlt, Varia, VizuS, IdPM, activeChatPM, NomePM)=> {
      let Cont = VizuS + 1;
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
      let temp = new Date().getTime();
      let now = temp + (Varia*1000);
         await db.collection("chat")
         .doc(activeChatPM).update({
           mensagem: firebase.firestore.FieldValue.arrayUnion ({
             autor:id,
             nome: nome,
             body: "A Ocorrência vai ser direcionada para outro PM, por isso está sendo retirada de você",
             date: now,
             type:"text"
           }),
           ultimaMsg:{id:id, nome: nome, data: now, msg: "A Ocorrência vai ser direcionada para outro PM, por isso está sendo retirada de você"},
           Ocupado:false,
           idOC:"",
           NomeOc:"",
       }).then((doc)=>{
    
   
       
      }).catch((error) => {
         
      }); 

      await db.collection("ocorrencia")
      .doc(data).update({
        mensagem: firebase.firestore.FieldValue.arrayUnion ({
          autor:id,
          nome: nome,
          body: "Desculpe, estamos Reenviando outra Viatura, no momento aguarde! ",
          date: now,
          type:"text"
        }),
        ultimaMsg:{id:id, nome: nome, data: now, msg:"Desculpe, estamos Reenviando outra Viatura, no momento aguarde!"},
        vizualS: Cont,
        IdPM:"",
        PmIndo:false,
        NomePM:"",
    }).then((doc)=>{

   }).catch((error) => {
      
   });     
    },

    sendMessagePM: async(data, text, nome, TemUmlt, Varia, Vizul, Status)=> {
      let Cont = Vizul + 1;
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
      let temp = new Date().getTime();
      let now = temp + (Varia*1000);
      if(Status === "Sofredor" ) {
        await db.collection("chat")
        .doc(data).update({
          mensagem: firebase.firestore.FieldValue.arrayUnion ({
            autor:id,
            nome: nome,
            body: text,
            date: now,
            type:"text"
          }),
          ultimaMsg:{id:id, nome: nome, data: now, msg:text},
          vizualS:Cont,
      }).then((doc)=>{
   
     }).catch((error) => {
        
     }); 

      } else {
        await db.collection("chat")
        .doc(data).update({
          mensagem: firebase.firestore.FieldValue.arrayUnion ({
            autor:id,
            nome: nome,
            body: text,
            date: now,
            type:"text"
          }),
          ultimaMsg:{id:id, nome: nome, data: now, msg:text},
          vizualC:Cont, 
      }).then((doc)=>{

     }).catch((error) => {
        
     });   
      }
      
    },

    sendMessageBotao: async(data, text, nome, TemUmlt, Varia)=> {
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
      let temp = new Date().getTime();
      let now = temp + (Varia*1000);
         await db.collection("ocorrencia")
         .doc(data).update({
           mensagem: firebase.firestore.FieldValue.arrayUnion ({
             autor:id,
             nome: nome,
             body: "Clique E Envie sua Localização",
             date: now,
             type:"botao"
           }),
           ultimaMsg:{id:id, nome: nome, data: now, msg:text} 
       }).then((doc)=>{
    
   
        // db.collection("ocorrencia")
        // .doc(data)
        // .get().then((doc) => {
         
        //   if (doc.exists) {
        //       console.log(res);
        //   } else {
        //       // doc.data() will be undefined in this case
        //       console.log("No such document!");
        //   }
      }).catch((error) => {
         
      });   
    },

    sendMessageBotaoPM: async(data, text, nome, TemUmlt, Varia)=> {
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
      let temp = new Date().getTime();
      let now = temp + (Varia*1000);
         await db.collection("chat")
         .doc(data).update({
           mensagem: firebase.firestore.FieldValue.arrayUnion ({
             autor:id,
             nome: nome,
             body: "Clique E Envie sua Localização",
             date: now,
             type:"botao"
           }),
           ultimaMsg:{id:id, nome: nome, data: now, msg:"Clique E Envie sua Localização"} 
       }).then((doc)=>{
    
   
        // db.collection("ocorrencia")
        // .doc(data)
        // .get().then((doc) => {
         
        //   if (doc.exists) {
        //       console.log(res);
        //   } else {
        //       // doc.data() will be undefined in this case
        //       console.log("No such document!");
        //   }
      }).catch((error) => {
         
      });   
    },


    AtulUltOc: async(Let1, Let2, Let3, NumVal)=> {
   
         await db.collection("ultimaOcorr")
         .doc("FTKRA384rOgVMPawzEpf").update({
           letra1:Let1,
           letra2:Let2,
           letra3:Let3,
           numero:NumVal,
       }).then((doc)=>{
      }).catch((error) => {
         
      });   
    },

    AddCon: async(activeChat, id, nome, setAlertTipo, setAlert)=> {
      const autenticado =  await Auth.currentUser;
    
     
         await db.collection("ocorrencia")
         .doc(activeChat).update({
           condicionais: firebase.firestore.FieldValue.arrayUnion ({
             id:id,
             nome: nome,
           }), 
       }).then((doc)=>{
        setAlert("Adicionado com sucesso");
        setAlertTipo("success");
      }).catch((error) => {
        setAlert("Ocorreu erro na adição");
        setAlertTipo("danger");
      });   
    },

    

    PesquisarConversa: async(data, Dados, setList, setUser, setTemUmlt, setDateIni)=> {
     
      await Auth.onAuthStateChanged( async function(user) {
        if (user) {
        const ID = user.uid;
        setUser(ID);
        const Setor = "Lista de Condicionais";
         await db.collection('ocorrencia')
          .where("instituicao", "==", Dados.instituicao)
          .where("ativo", "==", true)
          .onSnapshot((querySnapshot) => {
              const res = [];
       
               querySnapshot.forEach((doc) => {
                if(doc.data().dataInicio){
                  res.push({
                    id: doc.id,
                    nome: doc.data().mensagem,
                    dataIni: doc.data().dataInicio.seconds,
                  });      
                }
                       
               });
               
               setList(res);
               
             });
           
           
     
        
       
        } 
    
      }); 

      
        
    },
    PesquisarConversaPM: async(data, Dados, setList, setUser,  setVizuM, setVizuT, setDigiM, setDigiT, setStatus, setLocPM, setIdPM, setNomePM,  setLoading)=> {
     console.log(data)
      await Auth.onAuthStateChanged( async function(user) {
        if (user) {
        const ID = user.uid;
        setUser(ID);
        if(data !== null){
          db.collection("chat").doc(data)
          .onSnapshot((doc) => {
            setList(doc.data().mensagem);
            if(ID === doc.data().idCriador ){
              setVizuM(doc.data().vizualC);
              setDigiM(doc.data().digiC);
              setStatus("Criador");
              setVizuT(doc.data().vizualS);
              setDigiT(doc.data().digiS);
              setIdPM(doc.data().idSofrer);
              setNomePM(doc.data().nomeSofrer)
            } else{
              setNomePM(doc.data().nomeCriador)
              setIdPM(doc.data().idCriador)
              setVizuM(doc.data().vizualS);
              setDigiM(doc.data().digiS);
              setStatus("Sofredor");
              setVizuT(doc.data().vizualC);
              setDigiT(doc.data().digiC);
              setLocPM(doc.data().localizacao ? doc.data().localizacao : {});
            }

            setLoading(false);
          });
        }
      
          
       
        } 
    
      }); 

      
        
    },

    EnviOcSalvar: async (Id, Vtr, AtenCop, CompVt,  Conduz, Viti, ObjAp, ResulOc, Relato, Prov, setAlert, setAlertTipo, Arq, Pdf,  setVisi2, Test, Autor, NumOc, ObjRF,  InfVeicu, Placa, Chassis) => {   
 
      if(Arq !== "" ){
          const fileName = await Date.now() + Arq.name;
          const storageRef = storage.ref();
          const fileRef = storageRef.child(`arquivo/${fileName}`);
          await fileRef.put(Arq).then((doc)=> {
            
          });
          const Url =  await fileRef.getDownloadURL();
          await db.collection('ocorrencia')
          .doc(Id)
          .update({
            vtr: Vtr,
            atendenteCopom: AtenCop,
            componentesVtr: CompVt,
            conduzidos:Conduz,
            vitimas:Viti,
            objetosApre:ObjAp,
            grupoOcrr:Url,
            resultado: ResulOc,
            relato:Relato,
            providencias:Prov,
            testemunha:Test,
            autores:Autor,
            Ocorr:NumOc,
            objRoubados:ObjRF,
            InfVeiculo:InfVeicu,
            PlacaVeiculo:Placa,
            ChassisVeiculo:Chassis,
          }).then(()=>{
            setVisi2(false);
            setAlertTipo("success");
            setAlert("Editado com sucesso");
          });

      } else {
        console.log("entrou");
        await db.collection('ocorrencia')
        .doc(Id)
        .update({
          vtr: Vtr,
          atendenteCopom: AtenCop,
          componentesVtr: CompVt,
          conduzidos:Conduz,
          vitimas:Viti,
          objetosApre:ObjAp,
          resultado: ResulOc,
          relato:Relato,
          providencias:Prov,
          testemunha:Test,
          autores:Autor,
          Ocorr:NumOc,
          objRoubados:ObjRF,
          InfVeiculo:InfVeicu,
          PlacaVeiculo:Placa,
          ChassisVeiculo:Chassis,
        }).then(()=>{
          setVisi2(false);
          setAlertTipo("success");
          setAlert("Editado com sucesso");
        });
      }
     
           
    },

    EnviVtr: async (data, Vtr, AtenCop, CompVt, Periodo, Rua, Numero, Bairro, Cidade, Estado, Lat, Lng, Conduz, Viti, ObjAp, ResulOc, Relato, Prov, tempoMad, Test, Autor, ObjRF, InfVeicu, Placa, Chassis) => {   
      await db.collection('ocorrencia')
      .doc(data)
      .update({
        dataInicio:{seconds:tempoMad},
        vtr: Vtr,
        atendenteCopom: AtenCop,
        componentesVtr: CompVt,
        periodo: Periodo,
        rua: Rua,
        numero: Numero,
        bairro: Bairro,
        cidade: Cidade,
        estado: Estado,
        localizacao:{lat: Lat, lng:Lng},
        conduzidos:Conduz,
        vitimas:Viti,
        objetosApre:ObjAp,
        grupoOcrr:"",
        resultado: ResulOc,
        relato:Relato,
        providencias:Prov,
        testemunha:Test,
        autores:Autor,
        objRoubados:ObjRF,
        InfVeiculo:InfVeicu,
        PlacaVeiculo:Placa,
        ChassisVeiculo:Chassis,
      })
           
    },

    EnviNum: async (data, NuOc) => {  
      console.log("entrou nume"); 
      await db.collection('ocorrencia')
      .doc(data)
      .update({
        Ocorr:NuOc,
      })
           
    },

    DadosForm: async (data, setVtr, setAtenCop, setCompVt, setRua, setNumero, setBairro, setCidade, setEstado, setLat, setLng, setConduz, setViti, setObjAp, setResulOc, setRelato, setProv, setDataTime, setTest, setNumOc, setAutor, setObjRF, setPlaca, setChassis  ) => {   
      console.log()
      await db.collection('ocorrencia')
      .doc(data)
      .get()
      .then((doc) => {
        setVtr(doc.data().vtr);
        setAtenCop(doc.data().atendenteCopom);
        setCompVt(doc.data().componentesVtr);
        setRua(doc.data().rua);
        setNumero(doc.data().numero);
        setBairro(doc.data().bairro);
        setEstado(doc.data().estado);
        setCidade(doc.data().cidade);
        setLat(doc.data().localizacao.lat);
        setLng(doc.data().localizacao.lng);
        setConduz(doc.data().conduzidos);
        setViti(doc.data().vitimas);
        setObjAp(doc.data().objetosApre);
        setResulOc(doc.data().resultado);
        setRelato(doc.data().relato);
        setProv(doc.data().providencias);
        setDataTime(doc.data().dataInicio.seconds*1000);
        setNumOc(doc.data().Ocorr);
        setTest(doc.data().testemunha);
        setAutor(doc.data().autores);
        setObjRF(doc.data().objRoubados);
        setPlaca(doc.data().PlacaVeiculo?doc.data().PlacaVeiculo: [] )
        setChassis(doc.data().ChassisVeiculo?doc.data().ChassisVeiculo:[])
      });
       
           
    },


    MsgLida: async (Id, V) => {   
      db.collection('ocorrencia').doc(Id).update({
        'vizualS': V
    })
    .then(() => {
      
    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });   
           
    },

    MsgLidaPM: async (activeChatPM, VizulPM) => {
      
      await Auth.onAuthStateChanged( async function(user) {
        if (user) {
        let ID = user.uid;
      
        await db.collection("chat")
        .doc(activeChatPM)
        .get().then((doc) => {
          console.log("entrou");
          if(doc.data().idSofrer === ID) {
            db.collection('chat').doc(activeChatPM).update({
              'vizualS': VizulPM,
          })
          .then(() => {
            
          })
          .catch((error) => {
              // The document probably doesn't exist.
              console.error("Error updating document: ", error);
          });   

          } else {

            db.collection('chat').doc(activeChatPM).update({
              'vizualC': VizulPM,
          })
          .then(() => {
            
          })
          .catch((error) => {
              // The document probably doesn't exist.
              console.error("Error updating document: ", error);
          });   

          }
             
    
              
              
     
        
          
      }).catch((error) => {
         
      });


        
        }});
    
     
     
           
    },

    Digitando: async (data) => {
      await Auth.onAuthStateChanged( async function(user) {
        if (user) {
        await db.collection('ocorrencia')
       .doc(data)
       .update({
        DigiS: true
    })
    .then(() => {
        
    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });   
           
     
        
       
        } 
    
      }); 
     
   
    },

    DigitandoPM: async (data, Status) => {
      await Auth.onAuthStateChanged( async function(user) {
        if (user) {
          if(Status === "Criador"){
            await db.collection('chat')
            .doc(data)
            .update({
              digiC: true,
         })
         .then(() => {
             
         })
         .catch((error) => {
             // The document probably doesn't exist.
             console.error("Error updating document: ", error);
         });  

          } else {
            await db.collection('chat')
            .doc(data)
            .update({
              digiS: true,
         })
         .then(() => {
             
         })
         .catch((error) => {
             // The document probably doesn't exist.
             console.error("Error updating document: ", error);
         });  

          }
   
           
     
        
       
        } 
    
      }); 
     
   
    },

    NaoDigitandoPM: async (data, Status) => {
      await Auth.onAuthStateChanged( async function(user) {
        if (user) {
          if(Status === "Criador"){
            await db.collection('chat')
            .doc(data)
            .update({
              digiC: false,
         })
         .then(() => {
             
         })
         .catch((error) => {
             // The document probably doesn't exist.
             console.error("Error updating document: ", error);
         });  

          } else {
            await db.collection('chat')
            .doc(data)
            .update({
              digiS: false,
         })
         .then(() => {
             
         })
         .catch((error) => {
             // The document probably doesn't exist.
             console.error("Error updating document: ", error);
         });  

          }
   
           
     
        
       
        } 
    
      }); 
     
   
    },

    NaoDigitando: async (data) => {
      await Auth.onAuthStateChanged( async function(user) {
        if (user) {
     await db.collection('ocorrencia')
       .doc(data)
       .update({
        DigiS: false
    })
    .then(() => {
       
    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });   
           
     
        
       
        } 
    
      }); 
     
   
    },


    ConcluirOc: async(data, Exc, NuOc)=> {
      console.log("entrou 1");
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
      await db.collection('ocorrencia') 
      .doc(data)
      .get().then((doc) => {
        let Me = doc.data().IdChat;
        if(Me === undefined){
          db.collection('ocorrencia')
          .doc(data)
          .update({
           ativo: false,
           dataFim: firebase.firestore.FieldValue.serverTimestamp(),
           excluir:Exc,
           Ocorr:NuOc,
       })
       .then(() => {
          
       })
       .catch((error) => {
          
       });   

        } else {
          db.collection("chat")
          .doc(Me).update({
            Ocupado:false,
            idOC:"",
            NomeOc: "",
        }).then((doc)=>{
  
          db.collection('ocorrencia')
          .doc(data)
          .update({
           ativo: false,
           dataFim: firebase.firestore.FieldValue.serverTimestamp(),
           excluir:Exc,
           Ocorr:NuOc,
       })
       .then(() => {
          
       })
       .catch((error) => {
          
       });   
         
        
       }).catch((error) => {
          
       }); 

        }
       
     

      })


     
      
    },
    ConOcorrencia: async(data, Exc)=> {
      console.log("entrou 2");
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;

      db.collection('ocorrencia') 
      .doc(data)
      .get().then((doc) => {
        
        let Me = doc.data().IdChat;

        if(Me === undefined){
          db.collection('ocorrencia')
          .doc(data)
          .update({
           ativo: false,
           dataFim: firebase.firestore.FieldValue.serverTimestamp(),
           excluir:Exc,
       })
       .then(() => {
          
       })
       .catch((error) => {
           // The document probably doesn't exist.
           
       }); 

        } else {
          db.collection("chat")
          .doc(Me).update({
            Ocupado:false,
            idOC:"",
            NomeOc: "",
        }).then((doc)=>{
  
         db.collection('ocorrencia')
          .doc(data)
          .update({
           ativo: false,
           dataFim: firebase.firestore.FieldValue.serverTimestamp(),
           excluir:Exc,
       })
       .then(() => {
          
       })
       .catch((error) => {
           // The document probably doesn't exist.
           
       }); 
         
        
       }).catch((error) => {
          
       }); 

        }
   

      })

       
      
    },


      ExcluirOc: async(data, Varia, nome)=> {
        
        
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
      let temp = new Date().getTime();
      let now = temp + (Varia*1000);
      await db.collection('ocorrencia') 
      .doc(data)
      .get().then((doc) => {
       
        let Me = doc.data().IdChat;
        console.log("entrou aqui"+ Me);
        if(Me === undefined){
          db.collection('ocorrencia')
          .doc(data)
           .delete();

        } else{
          db.collection("chat")
          .doc(Me).update({
            mensagem: firebase.firestore.FieldValue.arrayUnion ({
              autor:id,
              nome: nome,
              body: "Ocorrência foi excluida",
              date: now,
              type:"text"
            }),
            ultimaMsg:{id:id, nome: nome, data: now, msg: "Ocorrência foi excluida"},
            Ocupado:false,
            idOC:"",
            NomeOc: "",
        }).then((doc)=>{
          
          db.collection('ocorrencia')
          .doc(data)
           .delete();
        
       }).catch((error) => {
          
       }); 

        }
        

      })

      
    },

    EnviarLocali: async(activeChat, la, ln, setAlert, setAlertTipo  )=> {
      console.log(la);
      console.log(ln);
      console.log(activeChat);
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
       await db.collection('ocorrencia')
       .doc(activeChat)
       .update({
        "localizacao":{lat: la, lng: ln},
    })
    .then(() => {
       setAlertTipo("success");
       setAlert("Endereço enviado com sucesso");
    })
    .catch((error) => {
      setAlertTipo("danger");
      setAlert("Endereço não enviado, Houve algum erro");
    });   
      
    },

    AddCondi: async(activeChat, Forms)=> {
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
       await db.collection('ocorrencia')
       .doc(activeChat)
       .update({
        condicionais: Forms,
    })
    .then(() => {
       
    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });   
    },

    ExcluirCondi: async(activeChat, Cont, setAlertTipo, setAlert )=> {
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
       await db.collection('ocorrencia')
       .doc(activeChat)
       .update({
        condicionais: Cont,
    })
    .then(() => {
      setAlert(" ");
      setAlertTipo("");
       
    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });   
    },

    ExcluirCondiRev: async(Id, cond, setAlertTipo, setAlert )=> {
      const autenticado =  await Auth.currentUser;
      const id = await autenticado.uid;
       await db.collection('ocorrencia')
       .doc(Id)
       .update({
        condicionais: cond,
    })
    .then(() => {
      setAlert(" ");
      setAlertTipo("");
       
    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });   
    },
      


    PegarCond: async(activeChat, setForms, setLoc)=> {
 
      await db.collection('ocorrencia')
      .doc(activeChat)
      .onSnapshot((doc) => {
        if(doc.data()){
        setLoc(doc.data().localizacao);
        if(doc.data().condicionais) {
          setForms(doc.data().condicionais);
        } else {
          setForms([]);
        }
      }
       
    });
    },

    PegarCondForms: async(activeChat, setCondVer)=> {
      
      await db.collection('ocorrencia')
      .doc(activeChat)
      .onSnapshot((doc) => {
        if(doc.data().condicionais) {
          setCondVer(doc.data().condicionais);
        } else {
          setCondVer([]);
        }
       
    });


    },

    CriandoNoti: async(Dados, Data, value, TituNoti , TituAnun , setAlertTipo, setAlert, Imgs, setVisi1)=> {
      
     await  setVisi1(true)
     
        let Url1 = "";
        let Url2 = "";
        let Url3 = "";
        let Url4 = "";

        if(Imgs[0].Foto !== ""){
          const fileName = await Date.now() + Imgs[0].Foto.name;
          const storageRef = await storage.ref();
          const fileRef = await storageRef.child(`arquivo/${fileName}`);
          await await fileRef.put(Imgs[0].Foto).then((doc)=> {
            
          });
          Url1 =  await fileRef.getDownloadURL();
        }

        if(Imgs[1].Foto !== ""){
          const fileName = await Date.now() + Imgs[1].Foto.name;
          const storageRef = await storage.ref();
          const fileRef = await storageRef.child(`arquivo/${fileName}`);
          await await fileRef.put(Imgs[1].Foto).then((doc)=> {
            
          });
          Url2 =  await fileRef.getDownloadURL();
        }

        if(Imgs[2].Foto !== ""){
          const fileName = await Date.now() + Imgs[2].Foto.name;
          const storageRef = await storage.ref();
          const fileRef = await storageRef.child(`arquivo/${fileName}`);
          await await fileRef.put(Imgs[2].Foto).then((doc)=> {
            
          });
          Url3 =  await fileRef.getDownloadURL();
        }

        if(Imgs[3].Foto !== ""){
          const fileName = await Date.now() + Imgs[3].Foto.name;
          const storageRef = await storage.ref();
          const fileRef = await storageRef.child(`arquivo/${fileName}`);
          await await fileRef.put(Imgs[3].Foto).then((doc)=> {
            
          });
          Url4 =  await fileRef.getDownloadURL();
        }

        await db.collection("noticias").add({
          instituicao: Dados.instituicao,
          cidade: Dados.cidade,
          estado: Dados.estado,
          ativo:true,
          body:value,
          Titulo:TituNoti,
          TituloAnun:TituAnun,
          dataDanoti:Data,
          foto1:Url1,
          foto2:Url2,
          foto3:Url3,
          foto4:Url4,
          visitas:0,
          dataCriacao:firebase.firestore.FieldValue.serverTimestamp(),
          }).then(() => {
            setAlert("Notícia Criada Com Sucesso ");
            setAlertTipo("success");
            setVisi1(false);
             
          })
          .catch((error) => {
            setAlert("Ouve algum Erro! ");
            setAlertTipo("danger");
            setVisi1(false);
          });  
     
    },
    CriandoAnun: async(Dados,  setAlertTipo, setAlert, Imgs, Nome)=> {
      
      
      
         let Url1 = "";
      
 
         if(Imgs.name !== ""){
           
           const fileName = await Date.now() + Imgs.name;
           const storageRef = await storage.ref();
           const fileRef = await storageRef.child(`arquivo/${fileName}`);
           await await fileRef.put(Imgs).then((doc)=> {
             
           });
           Url1 =  await fileRef.getDownloadURL();
         }
 

 
         await db.collection("anuncios").add({
           instituicao: Dados.instituicao,
           cidade: Dados.cidade,
           estado: Dados.estado,
           ativo:false,
           nome:Nome,
           foto:Url1,
           visitas:0,
           QuantVi:0,
           dataCriacao:firebase.firestore.FieldValue.serverTimestamp(),
           link:"",
           DataIni:"",
           DataFim:"",
           noticia:false,
           idNot:"",
           nomeNot:"",
           }).then(() => {
             setAlert("Anuncio Criado Com Sucesso ");
             setAlertTipo("success");
           
              
           })
           .catch((error) => {
             setAlert("Ouve algum Erro! ");
             setAlertTipo("danger");
           
           });  
      
     },

     EditandoAnun: async(Dados, Id, setAlertTipo, setAlert, Imgs, Nome, Link, DataIni, DataFim, res1, Viz, Img1, res2, idNot, Not )=> {
      
      console.log(Imgs);
      
      let Url1 = "";
   

      if(Imgs.name ){
        
        const fileName = await Date.now() + Imgs.name;
        const storageRef = await storage.ref();
        const fileRef = await storageRef.child(`arquivo/${fileName}`);
        await await fileRef.put(Imgs).then((doc)=> {
          
        });
        Url1 =  await fileRef.getDownloadURL();
        await db.collection("anuncios")
        .doc(Id)
        .update({
          instituicao: Dados.instituicao,
          cidade: Dados.cidade,
          estado: Dados.estado,
          ativo:res1,
          nome:Nome,
          foto:Url1,
          QuantVi:Viz,
          link:Link,
          DataIni:DataIni,
          DataFim:DataFim,
          noticia:res2,
          idNot: idNot,
           nomeNot: Not,

          }).then(() => {
            setAlert("Anuncio Criado Com Sucesso ");
            setAlertTipo("success");
          
             
          })
          .catch((error) => {
            setAlert("Ouve algum Erro! ");
            setAlertTipo("danger");
          
          });  

      } else {
         await db.collection("anuncios")
      .doc(Id)
      .update({
        instituicao: Dados.instituicao,
        cidade: Dados.cidade,
        estado: Dados.estado,
        ativo:res1,
        nome:Nome,
        QuantVi:Viz,
        link:Link,
        DataIni:DataIni,
        DataFim:DataFim,
        noticia:res2,
        idNot: idNot,
        nomeNot: Not,
        }).then(() => {
          setAlert("Anuncio Criado Com Sucesso ");
          setAlertTipo("success");
        
           
        })
        .catch((error) => {
          setAlert("Ouve algum Erro! ");
          setAlertTipo("danger");
        
        });  

      }



     
   
  },

    EditandoNoti: async(Dados, Id, Data, value, TituNoti , TituAnun , setAlertTipo, setAlert, Imgs, setVisi1)=> {
      
      await  setVisi1(true)
      
         let Url1 = "";
         let Url2 = "";
         let Url3 = "";
         let Url4 = "";
 
         if(Imgs[0].Foto !== ""){
           if(Imgs[0].Foto.name){
            const fileName = await Date.now() + Imgs[0].Foto.name;
            const storageRef = await storage.ref();
            const fileRef = await storageRef.child(`arquivo/${fileName}`);
            await await fileRef.put(Imgs[0].Foto).then((doc)=> {
              
            });
            Url1 =  await fileRef.getDownloadURL();

           } else {
              Url1 = Imgs[0].Foto 
           }
          
         }
 
         if(Imgs[1].Foto !== ""){
          if(Imgs[1].Foto.name){
           const fileName = await Date.now() + Imgs[1].Foto.name;
           const storageRef = await storage.ref();
           const fileRef = await storageRef.child(`arquivo/${fileName}`);
           await await fileRef.put(Imgs[1].Foto).then((doc)=> {
             
           });
           Url2 =  await fileRef.getDownloadURL();
          } else {
            Url2 = Imgs[1].Foto 
         }
         }
 
         if(Imgs[2].Foto !== ""){
          if(Imgs[2].Foto.name){
           const fileName = await Date.now() + Imgs[2].Foto.name;
           const storageRef = await storage.ref();
           const fileRef = await storageRef.child(`arquivo/${fileName}`);
           await await fileRef.put(Imgs[2].Foto).then((doc)=> {
             
           });
           Url3 =  await fileRef.getDownloadURL();
          } else {
            Url3 = Imgs[2].Foto 
         }
         }
 
         if(Imgs[3].Foto !== ""){
          if(Imgs[3].Foto.name){
           const fileName = await Date.now() + Imgs[3].Foto.name;
           const storageRef = await storage.ref();
           const fileRef = await storageRef.child(`arquivo/${fileName}`);
           await await fileRef.put(Imgs[3].Foto).then((doc)=> {
             
           });
           Url4 =  await fileRef.getDownloadURL();
         }
        } else {
          Url4 = Imgs[3].Foto 
       }
 
         await db.collection("noticias")
         .doc(Id)
         .update({
           body:value,
           Titulo:TituNoti,
           TituloAnun:TituAnun,
           dataDanoti:Data,
           foto1:Url1,
           foto2:Url2,
           foto3:Url3,
           foto4:Url4,
    
           }).then(() => {
             setAlert("Notícia Editada Com Sucesso ");
             setAlertTipo("success");
             setVisi1(false);
              
           })
           .catch((error) => {
             setAlert("Ouve algum Erro! ");
             setAlertTipo("danger");
             setVisi1(false);
           });  
      
     },
     ExcluirNoti: async( Id,  setAlertTipo, setAlert)=> {
            setAlert(" ");
              setAlertTipo("");
     
 
      await db.collection("noticias")
      .doc(Id)
      .delete().then(() => {
          setAlert("Notícia Excluida Com Sucesso ");
          setAlertTipo("Danger");
       
           
        })
        .catch((error) => {
          setAlert("Ouve algum Erro! ");
          setAlertTipo("danger");
         
        });  
   
  },

     AtivarNoti: async( id,  setAlertTipo, setAlert)=> {
      
     
 
         await db.collection("noticias")
         .doc(id)
         .update({
           ativo:true,
    
           }).then(() => {
             setAlert("Notícia Ativada Com Sucesso ");
             setAlertTipo("success");
          
              
           })
           .catch((error) => {
             setAlert("Ouve algum Erro! ");
             setAlertTipo("danger");
            
           });  
      
     },

     DesativarNoti: async(id,  setAlertTipo, setAlert)=> {
      
     
 
      await db.collection("noticias")
      .doc(id)
      .update({
        ativo:false,
 
        }).then(() => {
          setAlert("Notícia Desativada Com Sucesso ");
          setAlertTipo("success");
       
           
        })
        .catch((error) => {
          setAlert("Ouve algum Erro! ");
          setAlertTipo("danger");
         
        });  
   
  },


  sairdaconta: async()=> {
    await Auth.signOut().then( async () => {
      await localStorage.setItem('roma', "L23252679");
      await localStorage.setItem('brasil', "serv");
      
    });
  },
  
 













  

  // Inicio de entradas de dados para teste
  gerarDados: async()=> {
    // Esse dado de teste serve para testar a conta Serv vendo se ela está desativada e ativando ela
    await db.collection('users').doc('fd5xCA0VX7g7C5EfQI3J8o5WkfH2').set({
     
              nome: "Luiz Carlos", 
              telefone: "(99) 9965-7894", 
              cidade: "Altos", 
              estado: "Piauí", 
              instituicao: "Polícia",
              conta:{ admin:{ativo:false, desbloqueado: false, tipo:""},
                      app:{ativo:false, desbloqueado: false, tipo:""},
                      negApp:{ativo:false, desbloqueado: false, tipo:""},
                      serv:{ativo:false, desbloqueado: false, tipo:"Lider"},
                      servApp:{ativo:false, desbloqueado: false, tipo:""},
              
                    },
                    grupo:{
                      id:"mjcq9CMFFexmf5JPvTtX",
                      nome:"Geral",
                      menu:{
                          contas:{
                                  listaServ:{
                                           Ver:true,
                                           btn_vizualizar:true,
                                           btn_excluir:true,
                                           btn_editar:true,
                                          }
                                  }
                                }
                            },
            
    }).then(() => {
      console.log("1° dado adicionado !");
                  })
                  .catch((error) => {
                      console.error("Erro Ao adicionar : ", error);
                  });




    await db.collection('users').doc('MIA1uRFHHTTxBp8wopztoWp5eko2').set({
     

              nome: "Carlos Daniel", 
              telefone: "(99) 9965-7894", 
              cidade: "Altos", 
              estado: "Pauí", 
              instituicao: "Bombeiro",
              conta:{ admin:{ativo:false, desbloqueado: false, tipo:""},
                      app:{ativo:false, desbloqueado: false, tipo:""},
                      negApp:{ativo:false, desbloqueado: false, tipo:""},
                      serv:{ativo:true, desbloqueado: false, tipo:"Lider"},
                      servApp:{ativo:false, desbloqueado: false, tipo:""},
              
                    },
                    grupo:{
                      id:"mjcq9CMFFexmf5JPvTtX",
                      nome:"Geral",
                      menu:{
                          contas:{
                                  listaServ:{
                                           Ver:true,
                                           btn_vizualizar:true,
                                           btn_excluir:true,
                                           btn_editar:true,
                                          }
                                  }
                                }
                            },

    }).then(() => {
      console.log("2° dado adicionado !");
                  })
                  .catch((error) => {
                      console.error("Erro Ao adicionar : ", error);
                  });

    


  },



  // excluido todos os dados de teste
  excluirDados: async()=> {
    await db.collection('users')
    .doc('fd5xCA0VX7g7C5EfQI3J8o5WkfH2')
    .delete()
    .then(() => {
      console.log("1° dados Excluido !");
                  })
                  .catch((error) => {
                      console.error("Erro Ao adicionar : ", error);
                  });

    await db.collection('users')
    .doc('MIA1uRFHHTTxBp8wopztoWp5eko2')
    .delete()
    .then(() => {
      console.log("2° dado excluido !");
                  })
                  .catch((error) => {
                      console.error("Erro Ao adicionar : ", error);
                  });

  },

  DesbloqueioContaServ: async()=> {
    return await db.collection("users").doc('fd5xCA0VX7g7C5EfQI3J8o5WkfH2').update({
      "conta.serv.desbloqueado": true,
  })
  .then(() => {
      console.log("1º  conta foi desbloqueada");
  });
  },
  
  

};
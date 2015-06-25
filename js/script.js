window.onload = function()
{
	var listaClientes = [];
	var elementos = ["identificador", "nome", "apelido", "email", "nasci"];
	var resultadoBusca = []; //usuarios para busca
	//Cadastra
	listaClientes = [];
	var indEdita = -1; //indice de edição
	function cliente(id, pn, pa, em, dn)
	{
		this.identificacao = id;
		this.primeronome = pn;
		this.primeroapelido = pa;
		this.email = em;
		this.datanascimento = dn;
		this.calculaIdade = function()
		{
			var data_atual = new Date();
			var parteDn = this.datanascimento.split("-");
			var comparaData = new Date(parteDn[0], parteDn[1], parteDn[2]); //ano, mes e dia
			return Math.floor((data_atual - comparaData) / 1000 / 3600 / 24 / 365);
			//Milisegundos, segundos em uma hora, horas em um dia, dias em um ano...
		}
		//Devolve os dados do cliente, imprime na tela
		this.imprime = function()
		{
			return [
						this.identificacao, 
						this.primeronome + " " + this.primeroapelido, 
						this.email, 
						this.datanascimento, 
						this.calculaIdade()
					];
		}
	}

	//Carregar informacoes do localStorage...
	if(localStorage.getItem("lista"))
	{
		var objTMP = eval(localStorage.getItem("lista"));
		var id = pn = pa = em = dn = "";
		for(var i in objTMP)
		{
			var id = objTMP[i].identificacao;
			var pn = objTMP[i].primeronome;
			var pa = objTMP[i].primeroapelido;
			var em = objTMP[i].email;
			var dn = objTMP[i].datanascimento;
			var novoCliente = new cliente(id, pn, pa, em, dn);
			listaClientes.push(novoCliente);
		}
	}

	imprimeUsuarios();
	//Mostrar clientes...
	function imprimeUsuarios()
	{
		var mostra = true;
		var txt = "<table class = 'table-fill'>";
			txt += "<thead><tr><th>ID</th><th>Nome</th><th>E-mail</th>";
			txt += "<th>Data</th><th>Idade</th>";
			txt += "<th>Editar</th><th>Excluir</th></tr></thead>";
			txt += "<tbody class = 'table-hover'>";
		for(var i = 0; i < listaClientes.length; i++)
		{
			mostra = true;
			for(var c in resultadoBusca)
			{
				if(resultadoBusca[c] === i)
				{
					mostra = false;
				}
			}
			if(mostra)
			{
				txt += "<tr>";
				var dadosCliente = listaClientes[i].imprime();
				for(var c = 0; c < dadosCliente.length; c++)
				{
					txt += "<td><center>"+(dadosCliente[c])+"</center></td>";
				}
				//Editar...
				txt += "<td><center>";
				txt += "<img src = 'img/editar.png' border = '0' id = 'e_"+i+"'/>";
				txt += "</center</td>";
				//Eliminar...
				txt += "<td><center>";
				txt += "<img src = 'img/eliminar.png' border = '0' id = 'd_"+i+"'/>";
				txt += "</center</td>";
				txt += "</tr>";
			}
		}
		txt += "</tbody></table>";
		nom_div("imprime").innerHTML = txt;

		//Edicao e delete...
		for(var i = 0; i < listaClientes.length; i++)
		{
			mostra = true;
			for(var c in resultadoBusca)
			{
				if(resultadoBusca[c] === i)
				{
					mostra = false;
				}
			}
			if(mostra)
			{
				//Editar
				nom_div("e_" + i).addEventListener('click', function(event)
				{
					var ind = event.target.id.split("_");
					var idUser = listaClientes[ind[1]].identificacao;
					ind = buscaIndice(idUser);
					
					
									//		Editar Dados
					
					if(ind >= 0)
				{
					nom_div("identificador").value = listaClientes[ind].identificacao;
					nom_div("nome").value = listaClientes[ind].primeronome;
					nom_div("apelido").value = listaClientes[ind].primeroapelido;
					nom_div("email").value = listaClientes[ind].email;
					nom_div("nasci").value = listaClientes[ind].datanascimento;
					indEdita = ind;
				}
				else
				{
					alert("ID não existe.");
				}
				});
				//Eliminar...
				nom_div("d_" + i).addEventListener('click', function(event)
				{
					var ind = event.target.id.split("_");
					var idUser = listaClientes[ind[1]].identificacao;
					if(confirm("Deseja realmente excluir ?"))
					{
						
						
						// Eliminar Cliente
						
						listaClientes.splice(ind,1);
						imprimeUsuarios(listaClientes);
						localStorage.setItem("lista", JSON.stringify(listaClientes));
					}
				});
			}
		}
	}
	//Com a informacao, busca a posição de armazenamento
	var buscaIndice = function(id)
	{
		var indice = -1;
		for(var i in listaClientes)
		{
			if(listaClientes[i].identificacao === id)
			{
				indice = i;
				break;
			}
		}
		return indice;
	}

	//Limpar formulario
	var limparCampos = function()
	{
		for(var i = 0; i < elementos.length; i++)
		{
			nom_div(elementos[i]).value = "";	
		}
	}

	//identificar usuario por email
	function existeUsuario(id, email)
	{
		var existe = 0; //Nao  existe
		for(var i in listaClientes)
		{
			//Ficha
			if(i != indEdita)
			{	
				if(listaClientes[i].identificacao === id)
				{
				existe = 1; // existe
				break;
				}
				//email existe
				if(listaClientes[i].email.toLowerCase() === email.toLowerCase())
				{
				existe = 2; //email existe...
				break;
				}
			}	
		}
		return existe;
	}

	//botao cadastrar...
	nom_div("cadastrar").addEventListener('click', function(event)
	{
		var correto = true;
		var valores = [];
		for(var i = 0; i < elementos.length; i++)
		{
			if(nom_div(elementos[i]).value === "")
			{
				alert("Informe todos os campos");
				nom_div(elementos[i]).focus();
				correcto = false;
				break;
			}
			else
			{
				valores[i] = nom_div(elementos[i]).value;
			}
		}
		//todo informado
		if(correto)
		{
			var existeDados = existeUsuario(valores[0], valores[3]);
			if(existeDados == 0) //Nao existe
			{
				if(ValidaEmail(valores[3]))
				{
					if(indEdita < 0)
					{
						var novoCliente = new cliente(valores[0], valores[1], valores[2], valores[3], valores[4]);
						listaClientes.push(novoCliente);
						
					}
					else
					{
						listaClientes[indEdita].identificacao = valores[0];
						listaClientes[indEdita].primeronome = valores[1];
						listaClientes[indEdita].primeroapelido = valores[2];
						listaClientes[indEdita].email = valores[3];
						listaClientes[indEdita].datanascimento = valores[4];
					}
						localStorage.setItem("lista", JSON.stringify(listaClientes));
						imprimeUsuarios();
						limparCampos();
					}
					else
					{
					alert("E-mail inválido");
					nom_div(elementos[3]).focus();
					}
			}
			else
			{
				if(existeDados == 1)
				{
					alert("O cliente com o ID: " + valores[0] + " Já existe");
					nom_div(elementos[0]).focus();
				}
				else
				{
					alert("E-mail : " + valores[3] + " Já existe");
					nom_div(elementos[3]).focus();	
				}
			}
		}
	});
	
	//buscar
	nom_div("buscUser").addEventListener('keyup', function(event)
	{
		resultadoBusca = []; //reinicia busca
		var busca = false;
		if(this.value !== "")
		{
			for(var i = 0; i < listaClientes.length; i++)
			{
				busca = listaClientes[i].identificacao.search(this.value) < 0;
				busca = busca && listaClientes[i].primeronome.search(this.value) < 0;
				busca = busca && listaClientes[i].primeroapelido.search(this.value) < 0;
				busca = busca && listaClientes[i].email.search(this.value) < 0;
				if(busca)
				{
					resultadoBusca.push(i);
				}
			}
		}
		imprimeUsuarios();
	});


	//Valida se email esta escrito corretamente '@'
	function ValidaEmail(email)
	{
		var correto = true;
		var emailReg = /^([\da-zA-Z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
		if(!emailReg.test(email))
		{
			correto =  false;
		}
		return correto;
	}

	//Acessa elementos de HTML...
	function nom_div(div)
	{
		return document.getElementById(div);
	}
}
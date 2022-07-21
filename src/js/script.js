let ulVitrine        = document.querySelector("#vitrine");
let ulCarrinho       = document.querySelector("#produtosCarrinho");
let sectionCarrinho  = document.querySelector(".carrinhoCompras");
let divCarrinho      = document.querySelector(".carrinho");
let divCarrinhoVazio = document.querySelector("#carrinhoVazio");
let navMenu          = document.querySelector(".menu");
let inputPesquisar   = document.querySelector("#pesquisar");
let buttonPesquisar  = document.querySelector("#buttonPesquisar");
let h1Logo           = document.querySelector("#logoSite");

let cardInfoCarrinho = document.createElement("div");


// FUNÇÃO => LISTAR OS PRODUTOS NA SEÇAO CORRESPONDENTE
function listarProdutos (arrayProdutos,secao){
    secao.innerHTML = "";

    if(arrayProdutos.length == 0){
        secao.innerHTML    = `
        <span id="vitrineVazia">Nenhum produto encontrado</span>
        `
    }else{
        for(let i=0; i<arrayProdutos.length; i++){
            let produto     = arrayProdutos[i];
            let cardProduto = cardProdutos(produto);
    
            secao.appendChild(cardProduto);
        }
    }
};
listarProdutos(data,ulVitrine);


// FUNÇÃO => CRIAR OS CARDS DOS PRODUTOS PARA A VITRINE
function cardProdutos (produto){
    let precoProduto  = produto.value;
    let precoFormatar = precoProduto.toFixed(2);
    precoProduto      = precoFormatar.replace(".",",");

    let liCard        = document.createElement("li");
    liCard.className  = produto.category;
    liCard.innerHTML  = `
    <figure class="imagemProduto">
        <img src="${produto.img}">
    </figure>

    <div class="infoProduto">
        <span class="categoria">${produto.category}</span>
        <h2 class="tituloProduto">${produto.nameItem}</h2>
        <p class="descricaoProduto">${produto.description}</p>
        <span class="precoProduto">R$ ${precoProduto}</span>
        <button id="${produto.id}">${produto.addCart}</button>
    </div>
    `;

    return liCard;
};


// FUNÇÃO => ADICIONAR PRODUTOS AO CARRINHO DE COMPRAS
let produtosCarrinho  = [];

ulVitrine.addEventListener("click",function (event){
    let target        = event.target;
    if(target.tagName == "BUTTON"){
        let idProduto = target.id;
        let produto   = data.find(function (produtoEncontrado){
            if(produtoEncontrado.id == idProduto){
                return produtoEncontrado;
            }
        });

        produto.addCart = "Remover produto";
        produtosCarrinho.push(produto);
        listarProdutos(produtosCarrinho,ulCarrinho);
    }

    let cardInfo = informacoesCarrinho(produtosCarrinho);

    if(produtosCarrinho.length > 0){
        divCarrinhoVazio.setAttribute("class","hidden");
    }

    sectionCarrinho.appendChild(cardInfo);
});


// FUNÇÃO => ATUALIZAR O CARD DE INFORMAÇÕES DO CARRINHO
function informacoesCarrinho (arrayProdutos){
    cardInfoCarrinho.innerHTML = "";

    if(produtosCarrinho.length > 0){
        cardInfoCarrinho.className = "cardInformacoes";
        cardInfoCarrinho.innerHTML = `
        <div class="informacoes">
            <span>Quantidade:</span>
            <span>Total:</span>
        </div>
    
        <div class="valores">
            <span id="quantidadeItens">${arrayProdutos.length}</span>
            <span id="totalCompra">R$ ${soma(arrayProdutos)},00</span>
        </div>
        `;
    }

    return cardInfoCarrinho;
}


// FUNÇÃO => SOMAR O VALOR TOTAL DA COMPRA
function soma (arrayValores){
    let result = 0;

    for(let i=0; i<arrayValores.length; i++){
        result = result+arrayValores[i].value;
    }
    return result;
};


// FUNÇÃO => REMOVER OS PRODUTOS DO CARRINHO
ulCarrinho.addEventListener("click",function (event){
    let target = event.target;
    
    if(target.tagName == "BUTTON"){
        let idProduto = target.id;
        let produto   = produtosCarrinho.find(function (produtoEncontrado){
            if(produtoEncontrado.id == idProduto){
                return produtoEncontrado;
            }
        });

        let indiceProduto = produtosCarrinho.indexOf(produto);
        produtosCarrinho.splice(indiceProduto,1);
        listarProdutos(produtosCarrinho,ulCarrinho);
        informacoesCarrinho(produtosCarrinho);
        
        if(produtosCarrinho.length < 1){
            divCarrinhoVazio.setAttribute("class","carrinhoVazio");

            let cardInfo = document.querySelector(".cardInformacoes");
            cardInfo.setAttribute("class","hidden");
        }
    }
});


// FUNÇÃO => FILTRAR PRODUTOS
navMenu.addEventListener("click",function (event){
    let target = event.target;

    if(target.tagName == "LI" && target.outerText == "Todos"){
        listarProdutos(data,ulVitrine);

    }else if(target.tagName  == "LI" && target.outerText == "Acessórios"){
        let filterAcessorios = [];

        for(let i=0; i<data.length; i++){
            if(data[i].category == "Acessórios"){
                filterAcessorios.push(data[i]);
            }
        }
        
        listarProdutos(filterAcessorios,ulVitrine);

    }else if(target.tagName == "LI" && target.outerText == "Camisetas"){
        let filterCamisetas = [];

        for(let i=0; i<data.length; i++){
            if(data[i].category == "Camisetas"){
                filterCamisetas.push(data[i]);
            }
        }
        
        if(filterCamisetas.length == 0){
            ulVitrine.innerHTML   = `
            <span id="vitrineVazia">Nenhum produto encontrado</span>
            `
        }else{
            listarProdutos(filterCamisetas,ulVitrine);
        }

    }else if(target.tagName == "LI" && target.outerText == "Calçados"){
        let filterCalcados  = [];

        for(let i=0; i<data.length; i++){
            if(data[i].category == "Calçados"){
                filterCalcados.push(data[i]);
            }
        }

        if(filterCalcados.length == 0){
            ulVitrine.innerHTML  = `
            <span id="vitrineVazia">Nenhum produto encontrado</span>
            `
        }else{
            listarProdutos(filterCalcados,ulVitrine);
        }
    }
});


// FUNÇÃO => PESQUISAR PRODUTO
buttonPesquisar.addEventListener("click",function (event){
    event.preventDefault();

    let pesquisaTrim      = inputPesquisar.value;
    let pesquisaUsuario   = pesquisaTrim.trim();
    let resultBusca       = [];

    for(let i=0; i<data.length; i++){
        let nomeProdutoMin      = data[i].nameItem.toLowerCase();
        let categoriaProdutoMin = data[i].category[0].toLowerCase();

        if(pesquisaUsuario == ""){
            resultBusca = data;

        }else if(pesquisaUsuario == data[i].nameItem){
            resultBusca.push(data[i]);

        }else if(pesquisaUsuario == nomeProdutoMin){
            resultBusca.push(data[i]);

        }else if(pesquisaUsuario == data[i].category){
            resultBusca.push(data[i]);

        }else if(pesquisaUsuario == categoriaProdutoMin){
            resultBusca.push(data[i]);

        }else{
            for(let j=0; j<data[i].tags.length; j++){

                if(pesquisaUsuario == data[i].tags[j]){
                    resultBusca.push(data[i]);
                }
            }
        }
    }
    
    listarProdutos(resultBusca,ulVitrine);
    inputPesquisar.value = "";
});


// FUNÇÃO => APRESENTAR TODOS OS PRODUTOS AO CLICAR NA LOGO DO SITE
h1Logo.addEventListener("click",function (){
    listarProdutos(data,ulVitrine);
});
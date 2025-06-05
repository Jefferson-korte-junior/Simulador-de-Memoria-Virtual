// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener("DOMContentLoaded", function() {
    const botaoIniciar = document.getElementById("botao-iniciar");
    // Captura os elementos do DOM necessários
    const botaoIniciaroverlay = document.getElementById("botao-iniciar-overlay"); // Botão para iniciar subrotinas
    const botaoParar = document.getElementById("botao-parar"); // Botão para parar subrotinas
    //const frameMemoria = document.querySelector(".frame-memoria"); // Elemento onde subrotinas serão exibidas
    const subrotinasAtivas = document.getElementById("subrotinas-ativas"); // Label para exibir subrotinas ativas
    const subrotinasFila = document.getElementById("subrotinas-fila"); // Label para exibir subrotinas na fila
    const subrotinasConcluidas = document.getElementById("subrotinas-concluidas"); // Label para exibir subrotinas concluídas
    const botaoPaginacao = document.getElementById("botao-iniciar-paginacao"); //Botao iniciar paginação

    const titulo_memoria = document.getElementById("titulo-memoria"); // Título da memória

    const frameMemoria = document.getElementById("frame-memoria");

    //Para esconder todas as labels quando inicia o programa
    subrotinasAtivas.style.display = "none";
    subrotinasFila.style.display = "none";
    subrotinasConcluidas.style.display = "none";
    document.getElementById("label-paginacao").style.display = "none";
    document.getElementById("label-paginacao-concluidas").style.display = "none";

    // Quando for Overlay:
    frameMemoria.classList.remove("paginacao");
    frameMemoria.classList.add("overlay");

    // Quando for Paginação:
    frameMemoria.classList.remove("overlay");
    frameMemoria.classList.add("paginacao");


    // Variáveis para gerenciamento das subrotinas
    let filaSubrotinas = []; // Lista de subrotinas na fila
    let subrotinasConcluidasLista = []; // Lista de subrotinas concluídas
    let subrotinasAtivasLista = []; // Lista de subrotinas ativas
    let temposRestantes = {}; // Objeto que armazena o tempo restante para cada subrotina
    let rotinaPrincipalConcluida = false; // Flag para verificar se a rotina principal foi concluída
    let overlayEmExecucao = false; // Flag para verificar se o overlay de execução está ativo


    // Função para configurar subrotinas iniciais
    const configurarSubrotinas = () => {
        // Cria 15 subrotinas com nomes "Subrotina X"
        filaSubrotinas = Array.from({ length: 15 }, (_, i) => `Subrotina ${i + 1}`);
        // Define tempos aleatórios entre 5 e 15 segundos para cada subrotina
        temposRestantes = filaSubrotinas.reduce((acc, sub) => {
            acc[sub] = Math.floor(Math.random() * 10) + 5;
            return acc;
        }, {});
        rotinaPrincipalConcluida = false; // Reseta o estado da rotina principal
        atualizarLabels(); // Atualiza os labels para refletir o estado inicial
    };



    // Função para criar a rotina principal na memória
    const criarRotinaPrincipal = () => {
        const rotinaPrincipal = document.createElement("div"); // Cria um elemento div
        rotinaPrincipal.id = "rotina-principal"; // Define ID
        rotinaPrincipal.className = "rotina-principal"; // Define classe para estilização
        rotinaPrincipal.innerHTML = "<strong>Rotina Principal</strong>"; // Conteúdo exibido na memória
        frameMemoria.appendChild(rotinaPrincipal); // Adiciona ao frame de memória
    };



    // Função para finalizar a rotina principal
    const finalizarRotinaPrincipal = () => {
        const rotinaPrincipal = document.getElementById("rotina-principal");
        if (rotinaPrincipal) {
            rotinaPrincipal.remove(); // Remove elemento da memória
            subrotinasConcluidasLista.push("Rotina Principal"); // Adiciona à lista de concluídas
            rotinaPrincipalConcluida = true; // Define rotina principal como concluída
            atualizarLabels(); // Atualiza os labels
        }
    };



    // Função para iniciar as subrotinas
    const iniciarSubrotinas = () => {
        if (overlayEmExecucao) return; // Verifica se já está em execução

        overlayEmExecucao = true; // Define flag de execução

        criarRotinaPrincipal(); // Adiciona a rotina principal na memória
        subrotinasAtivasLista = filaSubrotinas.splice(0, 5); // Move as 5 primeiras subrotinas para a lista de ativas
        subrotinasAtivasLista.forEach((sub, index) => criarSubrotina(sub, index)); // Cria os elementos visuais para cada subrotina ativa
        atualizarLabels(); // Atualiza os labels
    };


    // Função para criar o elemento visual de uma subrotina
    const criarSubrotina = (subrotina, index) => {
        const subrotinaFrame = document.createElement("div"); // Cria elemento div para representar a subrotina
        subrotinaFrame.className = "subrotina"; // Define classe para estilização
        subrotinaFrame.style.backgroundColor = "635f5f"; // Define a cor para as subrotinas 
        subrotinaFrame.innerHTML = `
            <strong>${subrotina}</strong>
            <div id="tempo-${subrotina}">${temposRestantes[subrotina]}s</div>
        `; // Exibe o nome e o tempo restante da subrotina
        frameMemoria.appendChild(subrotinaFrame); // Adiciona a subrotina ao frame de memória

        // Função para atualizar o tempo restante
        const atualizarTempo = () => {
            if (temposRestantes[subrotina] > 0) {
                temposRestantes[subrotina] -= 1; // Reduz o tempo restante em 1 segundo
                document.getElementById(`tempo-${subrotina}`).textContent = `${temposRestantes[subrotina]}s`; // Atualiza display
                setTimeout(atualizarTempo, 1000); // Chama a função novamente após 1 segundo
            } else {
                concluirSubrotina(subrotina, subrotinaFrame); // Conclui a subrotina quando o tempo chega a zero
            }
        };
        atualizarTempo(); // Inicia a contagem regressiva
    };



    // Função para concluir uma subrotina
    const concluirSubrotina = (subrotina, frame) => {
        frame.remove(); // Remove o elemento visual da memória
        subrotinasAtivasLista = subrotinasAtivasLista.filter(item => item !== subrotina); // Remove da lista de ativas
        subrotinasConcluidasLista.push(subrotina); // Adiciona à lista de concluídas

        const novaSubrotina = filaSubrotinas.shift(); // Pega a próxima subrotina da fila
        if (novaSubrotina) {
            subrotinasAtivasLista.push(novaSubrotina); // Adiciona nova subrotina às ativas
            criarSubrotina(novaSubrotina, subrotinasAtivasLista.length); // Cria elemento visual para a nova subrotina
        }

        if (filaSubrotinas.length === 0 && subrotinasAtivasLista.length === 0 && !rotinaPrincipalConcluida) {
            finalizarRotinaPrincipal(); // Finaliza a rotina principal se todas as subrotinas forem concluídas
        }

        atualizarLabels(); // Atualiza os labels
    };



    // Função para parar as subrotinas e limpar a memória
    const pararSubrotinas = () => {
        frameMemoria.innerHTML = ""; // Remove todos os elementos visuais
        subrotinasAtivasLista = []; // Reseta lista de ativas
        subrotinasConcluidasLista = []; // Reseta lista de concluídas
        filaSubrotinas = []; // Reseta fila de subrotinas
        temposRestantes = {}; // Reseta tempos restantes
        rotinaPrincipalConcluida = false; // Reseta estado da rotina principal
        overlayEmExecucao = false; // Reseta flag de execução
        atualizarLabels(); // Atualiza os labels
    };



    // Função para atualizar os textos dos labels
const atualizarLabels = () => {
    // Atualiza subrotinas ativas
    subrotinasAtivas.innerHTML = "Ativas: ";
    subrotinasAtivasLista.forEach(sub => {
        const span = document.createElement("span");
        span.className = "subrotina espera"; // Classe para subrotinas em espera
        span.textContent = sub;
        subrotinasAtivas.appendChild(span);
    });

    // Atualiza subrotinas na fila
    subrotinasFila.innerHTML = "Fila: ";
    filaSubrotinas.forEach(sub => {
        const span = document.createElement("span");
        span.className = "subrotina fila"; // Classe para subrotinas em fila
        span.textContent = sub;
        subrotinasFila.appendChild(span);
    });

    // Atualiza subrotinas concluídas
    subrotinasConcluidas.innerHTML = "Concluídas: ";
    subrotinasConcluidasLista.forEach(sub => {
        const span = document.createElement("span");
        span.className = "subrotina concluida"; // Classe para subrotinas concluídas
        span.textContent = sub;
        subrotinasConcluidas.appendChild(span);
    });
};


    // Função para gerar uma cor aleatória para estilizar as subrotinas
    const gerarCorAleatoria = () => {
        const cores = ["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF", "#FF4040"];
        return cores[Math.floor(Math.random() * cores.length)];
    };
    
    let modoAtual = null; // Variável para armazenar o modo atual (overlay ou paginação)

    botaoIniciar.addEventListener("click", () => {
    if (modoAtual === "overlay") {
        iniciarSubrotinas();
    } else if (modoAtual === "paginacao") {
        executarPaginacao();
    }
    
    });

    // Adiciona evento de clique ao botão de iniciar
    botaoIniciaroverlay.addEventListener("click", () => {
        pararSubrotinas(); // Limpa a memória antes de iniciar
        configurarSubrotinas(); // Prepara as subrotinas iniciais

        // Mostra as labels do overlay
        subrotinasAtivas.style.display = "flex";
        subrotinasFila.style.display = "flex";
        subrotinasConcluidas.style.display = "flex";

        // Esconde as labels da paginação
        document.getElementById("label-paginacao").style.display = "none";
        document.getElementById("label-paginacao-concluidas").style.display = "none";

        document.getElementById("titulo-memoria").textContent = "Memória Física";


        modoAtual = "overlay"; // Define o modo atual como overlay
    });

    botaoParar.addEventListener("click", () => {
    pararSubrotinas(); // Limpa tudo

    // Esconde todas as labels
    subrotinasAtivas.style.display = "none";
    subrotinasFila.style.display = "none";
    subrotinasConcluidas.style.display = "none";
    document.getElementById("label-paginacao").style.display = "none";
    document.getElementById("label-paginacao-concluidas").style.display = "none";

    // Limpa o frame de memória
    frameMemoria.innerHTML = "";

    // Reseta o modo atual
    modoAtual = null;

    // (Opcional) Reseta o título
    titulo_memoria.textContent = "MEMÓRIA";
});


//--------------------------------------------------------------------
//--------------------------------------------------------------------
//--------------------------------------------------------------------
/* Relacionado a paginação */
//--------------------------------------------------------------------
//--------------------------------------------------------------------

let paginaçãoEmExecucao = false; // Flag para verificar se a paginação está em execução

    botaoPaginacao.addEventListener("click", () => {
        // Esconde as labels normais
        subrotinasAtivas.style.display = "none";
        subrotinasFila.style.display = "none";
        subrotinasConcluidas.style.display = "none";

        titulo_memoria.textContent = "Memória Virtual"; // Altera o título da memória

        // Mostra a label de paginação
        document.getElementById("label-paginacao").style.display = "flex";
        document.getElementById("label-paginacao-concluidas").style.display = "flex";

         // Limpa as labels de paginação para estado inicial
        document.getElementById("label-paginacao").innerHTML = "Paginação:";
        document.getElementById("label-paginacao-concluidas").innerHTML = "Paginação Concluídas:";

        // Limpa o frame de memória
        frameMemoria.innerHTML = "";

         // Reseta blocos de paginação
        window.blocosPaginacao = [];


        preencherPaginacao();
        modoAtual = "paginacao"; // Define o modo atual como paginação
        
    });


    function preencherPaginacao() {
    const labelPaginacao = document.getElementById("label-paginacao");
    labelPaginacao.innerHTML = "Paginação:";

    const blocos = 10;
    const tamanhoBloco = 1024;

    // Salve referências dos blocos e espaços para usar depois
    window.blocosPaginacao = [];

    for (let i = 0; i < blocos; i++) {
        const bloco = document.createElement("div");
        bloco.className = "subespaco-paginacao";

        const endereco = document.createElement("span");
        endereco.textContent = `${i * tamanhoBloco} - ${(i + 1) * tamanhoBloco - 1}`;
        endereco.style.marginRight = "10px";
        endereco.style.fontWeight = "bold";
        endereco.style.width = "110px";
        bloco.appendChild(endereco);

        const espaco = document.createElement("div");
        espaco.className = "espaco-memoria fila"; // Começa como "em fila"
        espaco.style.width = "120px";
        espaco.style.height = "30px";
        espaco.style.border = "1px solid #333";
        espaco.textContent = `Pagina ${i + 1}`;
        bloco.appendChild(espaco);

        labelPaginacao.appendChild(bloco);

        // Salva referência para depois
        window.blocosPaginacao.push({ bloco, espaco });
    }
}

function executarPaginacao() {
    const frameMemoria = document.querySelector(".frame-memoria");
    const labelPaginacaoConcluidas = document.getElementById("label-paginacao-concluidas");
    if (!window.blocosPaginacao) return;

    const maxAtivas = 5;
    let proxima = 0;
    let rodando = 0;

    function processarProxima() {
        if (proxima >= window.blocosPaginacao.length) return;
        if (rodando >= maxAtivas) return;

        const { bloco, espaco } = window.blocosPaginacao[proxima];
        proxima++;
        rodando++;

        // Tempo aleatório entre 5 e 15 segundos
        let tempoRestante = Math.floor(Math.random() * 10) + 5;

        // Cria clone e elemento de tempo
        const blocoClone = bloco.cloneNode(true);
        const espacoClone = blocoClone.querySelector('.espaco-memoria');
        const tempoElemento = document.createElement("div");
        tempoElemento.className = "tempo-restante";
        tempoElemento.textContent = `${tempoRestante}s`;
        espacoClone.appendChild(tempoElemento);

        frameMemoria.appendChild(espacoClone);

        // Contador de tempo
        const atualizarTempo = () => {
            if (tempoRestante > 0) {
                tempoRestante--;
                tempoElemento.textContent = `${tempoRestante}s`;
                setTimeout(atualizarTempo, 1000);
            } else {
                espacoClone.classList.remove('fila');
                espacoClone.classList.add('concluida');

                const blocoConcluido = bloco.cloneNode(true);
                blocoConcluido.innerHTML = "";

                const endereco = bloco.querySelector('span').cloneNode(true);
                blocoConcluido.appendChild(endereco);
                blocoConcluido.appendChild(espacoClone);

                labelPaginacaoConcluidas.appendChild(blocoConcluido);

                rodando--;
                processarProxima(); // Preenche a vaga que ficou livre
            }
        };

        atualizarTempo(); // Inicia contagem
        processarProxima(); // Verifica se ainda há espaço para mais subrotinas
    }

    processarProxima();
}



    
});
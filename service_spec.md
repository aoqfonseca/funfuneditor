Specification: ZenWriter (Distraction-Free Markdown Editor)
1. Visão do Projeto

Criar um editor de texto desktop focado em escrita "distraction-free", utilizando Tauri (v2). O objetivo é uma interface minimalista, focada no texto, com persistência em arquivos .md locais e uma arquitetura pronta para integração futura de LLMs.
2. Stack Tecnológica

    Core/Backend: Rust (com serde, tauri e ropey para manipulação de texto).

    Frontend: SvelteKit (modo SPA), TypeScript.

    Estilo: Tailwind CSS (foco em tipografia, espaçamento generoso, largura de linha fixa).

    Interprocesso: Tauri Commands (invoke).

3. Arquitetura do Backend (Rust)

O backend deve ser responsável pela manipulação de arquivos e gerenciamento de estado.

    Persistência: Implementar um módulo de File I/O que ouve mudanças no buffer de texto do frontend.

    Debounce: O salvamento deve ser assíncrono com um debounce de 1 segundo para evitar I/O excessivo.

    Commands Necessários:

        load_file(path: String) -> String: Lê um arquivo Markdown do disco.

        save_file(path: String, content: String): Escreve o buffer no disco.

        process_text_with_ai(text: String, prompt: String): Stub/Mock que apenas retorna o texto original por enquanto (preparando para integração futura).

4. Requisitos do Frontend (Svelte)

    Layout: Modo full-screen ou windowed sem barras de ferramentas visíveis. O editor deve ocupar o centro da tela com largura máxima de 800px.

    Buffer de Edição: Utilizar um componente de edição (ou textarea customizado) que seja minimalista.

    Keybindings: Suporte a atalhos globais:

        Ctrl+S: Salvar manual.

        Ctrl+Shift+P: Abrir a "Command Palette" (para ações futuras como IA ou exportação).

    Feedback: O estado de "Saved" deve ser invisível ou extremamente sutil (ex: um pequeno brilho no canto da janela).

5. Estrutura de Diretórios Inicial
Plaintext

src-tauri/
  src/
    main.rs (commands e setup)
    file_manager.rs (lógica de leitura/escrita)
src/ (Frontend Svelte)
  lib/
    editor.svelte
    ai_service.ts
  routes/
    +page.svelte (interface principal)

6. Instruções para a IA (Prompt de Início)

    "Atue como um Arquiteto de Software. Vamos desenvolver um editor de texto minimalista chamado ZenWriter usando Tauri 2.0 (Rust/Svelte).

    Sua tarefa inicial:

        Configurar o projeto base com Tauri e Svelte.

        Implementar a lógica em Rust para ler e salvar arquivos .md no sistema de arquivos local.

        Criar a interface básica no Svelte onde o texto digitado é sincronizado com o arquivo via Command do Tauri.

        Manter o código limpo, modular e focado em performance (use ropey no backend).

        Priorize um design 'distraction-free' com CSS que centralize o conteúdo e limite a largura da linha.

    Comece estruturando os arquivos do backend em Rust e definindo os Commands iniciais."

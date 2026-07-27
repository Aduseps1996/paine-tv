# Teste final do Painel TV

Execute este roteiro primeiro no computador e depois no Fire TV Stick com o
Fully Kiosk. Só considere um item aprovado depois de observar o resultado na TV
publicada, e não apenas na prévia administrativa.

## 1. Preparação

- Confirmar que a URL inicial do Fully aponta para a rota pública `/`.
- Desativar zoom manual e confirmar escala padrão da página.
- Ativar **Keep Screen On**.
- Ativar **Enable JavaScript Interface** somente para a URL confiável do painel.
- Colocar a URL do painel na lista de URLs permitidas do Fully.
- Confirmar volume do Stick, da TV e do Fully.
- Reiniciar o Fully antes de iniciar o teste.

## 2. Publicação

- Alterar uma configuração simples no administrador.
- Confirmar que a Visão geral indica alteração pendente.
- Conferir o rascunho na aba Prévia da TV.
- Confirmar que a TV publicada ainda não mudou.
- Publicar pela aba Prévia da TV.
- Confirmar que a TV mudou sem precisar limpar dados do Firebase.
- Criar outra alteração, descartar e confirmar que ela não foi publicada.

## 3. Mídias

- Exibir imagem JPG, PNG e WebP.
- Exibir vídeo MP4 completo e confirmar avanço no encerramento.
- Exibir YouTube e confirmar início, encerramento e retorno à rotação.
- Confirmar que não há tela preta perceptível entre duas imagens.
- Confirmar que a troca para o próximo vídeo não deixa o painel travado.
- Simular uma URL inválida e confirmar uso do fallback sem parar a rotação.
- Conferir imagem do template Painel no espaço entre clima e rodapé.

## 4. Conteúdo dinâmico

- Testar notícia Normal.
- Testar notícia Institucional com “ADUSEPS INFORMA”.
- Testar notícia Ao vivo com ponto pulsando.
- Testar notícia Urgente com destaque vermelho.
- Testar comunicado na rotação.
- Testar comunicado como sobreposição.
- Testar Plantão Judicial padrão, temporário e retorno automático.
- Testar Contatos Oficiais com telefone, WhatsApp e site.
- Testar Escala Jurídica com documento válido e com documento ausente.

## 5. Chamada

- Fazer uma chamada nova e confirmar toque, matrícula, nome e profissional.
- Aguardar 15 segundos e confirmar fechamento local do cartão.
- Usar “chamar novamente” e confirmar repetição do toque e da voz.
- Reiniciar a página e confirmar que uma chamada antiga não reaparece.
- Confirmar que o computador usa a voz do navegador.
- Confirmar que o Stick usa a interface de voz do Fully.

Se a voz não funcionar no Stick:

1. Confirmar **Enable JavaScript Interface**.
2. Confirmar que a URL do painel é a única URL confiável permitida.
3. Fechar e abrir o Fully após mudar a opção.
4. Conferir se o mecanismo de texto para fala em português está instalado e
   ativo no Fire OS.
5. Repetir a chamada com o volume de mídia audível.

## 6. Programação

- Testar mídia com início futuro.
- Testar mídia dentro do intervalo permitido.
- Confirmar retirada automática após o horário final.
- Testar programação recorrente de sábado e domingo.
- Testar feriado, pausa e aviso temporário.
- Confirmar horário do painel no fuso `America/Recife`.

## 7. Rede e funcionamento contínuo

- Desconectar a internet por dois minutos.
- Confirmar que o painel não fecha nem mostra tela técnica.
- Reconectar e confirmar retomada dos dados.
- Atualizar conteúdo após a reconexão.
- Deixar o painel funcionando por pelo menos quatro horas.
- Durante o período, observar memória, travamentos, áudio e trocas de mídia.

## 8. Critério de aprovação

O painel está aprovado para uso quando:

- Não houver erro visível para o público.
- Rascunho, descarte e publicação tiverem comportamento previsível.
- Todas as categorias e banners aparecerem corretamente.
- A chamada repetir sem duplicar eventos.
- O Stick permanecer estável durante o teste contínuo.
- Usuários sem login não conseguirem alterar Firestore ou Storage.

# Segurança do Firebase

Esta base inclui `firestore.rules`, `storage.rules` e `firebase.json`.

## Comportamento adotado

- A rota pública da TV pode ler somente as coleções necessárias à exibição.
- Somente usuários autenticados podem alterar conteúdo publicado.
- Logs de publicação podem ser criados e consultados por usuário autenticado,
  mas não podem ser alterados ou excluídos.
- A TV não grava mais no documento da chamada.
- O Storage aceita somente JPG, PNG e WebP de até 5 MB na pasta de imagens.
- O Storage aceita somente MP4 de até 80 MB na pasta de vídeos.
- Caminhos e coleções não declarados ficam bloqueados.

## Antes de publicar as regras

1. Fazer backup das regras atuais no Console do Firebase.
2. Confirmar que o sistema que envia as chamadas usa Firebase Authentication.
3. Conferir se outro sistema da ADUSEPS usa coleções do mesmo projeto.
4. Se houver outras coleções legítimas, incorporá-las explicitamente antes do
   deploy. A regra final bloqueia tudo que não pertence ao Painel TV.

## Publicação

Com o Firebase CLI autenticado e o projeto correto selecionado:

```bash
firebase deploy --only firestore:rules,storage
```

Não publique as regras antes de confirmar o projeto selecionado. Depois do
deploy, teste leitura na TV sem login, publicação com login e tentativa de
gravação sem login.

## Limite desta versão

Nesta arquitetura, o conteúdo exibido na TV é público para leitura porque a
rota `/` não possui autenticação. Isso inclui o documento da chamada enquanto
ele estiver no Firestore. Uma evolução posterior pode autenticar cada aparelho
com identidade própria, permitindo retirar a leitura pública.

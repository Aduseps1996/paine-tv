# Painel TV

Painel institucional em Next.js para exibição em TV, com CMS administrativo, rotação de mídias, notícias de rodapé, chamadas de atendimento e configurações salvas no Firebase.

## Rotas

- `/`: painel público da TV.
- `/admin`: painel administrativo protegido por Firebase Auth.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Firebase Auth
- Cloud Firestore

## Estrutura

```txt
app/
  page.tsx                  # Tela pública do painel
  admin/page.tsx            # Página principal do CMS
  admin/components/         # Abas e layout do admin

components/
  BannerRotativo.tsx        # Rotação e templates de mídia
  RodapeNoticias.tsx        # Letreiro, tarja e informações do rodapé
  Chamada.tsx               # Chamada de atendimento
  tv/MediaPlayer.tsx        # Player compartilhado de imagem/vídeo

lib/
  firebase.ts               # Inicialização do Firebase
  firestore/                # Serviços de acesso ao Firestore

types/
  painel.ts                 # Tipos compartilhados do domínio

utils/
  numero.ts                 # Utilidades gerais
```

## Configuração

Crie um arquivo `.env.local` baseado em `.env.example`:

```txt
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Os valores atuais continuam como fallback em desenvolvimento, mas o recomendado é configurar as variáveis por ambiente.

## Comandos

```bash
npm run dev
npm run build
npm run lint
npx tsc --noEmit
```

## Coleções do Firestore

- `midias`: imagens, vídeos, lives e templates exibidos no painel.
- `noticias`: mensagens exibidas no rodapé.
- `configuracoes/geral`: configurações visuais e comportamentais.
- `painel_chamadas/atual`: chamada ativa de atendimento.

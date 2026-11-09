# Publicação na Google Play — Minha Vida Financeira

## Identificação do aplicativo
- Nome: Minha Vida Financeira
- ID do pacote: br.com.minhavida.financeira
- Categoria sugerida: Finanças
- Idioma principal: Português (Brasil)
- E-mail de suporte: guto_bn@hotmail.com
- Política de privacidade: https://guto157.github.io/minha-vida-finaceira/privacidade.html
- Exclusão de conta: https://guto157.github.io/minha-vida-finaceira/excluir-conta.html
- Contém anúncios: Sim, Google AdMob
- SDK de anúncios: @capacitor-community/admob 7.2.0

## Texto para a ficha da loja

### Descrição curta
Organize dívidas, pagamentos e metas para acompanhar sua vida financeira.

### Descrição completa
Organize suas dívidas e pagamentos em um caderno financeiro simples e fácil de acompanhar.

Com o Minha Vida Financeira, você pode:

• Registrar dívidas com descrição, valor e data.
• Registrar pagamentos e acompanhar o saldo.
• Consultar o histórico de cada mês.
• Acompanhar sua evolução na área Reserva.
• Definir uma meta mensal e registrar valores guardados.
• Fazer backup dos seus registros e restaurar quando precisar.
• Criar uma conta para sincronizar seus dados entre aparelhos.
• Excluir sua conta e os dados associados diretamente pelo aplicativo.

Seus registros podem ficar salvos no próprio aparelho. Ao conectar uma conta, os dados necessários são sincronizados com segurança para que você possa acessá-los em outros dispositivos.

O Minha Vida Financeira é uma ferramenta de organização pessoal. Ele não oferece empréstimos, crédito, investimentos ou aconselhamento financeiro.

## Declarações e formulários do Play Console

### Anúncios
- Declarar que o aplicativo contém anúncios.
- O app usa Google AdMob para exibir banners.
- O SDK de anúncios pode coletar endereço IP, interações com o aplicativo, informações de diagnóstico e identificadores do dispositivo para publicidade, análise e prevenção de fraude. Consulte a documentação oficial do Google AdMob antes de preencher o formulário Data safety.

### Data safety — base para preencher
Revise as opções do formulário e declare, no mínimo, os tipos de dados correspondentes ao comportamento real dos SDKs e do aplicativo:

- Endereço de e-mail: usado para criar e acessar a conta Supabase.
- Informações financeiras fornecidas pelo usuário: descrições, valores, datas, dívidas, pagamentos e registros da Reserva, armazenados localmente e enviados à Supabase quando a sincronização é utilizada.
- Identificadores do dispositivo: o Google Mobile Ads SDK pode coletar identificador de publicidade e App Set ID.
- Atividade no aplicativo: interações com o aplicativo coletadas pelo SDK de anúncios.
- Informações de diagnóstico: dados de desempenho e diagnóstico coletados pelo SDK de anúncios.
- Endereço IP: coletado pelo SDK de anúncios; pode ser usado para estimar localização geral.
- Dados em trânsito: a comunicação com Supabase e Google ocorre por conexão criptografada.
- Exclusão: disponível no aplicativo e por solicitação ao suporte.

Não marque o formulário como “nenhum dado coletado”. A declaração final deve corresponder à versão exata enviada e aos dados coletados por todos os SDKs incluídos.

### Acesso ao aplicativo
As funções básicas de lançamentos e Reserva podem ser usadas sem conta. A sincronização e a exclusão de conta exigem login. Para a análise da Google Play, prepare uma conta de demonstração de teste se o revisor precisar acessar essas áreas.

### Público-alvo e conteúdo
O aplicativo é uma ferramenta de organização financeira de uso geral, não direcionada a crianças. Responda ao questionário de classificação indicativa conforme o conteúdo real do aplicativo.

## Arquivos gráficos exigidos na ficha da loja
Preparar e enviar pelo Play Console:
- Ícone da loja: PNG de 512 × 512 px.
- Imagem de destaque: 1024 × 500 px.
- Capturas de tela reais do aplicativo em telefone. Use pelo menos duas capturas que mostrem Lançamentos e Reserva.
- As imagens devem corresponder à versão efetivamente enviada e não podem prometer funções inexistentes.

## Requisitos técnicos preparados no repositório
- ID do pacote: br.com.minhavida.financeira.
- Capacitor 7 e plugin AdMob 7.2.0.
- Workflow GitHub Actions para gerar AAB com Android 16 / API 36.
- Política de privacidade publicada e vinculada dentro do app.
- Página pública de exclusão de conta.
- Assinatura de lançamento: exige uma chave de upload permanente configurada nos GitHub Actions Secrets antes de gerar o AAB final para envio.

## Importante antes de enviar
A compilação precisa terminar com sucesso e o AAB precisa estar assinado com a chave de upload permanente. Também é necessário testar o app em aparelho real, completar todos os formulários do Play Console, enviar os gráficos e fornecer acesso de teste quando solicitado.

Contas pessoais de desenvolvedor criadas após 13 de novembro de 2023 precisam cumprir o teste fechado com pelo menos 12 participantes inscritos continuamente por 14 dias antes de solicitar acesso à produção.

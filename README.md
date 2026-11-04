# Minha Vida Financeira

Caderno financeiro digital para registrar dívidas e pagamentos por mês.

## Funcionalidades da primeira versão
- Folha mensal com lançamentos de dívidas e pagamentos.
- Saldo calculado automaticamente: saldo transportado + dívidas - pagamentos.
- Saldo final de um mês transportado automaticamente para a folha do mês seguinte, sem repetir lançamentos antigos.
- Histórico mensal para consultar folhas anteriores.
- Exclusão individual de lançamentos com recálculo do saldo.
- Exportação de backup em JSON.
- Interface responsiva e instalável como PWA em navegadores compatíveis.

## Executar
Abra `index.html` em um servidor estático. Para publicar gratuitamente, o GitHub Pages pode ser ativado em Settings > Pages > Deploy from a branch > main > /(root).

## Dados e privacidade
Os dados desta versão ficam no armazenamento local do navegador (`localStorage`). Eles não são sincronizados entre aparelhos. Exporte o backup antes de limpar os dados do navegador ou desinstalar o app. O backup contém seus registros financeiros, portanto guarde-o em local privado.

## Próxima etapa Android
Esta versão é a base web/PWA. A preparação do pacote Android (APK/AAB) com Capacitor e a configuração de publicação na Play Store serão feitas em uma etapa seguinte.

# Instruções para adicionar a Logo - Aconteceu Hoje

## Passo 1: Salvar a imagem da logo

1. Salve a imagem da logo "Aconteceu Hoje" que você anexou
2. Salve com o nome exato: `logo.png`
3. Coloque o arquivo na pasta: `assets/logo.png`

## Passo 2: Descomentar o código da logo

Após adicionar a imagem, abra o arquivo `app/(tabs)/profile.js` e faça as seguintes alterações:

### Localize estas linhas (aproximadamente linha 72-81):

```javascript
{
  /* Temporariamente use uma View com texto até adicionar a logo */
}
{
  /* <Image
  source={require('../../assets/logo.png')}
  style={styles.logo}
  resizeMode="contain"
/> */
}
<View style={styles.logoPlaceholder}>
  <Text style={styles.logoTitle}>ACONTECEU</Text>
  <Text style={styles.logoSubtitle}>HOJE</Text>
</View>;
```

### Substitua por:

```javascript
{
  /* Logo "Aconteceu Hoje" */
}
<Image
  source={require("../../assets/logo.png")}
  style={styles.logo}
  resizeMode="contain"
/>;
```

## Resultado

A logo será exibida no cabeçalho da página de perfil com um fundo branco arredondado e sombra, criando um efeito elegante.

## Características da estilização:

- ✅ Cabeçalho com cor sólida (#4A5568 - cinza escuro)
- ✅ Logo centralizada com fundo branco e sombra
- ✅ Informações do perfil organizadas em cards
- ✅ Estatísticas do diário em grade
- ✅ Lista de entradas recentes com bordas douradas (#D4AF37)
- ✅ Botão de editar perfil e logout estilizados
- ✅ Design responsivo e moderno
- ✅ Paleta de cores inspirada na identidade visual da logo

## Cores principais utilizadas:

- Primária: #4A5568 (Cinza escuro)
- Secundária: #D4AF37 (Dourado)
- Fundo: #F7FAFC (Cinza muito claro)
- Texto: #2D3748 (Cinza escuro)
- Destaque: #E53E3E (Vermelho para logout)

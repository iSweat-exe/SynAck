# Ton premier programme

> **Objectif** : à la fin de ce chapitre, tu sais écrire un programme de plusieurs instructions qui affiche du texte dans le bon ordre, et tu sais lire le message d'erreur quand il refuse de démarrer.

## L'idée

Un **programme**, c'est une liste d'**instructions**. L'ordinateur les exécute **l'une après l'autre, de haut en bas**, et fait *exactement* ce qu'on lui dit : ni plus, ni moins. Il ne devine rien et n'improvise jamais.

Pense à une recette de cuisine écrite pour quelqu'un qui n'a jamais cuisiné : si tu oublies une étape, ou si tu les écris dans le désordre, le gâteau est raté. Programmer, c'est écrire une recette sans ambiguïté.

La première instruction à connaître est celle qui **affiche** du texte à l'écran :

- en JavaScript : `console.log(...)`
- en Python : `print(...)`

## Un exemple pas à pas

Voici un programme de trois instructions. Il affiche trois lignes, dans l'ordre :

```javascript
console.log("Bonjour !");
console.log("Je m'appelle SynAck.");
console.log("Enchanté.");
```

```python
print("Bonjour !")
print("Je m'appelle SynAck.")
print("Enchanté.")
```

Résultat affiché, dans les deux langages :

```plaintext
Bonjour !
Je m'appelle SynAck.
Enchanté.
```

Regardons une ligne de plus près :

- `console.log` ou `print` est le **nom de l'instruction** ;
- les **parenthèses** contiennent ce qu'on lui donne à afficher ;
- le texte est entouré de **guillemets** : on appelle cela une *chaîne de caractères* ;
- en JavaScript, on termine souvent la ligne par un point-virgule `;`. En Python, on ne le met pas.

**L'ordre compte.** Si tu inverses les deux premières lignes, l'affichage s'inverse aussi : l'ordinateur suit ta liste, pas ton intention.

## Les commentaires

Un **commentaire** est une phrase que l'ordinateur ignore, écrite pour les humains qui liront le code, y compris toi dans trois semaines :

```javascript
// Cette ligne est ignorée par l'ordinateur
console.log("Salut"); // un commentaire peut aussi suivre une instruction
```

```python
# Cette ligne est ignorée par l'ordinateur
print("Salut")  # un commentaire peut aussi suivre une instruction
```

En JavaScript, un commentaire commence par `//`. En Python, par `#`.

## Quand ça ne marche pas : lire une erreur

Tu vas faire des erreurs, tout le monde en fait. Ce qui compte, c'est de savoir **lire le message**. Oublie le guillemet fermant :

```javascript
console.log("Bonjour);
```

```python
print("Bonjour)
```

L'ordinateur refuse de démarrer et t'écrit, en anglais, quelque chose comme :

```plaintext
SyntaxError: Invalid or unexpected token          (JavaScript)
SyntaxError: unterminated string literal          (Python)
```

Un message d'erreur contient presque toujours trois informations utiles :

1. **le type** de l'erreur (ici `SyntaxError`, une erreur d'écriture : le code ne respecte pas la grammaire du langage) ;
2. **une explication** (ici : une chaîne de caractères n'est jamais refermée) ;
3. **la ligne** concernée, souvent soulignée avec une flèche `^`.

Un message d'erreur n'est pas un reproche : c'est un indice que l'ordinateur te donne gratuitement.

## À retenir

- Un programme est une **liste d'instructions** exécutées **dans l'ordre**, de haut en bas.
- On affiche avec `console.log(...)` en JavaScript et `print(...)` en Python.
- Le texte s'écrit entre **guillemets**.
- Un **commentaire** (`//` en JavaScript, `#` en Python) est ignoré par l'ordinateur.
- Un message d'erreur donne **le type, l'explication et la ligne** : lis-le avant de paniquer.

## Quiz

Essaie de répondre sans relire le chapitre.

**Question 1.** Que fait un ordinateur quand il exécute un programme ?

- A. Il devine ce que tu voulais écrire et corrige tout seul.
- B. Il exécute les instructions l'une après l'autre, de haut en bas.
- C. Il les exécute dans un ordre aléatoire.

**Question 2.** Qu'affiche ce programme ?

```javascript
console.log("Bonjour");
// console.log("tout le monde");
console.log("à toi");
```

```python
print("Bonjour")
# print("tout le monde")
print("à toi")
```

**Question 3.** En une phrase : à quoi sert un commentaire ?

## Code à corriger

Ce programme doit faire un compte à rebours, mais il affiche `3`, `1`, `2`, puis `Décollage !`. Il y a **un seul bug**. Trouve-le et corrige-le.

```javascript
console.log(3);
console.log(1);
console.log(2);
console.log("Décollage !");
```

```python
print(3)
print(1)
print(2)
print("Décollage !")
```

## Exercice

Tu viens de rejoindre un club de programmation. Écris un programme qui affiche **ta carte de visite** en trois lignes : ton nom, ce que tu apprends, puis une ligne de séparation de 20 tirets. Par exemple :

```plaintext
Ada Lovelace
Apprend la programmation
--------------------
```

Écris-le d'abord, puis seulement ensuite regarde le corrigé.

## Corrigés

**Quiz, question 1 : B.** L'ordinateur suit ta liste à la lettre, du haut vers le bas. Il ne devine rien (A) et ne mélange pas les lignes (C).

**Quiz, question 2.** Le programme affiche deux lignes :

```plaintext
Bonjour
à toi
```

La ligne du milieu est un commentaire : l'ordinateur l'ignore, donc `tout le monde` n'apparaît jamais.

**Quiz, question 3.** Un commentaire sert à expliquer le code aux humains (pourquoi on fait ça, ce que fait cette partie). L'ordinateur, lui, ne le lit pas.

**Code à corriger.** Le bug est un **bug d'ordre** : les instructions s'exécutent dans l'ordre où elles sont écrites, donc `1` passe avant `2` mais après `3`. Il faut écrire `3`, puis `2`, puis `1` :

```javascript
console.log(3);
console.log(2);
console.log(1);
console.log("Décollage !");
```

```python
print(3)
print(2)
print(1)
print("Décollage !")
```

**Exercice.** Une solution possible :

```javascript
console.log("Ada Lovelace");
console.log("Apprend la programmation");
console.log("--------------------");
```

```python
print("Ada Lovelace")
print("Apprend la programmation")
print("--------------------")
```

Pour aller plus loin : change les trois lignes pour mettre ton nom et ce que tu apprends vraiment, puis ajoute une quatrième ligne avec ton adresse e-mail.

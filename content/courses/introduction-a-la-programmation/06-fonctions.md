# Les fonctions : des recettes qu'on réutilise

> **Objectif** : à la fin de ce chapitre, tu sais écrire et appeler une fonction avec des paramètres et une valeur de retour, et tu sais pourquoi `return` n'est pas la même chose qu'afficher.

## L'idée

Dans le magasin, tu as écrit le calcul de la remise. Si tu en as besoin pour trois clients, tu vas copier ce bloc trois fois ? Et si la règle change (la remise passe à 15 %), tu devras la corriger trois fois, sans en oublier une.

Une **fonction** est une **recette à laquelle on donne un nom**. On l'écrit une fois ; on l'**appelle** autant de fois qu'on veut. Elle a quatre ingrédients :

- un **nom** (`prixApresRemise`) ;
- des **paramètres** : les « ingrédients » qu'on lui donne (`total`) ;
- un **corps** : les instructions qu'elle exécute ;
- un **résultat** renvoyé avec le mot **`return`**.

Écrire une fonction, c'est la **définir** : cela ne l'exécute pas. Elle ne s'exécute que lorsqu'on l'**appelle**.

## Un exemple pas à pas : la remise dans une fonction

Reprenons les règles du chapitre 4 : 10 % dès 50 €, 20 % dès 100 €.

```javascript
function prixApresRemise(total) {
  let remise = 0;
  if (total >= 100) {
    remise = 0.2;
  } else if (total >= 50) {
    remise = 0.1;
  }
  return total * (1 - remise);
}

console.log(prixApresRemise(64));
console.log(prixApresRemise(120));
console.log(prixApresRemise(30));
```

```python
def prix_apres_remise(total):
    remise = 0
    if total >= 100:
        remise = 0.2
    elif total >= 50:
        remise = 0.1
    return total * (1 - remise)


print(prix_apres_remise(64))
print(prix_apres_remise(120))
print(prix_apres_remise(30))
```

Résultat (en Python, `96` s'affiche `96.0`, car c'est un nombre décimal) :

```plaintext
57.6
96
30
```

Décortiquons :

- en JavaScript, on définit avec le mot `function` ; en Python, avec `def` et un deux-points ;
- `total` est le **paramètre** : un nom, à l'intérieur de la fonction, pour la valeur qu'on lui donnera ;
- `prixApresRemise(64)` est un **appel** : `64` est l'**argument**, la vraie valeur qui prend la place de `total` pour ce tour-là ;
- `return` **renvoie** le résultat à l'endroit de l'appel et **arrête** la fonction. On peut ranger ce résultat dans une variable, l'afficher, ou s'en servir dans un autre calcul.

Une fonction avec plusieurs paramètres les reçoit **dans l'ordre** : `function prixTotal(prix, quantite)` s'appelle avec `prixTotal(12.5, 3)`.

## return n'est pas print

C'est la confusion la plus fréquente des débutants. `print` (ou `console.log`) **affiche** un texte à l'écran pour un humain. `return` **renvoie** une valeur au reste du programme.

Qu'arrive-t-il si une fonction affiche, mais ne renvoie rien ?

```javascript
function saluer(nom) {
  console.log("Bonjour " + nom);
}

console.log(saluer("Ada"));
```

```python
def saluer(nom):
    print("Bonjour " + nom)


print(saluer("Ada"))
```

Le programme affiche d'abord `Bonjour Ada` (dans la fonction), puis `undefined` en JavaScript, `None` en Python. Une fonction qui n'a pas de `return` renvoie **« rien »** : `undefined` ou `None`, qui veulent dire « il n'y a pas de valeur ». Si tu essaies de calculer avec ce « rien », tu auras un problème.

## Les variables d'une fonction restent chez elle

Les variables créées **dans** une fonction, comme `remise` plus haut, n'existent **que** dans cette fonction. C'est la **portée** (*scope*). En dehors, elles sont inconnues :

```javascript
console.log(remise);
```

```python
print(remise)
```

Ces lignes, placées après l'appel de la fonction, produisent `ReferenceError: remise is not defined` en JavaScript et `NameError: name 'remise' is not defined` en Python. Si une fonction doit communiquer un résultat, elle le fait par son `return`, pas en laissant traîner ses variables.

## À retenir

- Une **fonction** est une recette nommée : on la **définit** une fois, on l'**appelle** plusieurs fois.
- Les **paramètres** sont les noms des valeurs reçues ; les **arguments** sont les valeurs données à l'appel, **dans l'ordre**.
- **`return`** renvoie un résultat et arrête la fonction ; sans `return`, on obtient `undefined` (JavaScript) ou `None` (Python).
- **`return` ≠ afficher** : afficher est pour l'humain, `return` est pour le programme.
- Les variables d'une fonction sont **locales** : invisibles à l'extérieur.

## Quiz

**Question 1.** Que vaut `double(4)` ?

```javascript
function double(n) {
  return n * 2;
}
```

```python
def double(n):
    return n * 2
```

**Question 2.** Rappel du chapitre précédent : combien de nombres ce programme affiche-t-il, et lesquels ?

```javascript
for (let i = 1; i <= 3; i++) {
  console.log(double(i));
}
```

```python
for i in range(1, 4):
    print(double(i))
```

**Question 3.** Quelle est la différence entre `console.log(x)` / `print(x)` et `return x` dans une fonction ?

**Question 4.** Qu'affiche la dernière ligne de ce programme, et pourquoi ?

```javascript
function saluer(nom) {
  console.log("Bonjour " + nom);
}
console.log(saluer("Ada"));
```

```python
def saluer(nom):
    print("Bonjour " + nom)

print(saluer("Ada"))
```

## Code à corriger

Cette fonction doit calculer un prix toutes taxes comprises (TVA de 20 %), puis le programme ajoute 5 € de frais de port. Mais le résultat est faux. Il y a **un seul bug**.

```javascript
function ttc(ht) {
  console.log(ht * 1.2);
}

let prix = ttc(50);
console.log("Avec le port : " + (prix + 5));
```

```python
def ttc(ht):
    print(ht * 1.2)


prix = ttc(50)
print("Avec le port : " + str(prix + 5))
```

Le résultat attendu est `Avec le port : 65`.

## Exercice

Écris deux fonctions :

1. `tarifCinema(age)` (ou `tarif_cinema(age)` en Python) qui **renvoie** le tarif de séance du chapitre 4 : moins de 12 ans, 5 € ; de 12 à 25 ans, 8 € ; au-delà, 11 € ;
2. `sommeJusqua(n)` (ou `somme_jusqua(n)`) qui **renvoie** la somme des nombres de 1 à `n` (pour `n = 4`, c'est 1 + 2 + 3 + 4 = 10).

Teste-les avec des appels affichés : `tarifCinema(12)` doit donner 8, `tarifCinema(26)` doit donner 11, `sommeJusqua(4)` doit donner 10, et `sommeJusqua(100)` doit donner 5050 (tu connais déjà ce résultat).

Utilise bien `return` dans les deux fonctions : c'est le but de l'exercice.

## Corrigés

**Question 1.** `double(4)` vaut `8`. L'argument `4` prend la place du paramètre `n`, la fonction calcule `4 * 2`, et `return` renvoie ce résultat.

**Question 2.** Trois nombres : `2`, `4` et `6`. Pour `i` valant 1, 2 puis 3 (en Python, `range(1, 4)` s'arrête avant 4), on appelle `double(i)` et on affiche ce qu'elle renvoie.

**Question 3.** `console.log` / `print` **affiche** une valeur à l'écran, pour un humain, et ne la rend pas disponible au reste du programme. `return` **renvoie** la valeur à l'endroit de l'appel, où l'on peut la ranger dans une variable ou la réutiliser dans un calcul.

**Question 4.** La dernière ligne affiche `Bonjour Ada` (par la fonction), puis `undefined` en JavaScript ou `None` en Python. La fonction n'a pas de `return` : elle ne renvoie « rien », et c'est ce « rien » que l'on affiche ensuite.

**Code à corriger.** Le bug est que `ttc` **affiche** son résultat au lieu de le **renvoyer** : `prix` reçoit donc `undefined` (JavaScript) ou `None` (Python). En JavaScript, `undefined + 5` donne `NaN` (« not a number »), en Python l'addition provoque une `TypeError`. Il faut remplacer l'affichage par un `return` :

```javascript
function ttc(ht) {
  return ht * 1.2;
}

let prix = ttc(50);
console.log("Avec le port : " + (prix + 5));
```

```python
def ttc(ht):
    return ht * 1.2


prix = ttc(50)
print("Avec le port : " + str(prix + 5))
```

Le programme affiche maintenant `Avec le port : 65` (65.0 en Python). Quand une fonction calcule quelque chose dont on se servira ensuite, elle doit le **renvoyer**.

**Exercice.** Une solution :

```javascript
function tarifCinema(age) {
  if (age < 12) {
    return 5;
  } else if (age <= 25) {
    return 8;
  }
  return 11;
}

function sommeJusqua(n) {
  let somme = 0;
  for (let i = 1; i <= n; i++) {
    somme = somme + i;
  }
  return somme;
}

console.log(tarifCinema(12));
console.log(tarifCinema(26));
console.log(sommeJusqua(4));
console.log(sommeJusqua(100));
```

```python
def tarif_cinema(age):
    if age < 12:
        return 5
    elif age <= 25:
        return 8
    return 11


def somme_jusqua(n):
    somme = 0
    for i in range(1, n + 1):
        somme = somme + i
    return somme


print(tarif_cinema(12))
print(tarif_cinema(26))
print(somme_jusqua(4))
print(somme_jusqua(100))
```

Résultat : `8`, `11`, `10` et `5050`. Observe deux choses : les `return` à l'intérieur des `if` arrêtent la fonction immédiatement (on n'a donc pas besoin d'un `else` final), et `range(1, n + 1)` inclut bien `n`, car la borne de fin de `range` est exclue.

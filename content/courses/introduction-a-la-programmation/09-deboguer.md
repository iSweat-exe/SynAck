# Déboguer : trouver et corriger un bug

> **Objectif** : à la fin de ce chapitre, tu sais reconnaître les trois sortes d'erreurs, lire un message d'erreur, et corriger un bug avec une méthode au lieu de tâtonner.

## L'idée

Tous les programmeurs, débutants comme expérimentés, passent une bonne partie de leur temps à **chercher des bugs**. Ce n'est pas un signe que tu es mauvais : c'est le métier. La différence entre un débutant frustré et un développeur efficace n'est pas qu'il fait moins d'erreurs, c'est qu'il a **une méthode** pour les trouver.

Tu en as déjà rencontré tout au long du cours. Ce chapitre les range en trois familles et te donne une méthode.

## Les trois sortes d'erreurs

**1. L'erreur de syntaxe.** Le code est mal écrit : un guillemet manquant, une parenthèse oubliée, une indentation fausse. Le programme **refuse de démarrer** et te dit où (chapitre 2). C'est la plus facile à corriger : le message pointe presque toujours la ligne.

**2. L'erreur d'exécution.** Le code est bien écrit, le programme démarre, puis il **plante en route** parce qu'il fait quelque chose d'impossible : lire l'indice d'une liste qui n'existe pas (`IndexError`), diviser par zéro (`ZeroDivisionError`), lire une clé absente (`KeyError`), utiliser une variable qui n'existe pas (`NameError` / `ReferenceError`).

**3. L'erreur de logique.** Le programme tourne **jusqu'au bout sans aucun message**, mais **le résultat est faux** : `+` au lieu de `*` (chapitre 3), `<=` au lieu de `<` (chapitre 4). C'est la plus sournoise, car personne ne te dit qu'il y a un problème. Seule ta tête sait ce que le programme *devrait* afficher.

## Lire un message d'erreur

Quand le programme plante, lis le message **en entier, par la fin**. Voici un programme Python qui divise par zéro :

```python
def diviser(a, b):
    return a / b


print(diviser(10, 0))
```

Il produit :

```plaintext
Traceback (most recent call last):
  File "exemple.py", line 5, in <module>
    print(diviser(10, 0))
  File "exemple.py", line 2, in diviser
    return a / b
ZeroDivisionError: division by zero
```

- **La dernière ligne** donne le type d'erreur et son explication : `ZeroDivisionError: division by zero` (« division par zéro »). C'est ce qu'il faut lire en premier ;
- **les lignes au-dessus** racontent le chemin parcouru, de l'appel initial (ligne 5) jusqu'à l'instruction qui a planté (ligne 2, dans `diviser`) ;
- les **numéros de ligne** te disent où regarder.

En JavaScript, le principe est le même : la **première ligne** du message donne le type et l'explication, par exemple `TypeError: Cannot read properties of undefined (reading 'length')` (on a demandé la taille de quelque chose qui n'existe pas), suivie du chemin parcouru.

Ne traduis pas mot à mot : repère le **type** (`TypeError`, `KeyError`...) et l'**objet** concerné (`undefined`, `'kiwi'`...). Et si tu ne comprends pas, copie le message dans un moteur de recherche : des milliers de personnes l'ont déjà eu avant toi.

## La méthode en quatre étapes

Quand le résultat est faux, ne modifie pas le code au hasard. Procède dans l'ordre :

1. **Reproduis** le problème avec le plus petit exemple possible (une liste de 3 notes, pas de 300).
2. **Prédis** ce que le programme *devrait* afficher, en le calculant à la main. Sans cette prédiction, tu ne sais pas où est l'écart.
3. **Observe** : affiche les valeurs intermédiaires avec `console.log` ou `print` pour voir à quel moment le programme s'écarte de ta prédiction.
4. **Une hypothèse, une modification, un test.** Change **une seule chose** à la fois, relance, et regarde si cela a corrigé le problème.

Quand tu es vraiment bloqué·e, essaie d'**expliquer ton code à voix haute**, ligne par ligne, à quelqu'un (ou à un canard en plastique : c'est une vraie technique). Très souvent, la réponse apparaît pendant que tu parles.

## Un exemple pas à pas : une moyenne qui se trompe

Cette fonction doit calculer la moyenne d'une liste de notes. Pour `[12, 15, 9, 18]`, elle devrait renvoyer `13.5`. Elle renvoie autre chose :

```javascript
function moyenne(notes) {
  let somme = 0;
  for (const note of notes) {
    somme = somme + note;
    return somme / notes.length;
  }
}

console.log(moyenne([12, 15, 9, 18]));
```

```python
def moyenne(notes):
    somme = 0
    for note in notes:
        somme = somme + note
        return somme / len(notes)


print(moyenne([12, 15, 9, 18]))
```

Le programme affiche `3` (ou `3.0` en Python). Aucune erreur : c'est donc une **erreur de logique**. Appliquons la méthode.

1. **Reproduire :** on a déjà un petit exemple, 4 notes.
2. **Prédire :** la somme vaut 12 + 15 + 9 + 18 = 54, et 54 / 4 = 13.5. On attend 13.5, on obtient 3 : c'est 12 / 4, soit **la première note seulement** divisée par 4.
3. **Observer :** ajoutons un affichage dans la boucle, juste après le calcul de la somme :

```javascript
console.log("tour", note, somme);
```

```python
print("tour", note, somme)
```

On voit s'afficher `tour 12 12`, et **une seule fois**. La boucle ne fait qu'un tour : elle s'arrête après la note 12.
4. **Hypothèse :** quelque chose arrête la boucle trop tôt. Qu'est-ce qui sort d'une fonction ? `return`. Il est **à l'intérieur de la boucle** : au premier tour, la fonction renvoie `12 / 4` et s'arrête. On le sort de la boucle, en le décalant vers la gauche pour qu'il s'exécute **après** la boucle :

```javascript
function moyenne(notes) {
  let somme = 0;
  for (const note of notes) {
    somme = somme + note;
  }
  return somme / notes.length;
}
```

```python
def moyenne(notes):
    somme = 0
    for note in notes:
        somme = somme + note
    return somme / len(notes)
```

On relance : `13.5`. Bug trouvé, **par méthode** et pas par chance.

## À retenir

- Trois sortes d'erreurs : **syntaxe** (le programme ne démarre pas), **exécution** (il plante en route), **logique** (il tourne mais le résultat est faux).
- Lis un message d'erreur **par la fin** : type et explication, puis le numéro de ligne.
- La méthode : **reproduire** petit, **prédire** le bon résultat, **observer** avec des affichages, **une** hypothèse et **une** modification à la fois.
- Les erreurs de logique sont les plus dures : il faut savoir ce qu'on attend, donc **calcule le résultat à la main**.

## Quiz

**Question 1.** Classe chaque situation : erreur de syntaxe, d'exécution ou de logique ?

- a. Tu as oublié de fermer une parenthèse : le programme ne démarre pas.
- b. Le programme affiche 15 alors que le résultat devrait être 50, sans aucun message.
- c. Le programme démarre puis s'arrête à la ligne 8 avec `ZeroDivisionError`.

**Question 2.** Un programme affiche un total faux, sans message d'erreur. Quelle est la meilleure première étape ?

- A. Le relancer plusieurs fois en espérant que le résultat change.
- B. Calculer à la main le résultat attendu, puis afficher les valeurs intermédiaires pour voir où le programme s'en écarte.
- C. Tout réécrire depuis le début.

**Question 3.** Rappel du chapitre sur les boucles : ton programme semble figé et ne s'arrête jamais. Quelle est la cause la plus probable ?

**Question 4.** Rappel du chapitre sur les listes : en Python, ton programme plante avec `IndexError: list index out of range`. De quelle sorte d'erreur s'agit-il, et quelle en est la cause la plus fréquente ?

## Code à corriger

Cette fonction calcule les frais de livraison : **gratuite dès 40 €**, sinon 4,90 €. Elle contient **deux bugs**, qui viennent de chapitres différents. Trouve-les avec la méthode du chapitre, **en les corrigeant un par un**.

Ces appels doivent donner : `fraisDeLivraison(39.99)` → `4.9`, `fraisDeLivraison(40)` → `0`, `fraisDeLivraison(80)` → `0`.

```javascript
function fraisDeLivraison(total) {
  if (total > 40) {
    return 0;
  } else {
    console.log(4.9);
  }
}

console.log(fraisDeLivraison(39.99));
console.log(fraisDeLivraison(40));
console.log(fraisDeLivraison(80));
```

```python
def frais_de_livraison(total):
    if total > 40:
        return 0
    else:
        print(4.9)


print(frais_de_livraison(39.99))
print(frais_de_livraison(40))
print(frais_de_livraison(80))
```

## Exercice

Ce n'est plus seulement du code à écrire : ici, tu vas **écrire les tests d'abord**, comme le font les développeurs.

Une année est **bissextile** si elle est divisible par 4, **sauf** si elle est divisible par 100, **à moins qu'**elle ne soit aussi divisible par 400. Écris une fonction `estBissextile(annee)` (`est_bissextile(annee)` en Python) qui **renvoie** vrai ou faux.

Avant d'écrire la fonction, **prédis** les résultats que tu dois obtenir, à la main :

- 2024 : bissextile ;
- 2023 : pas bissextile ;
- 1900 : pas bissextile (divisible par 100, mais pas par 400) ;
- 2000 : bissextile (divisible par 400) ;
- 2100 : pas bissextile.

Écris ensuite la fonction et affiche son résultat pour chacune de ces années : les cinq doivent correspondre à tes prédictions. Si l'un ne correspond pas, c'est le moment d'appliquer la méthode.

Pour t'aider : le reste de la division s'obtient avec `%`, et tu as vu `&&` / `and` et `||` / `or` au chapitre 4.

## Corrigés

**Question 1.** a. Erreur de **syntaxe** (le programme ne démarre pas). b. Erreur de **logique** (il tourne, mais le résultat est faux). c. Erreur d'**exécution** (il démarre, puis plante).

**Question 2 : B.** Sans calcul préalable, tu ne sais pas ce que tu cherches. Relancer en espérant (A) ne change rien : le programme est déterministe. Tout réécrire (C) perd du temps et réintroduit souvent les mêmes erreurs.

**Question 3.** Une **boucle infinie**, très probablement parce qu'une variable de la condition n'est jamais modifiée dans la boucle (on a oublié `i = i + 1`).

**Question 4.** C'est une erreur d'**exécution**. La cause la plus fréquente est une erreur de décalage d'un cran (*off-by-one*) : la boucle ou l'indice va un élément trop loin (`range(len(liste) + 1)`, ou un indice égal à la taille de la liste).

**Code à corriger.** Premier bug, **la borne** : `total > 40` exclut 40, alors que la livraison doit être gratuite **dès** 40 € ; il faut `>=` (chapitre 4). Deuxième bug, **le `return` oublié** : dans la branche `else`, la fonction affiche 4.9 au lieu de le renvoyer, donc l'appel renvoie `undefined` / `None` (chapitre 6). Version corrigée :

```javascript
function fraisDeLivraison(total) {
  if (total >= 40) {
    return 0;
  } else {
    return 4.9;
  }
}
```

```python
def frais_de_livraison(total):
    if total >= 40:
        return 0
    else:
        return 4.9
```

Les trois appels donnent maintenant `4.9`, `0` et `0`. Remarque que corriger un seul des deux bugs ne suffisait pas : avec un seul bug corrigé, le résultat restait faux. C'est ce qui rend les bugs multiples pénibles : on corrige **un à la fois**, en relançant les tests à chaque fois.

**Exercice.** Une solution :

```javascript
function estBissextile(annee) {
  return (annee % 4 === 0 && annee % 100 !== 0) || annee % 400 === 0;
}

for (const annee of [2024, 2023, 1900, 2000, 2100]) {
  console.log(annee, estBissextile(annee));
}
```

```python
def est_bissextile(annee):
    return (annee % 4 == 0 and annee % 100 != 0) or annee % 400 == 0


for annee in [2024, 2023, 1900, 2000, 2100]:
    print(annee, est_bissextile(annee))
```

Le programme affiche vrai pour 2024 et 2000, faux pour 2023, 1900 et 2100, comme prévu. Lis la condition ainsi : « divisible par 4 **et** pas par 100, **ou** divisible par 400 ». Les parenthèses indiquent quel regroupement se fait en premier. Écrire les résultats attendus **avant** le code est ce qui t'a permis de savoir, à coup sûr, que ta fonction marche : c'est la base du développement piloté par les tests.

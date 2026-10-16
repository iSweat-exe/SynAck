# Les listes : plusieurs valeurs d'un coup

> **Objectif** : à la fin de ce chapitre, tu sais ranger plusieurs valeurs dans une liste, lire un élément grâce à son indice, ajouter des éléments, et parcourir toute la liste avec une boucle.

## L'idée

Un client achète trois articles. Va-t-on créer `prix1`, `prix2`, `prix3` ? Et pour cinquante articles ? Une **liste** (on dit aussi un **tableau**, *array* en JavaScript) range **plusieurs valeurs dans une seule variable**, **dans l'ordre**.

```javascript
let panier = [12.5, 3, 7.9];
```

```python
panier = [12.5, 3, 7.9]
```

Une liste s'écrit entre **crochets**, avec des virgules entre les éléments. Elle peut contenir n'importe quel type de valeurs : des nombres, des textes, et même d'autres listes.

## Les indices commencent à zéro

Chaque élément a une **position**, appelée **indice**. Le point surprenant : **on compte à partir de 0**. Le premier élément est à l'indice 0, le deuxième à l'indice 1, et ainsi de suite.

```javascript
let courses = ["pain", "lait", "œufs"];
console.log(courses[0]);
console.log(courses[1]);
console.log(courses.length);
```

```python
courses = ["pain", "lait", "œufs"]
print(courses[0])
print(courses[1])
print(len(courses))
```

Résultat :

```plaintext
pain
lait
3
```

`courses[0]` est « pain » (le premier), `courses[1]` est « lait » (le deuxième). La **taille** de la liste s'obtient avec `.length` en JavaScript et `len(...)` en Python : ici 3. Comme on compte depuis 0, le **dernier indice** vaut toujours `taille - 1` : ici 2.

On peut aussi **modifier** un élément (`courses[1] = "jus"`), **ajouter** un élément à la fin (`push` en JavaScript, `append` en Python), et même en retirer :

```javascript
courses.push("beurre");
console.log(courses.length);
```

```python
courses.append("beurre")
print(len(courses))
```

La liste contient maintenant 4 éléments.

## Parcourir une liste avec une boucle

Le grand avantage des listes, c'est qu'elles se marient avec les boucles : on traite **chaque élément** à tour de rôle.

```javascript
let panier = [12.5, 3, 7.9];
let total = 0;

for (const prix of panier) {
  total = total + prix;
}

console.log(`Total : ${total} €`);
```

```python
panier = [12.5, 3, 7.9]
total = 0

for prix in panier:
    total = total + prix

print(f"Total : {total} €")
```

Résultat :

```plaintext
Total : 23.4 €
```

Lis la boucle à voix haute : « **pour chaque** `prix` **dans** `panier`, ajoute-le au total ». À chaque tour, la variable `prix` prend la valeur de l'élément suivant : 12.5, puis 3, puis 7.9. C'est l'accumulateur du chapitre précédent, appliqué à un vrai panier.

On peut aussi ajouter une condition dans la boucle pour **filtrer** : par exemple compter les articles qui coûtent plus de 5 €.

```javascript
let chers = 0;
for (const prix of panier) {
  if (prix > 5) {
    chers = chers + 1;
  }
}
console.log(chers);
```

```python
chers = 0
for prix in panier:
    if prix > 5:
        chers = chers + 1
print(chers)
```

Le résultat est `2` (le 12.5 et le 7.9).

## L'erreur classique : sortir de la liste

Que se passe-t-il si on demande un indice qui n'existe pas ? Pour la liste de 3 éléments, `panier[3]` n'existe pas (les indices valides sont 0, 1 et 2).

- **Python** s'arrête avec une erreur claire : `IndexError: list index out of range`.
- **JavaScript** ne dit rien : il renvoie `undefined`. L'erreur se cache, et réapparaît plus loin sous forme de `NaN` dans un calcul. C'est plus sournois.

C'est ce qu'on appelle une erreur de **décalage d'un cran** (*off-by-one*) : on va un élément trop loin, ou un de moins.

## À retenir

- Une **liste** range plusieurs valeurs dans l'ordre : `[12.5, 3, 7.9]`.
- Les indices **commencent à 0** ; le dernier indice vaut `taille - 1`.
- La taille s'obtient avec `.length` (JavaScript) ou `len(...)` (Python).
- On ajoute à la fin avec `push` (JavaScript) ou `append` (Python).
- `for (const x of liste)` / `for x in liste:` parcourt **chaque élément**.
- Sortir de la liste est une erreur : `IndexError` en Python, `undefined` silencieux en JavaScript.

## Quiz

**Question 1.** Avec `courses = ["pain", "lait", "œufs"]`, que vaut `courses[1]` ?

**Question 2.** Une liste contient 5 éléments. Quel est l'indice du dernier ?

**Question 3.** Rappel du chapitre précédent : combien de fois cette boucle s'exécute-t-elle ?

```javascript
let notes = [12, 15, 9, 18];
for (let i = 0; i < notes.length; i++) {
  console.log(notes[i]);
}
```

```python
notes = [12, 15, 9, 18]
for i in range(len(notes)):
    print(notes[i])
```

**Question 4.** Rappel du chapitre sur les fonctions : que renvoie cette fonction pour `[2, 5, 3]` ?

```javascript
function plusGrand(liste) {
  let max = liste[0];
  for (const x of liste) {
    if (x > max) {
      max = x;
    }
  }
  return max;
}
```

```python
def plus_grand(liste):
    maximum = liste[0]
    for x in liste:
        if x > maximum:
            maximum = x
    return maximum
```

## Code à corriger

Ce programme doit totaliser le panier (`[12.5, 3, 7.9, 4]`, soit 27.4). Mais il plante en Python, et affiche `NaN` en JavaScript. Il y a **un seul bug**.

```javascript
let panier = [12.5, 3, 7.9, 4];
let total = 0;
for (let i = 0; i <= panier.length; i++) {
  total = total + panier[i];
}
console.log(total);
```

```python
panier = [12.5, 3, 7.9, 4]
total = 0
for i in range(len(panier) + 1):
    total = total + panier[i]
print(total)
```

## Exercice

Un professeur veut calculer la **moyenne** d'une classe. Écris une fonction `moyenne(notes)` qui **renvoie** la moyenne d'une liste de notes (la somme des notes divisée par leur nombre).

- pour `[12, 15, 9, 18]`, elle doit renvoyer `13.5` ;
- écris ensuite une deuxième fonction `nombreDeReussites(notes)` (`nombre_de_reussites` en Python) qui renvoie combien de notes valent **12 ou plus** : pour la même liste, `3`.

**Pour aller plus loin :** que se passe-t-il si la liste est vide (`[]`) ? Teste-le, puis fais en sorte que ta fonction `moyenne` renvoie `0` dans ce cas, avec une condition du chapitre 4.

## Corrigés

**Question 1.** `"lait"`. Les indices commencent à 0 : `courses[0]` est `"pain"`, `courses[1]` est `"lait"`.

**Question 2.** L'indice 4. Pour une liste de taille `n`, les indices vont de 0 à `n - 1`.

**Question 3.** Quatre fois : la liste a 4 éléments, `i` prend les valeurs 0, 1, 2 et 3 (la condition `i < notes.length` exclut 4, et `range(len(notes))` s'arrête avant 4). Le programme affiche `12`, `15`, `9`, `18`.

**Question 4.** La fonction renvoie `5` : elle garde en mémoire le plus grand élément vu jusqu'ici, qu'elle met à jour quand elle en trouve un plus grand.

**Code à corriger.** La boucle va **un cran trop loin**. La liste a 4 éléments (indices 0 à 3), mais la boucle va jusqu'à l'indice 4 : `i <= panier.length` accepte 4, et `range(len(panier) + 1)` aussi. L'élément `panier[4]` n'existe pas : `undefined` en JavaScript (d'où `NaN`), `IndexError` en Python. Il faut s'arrêter **avant** la taille :

```javascript
for (let i = 0; i < panier.length; i++) {
  total = total + panier[i];
}
```

```python
for i in range(len(panier)):
    total = total + panier[i]
```

Le programme affiche alors 27.4. Encore plus simple : parcourir directement les éléments avec `for (const prix of panier)` ou `for prix in panier`, comme dans le chapitre, rend ce bug impossible.

**Exercice.** Une solution :

```javascript
function moyenne(notes) {
  if (notes.length === 0) {
    return 0;
  }
  let somme = 0;
  for (const note of notes) {
    somme = somme + note;
  }
  return somme / notes.length;
}

function nombreDeReussites(notes) {
  let compteur = 0;
  for (const note of notes) {
    if (note >= 12) {
      compteur = compteur + 1;
    }
  }
  return compteur;
}

console.log(moyenne([12, 15, 9, 18]));
console.log(nombreDeReussites([12, 15, 9, 18]));
console.log(moyenne([]));
```

```python
def moyenne(notes):
    if len(notes) == 0:
        return 0
    somme = 0
    for note in notes:
        somme = somme + note
    return somme / len(notes)


def nombre_de_reussites(notes):
    compteur = 0
    for note in notes:
        if note >= 12:
            compteur = compteur + 1
    return compteur


print(moyenne([12, 15, 9, 18]))
print(nombre_de_reussites([12, 15, 9, 18]))
print(moyenne([]))
```

Résultat : `13.5`, `3` et `0`. Sans la condition sur la liste vide, la division par zéro donne `NaN` en JavaScript et une `ZeroDivisionError` en Python : traiter les cas limites, comme une liste vide, fait partie du métier.

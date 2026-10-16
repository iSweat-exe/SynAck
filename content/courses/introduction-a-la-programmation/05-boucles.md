# Les boucles : répéter sans se fatiguer

> **Objectif** : à la fin de ce chapitre, tu sais répéter des instructions avec `while` et `for`, accumuler un résultat au fil des tours, et éviter qu'une boucle ne tourne pour toujours.

## L'idée

Imagine que tu doives afficher les nombres de 1 à 100. Écrire cent fois `console.log` serait long, ennuyeux, et plein de risques d'erreur. Une **boucle** demande à l'ordinateur de **répéter un bloc d'instructions** : il adore ça, il ne se fatigue jamais.

Il existe deux grandes boucles :

- **`while`** (« tant que ») : on répète **tant qu'une condition est vraie**. Pratique quand on ne sait pas à l'avance combien de tours il faudra ;
- **`for`** (« pour ») : on répète un **nombre de fois connu**, ou pour chaque élément d'un ensemble.

## La boucle while

```javascript
let i = 1;
while (i <= 3) {
  console.log(i);
  i = i + 1;
}
```

```python
i = 1
while i <= 3:
    print(i)
    i = i + 1
```

Résultat :

```plaintext
1
2
3
```

Suivons-la comme le ferait l'ordinateur :

- au départ, `i` vaut 1 ;
- on teste `i <= 3`. C'est vrai : on affiche 1, puis `i` passe à 2 ;
- on reteste : vrai, on affiche 2, `i` passe à 3 ;
- on reteste : vrai, on affiche 3, `i` passe à 4 ;
- on reteste : `4 <= 3` est faux : **la boucle s'arrête**, et le programme continue après le bloc.

Le test se fait **avant chaque tour**, y compris le premier.

## La boucle for

Quand on connaît le nombre de tours, `for` est plus compact : il gère lui-même le compteur.

```javascript
for (let i = 1; i <= 3; i++) {
  console.log(i);
}
```

```python
for i in range(1, 4):
    print(i)
```

Ces deux programmes affichent exactement la même chose que le `while` ci-dessus.

- En JavaScript, les trois parties entre parenthèses sont : le **départ** (`let i = 1`), la **condition pour continuer** (`i <= 3`) et la **mise à jour** à la fin de chaque tour (`i++`, qui veut dire « ajoute 1 à `i` »).
- En Python, `range(1, 4)` produit les nombres de **1 inclus à 4 exclu** : 1, 2, 3. La borne de fin n'est jamais atteinte. `range(5)` produit 0, 1, 2, 3, 4 : cinq nombres.

## Un exemple pas à pas : le prix de plusieurs articles

Pour ton petit magasin : un article coûte 4 €. Affichons ce que coûtent de 1 à 5 articles.

```javascript
let prix = 4;
for (let quantite = 1; quantite <= 5; quantite++) {
  console.log(`${quantite} article(s) : ${prix * quantite} €`);
}
```

```python
prix = 4
for quantite in range(1, 6):
    print(f"{quantite} article(s) : {prix * quantite} €")
```

Résultat :

```plaintext
1 article(s) : 4 €
2 article(s) : 8 €
3 article(s) : 12 €
4 article(s) : 16 €
5 article(s) : 20 €
```

## L'accumulateur : construire un résultat tour après tour

Une boucle sert très souvent à **accumuler** : on prépare une variable avant la boucle, et on la fait évoluer à chaque tour. Ici, la somme des nombres de 1 à 100 :

```javascript
let somme = 0;
for (let i = 1; i <= 100; i++) {
  somme = somme + i;
}
console.log(somme);
```

```python
somme = 0
for i in range(1, 101):
    somme = somme + i
print(somme)
```

Résultat : `5050`. La variable `somme` démarre à 0, et chaque tour y ajoute le nombre en cours. C'est exactement ce qu'on fera pour totaliser un panier.

## Sortir d'une boucle avec break

`break` arrête la boucle immédiatement. Par exemple, pour trouver le premier multiple de 7 supérieur à 50 :

```javascript
let n = 51;
while (true) {
  if (n % 7 === 0) {
    break;
  }
  n = n + 1;
}
console.log(n);
```

```python
n = 51
while True:
    if n % 7 == 0:
        break
    n = n + 1
print(n)
```

Résultat : `56`. La condition `true` est toujours vraie : seule l'instruction `break` arrête cette boucle.

## Le danger : la boucle infinie

Si la condition d'un `while` ne devient **jamais** fausse, la boucle ne s'arrête jamais. C'est une **boucle infinie** : le programme semble figé. Cela arrive presque toujours parce qu'on a **oublié de faire évoluer** la variable testée.

Si ton programme tourne sans fin dans un terminal, arrête-le avec **Ctrl + C**. Dans la console d'un navigateur, il faudra fermer l'onglet. Pense à toujours te demander : « qu'est-ce qui fera arrêter cette boucle ? »

## À retenir

- Une **boucle** répète un bloc d'instructions ; `while` répète tant qu'une condition est vraie, `for` répète un nombre de fois connu.
- Le test d'un `while` se fait **avant chaque tour**.
- En Python, `range(a, b)` va de `a` **inclus** à `b` **exclu**.
- Un **accumulateur** (`somme = somme + ...`) construit un résultat tour après tour.
- Une boucle doit toujours avoir **une façon de s'arrêter** : sinon, c'est une boucle infinie.

## Quiz

**Question 1.** Qu'affiche ce programme ?

```javascript
for (let i = 1; i < 4; i++) {
  console.log(i * 2);
}
```

```python
for i in range(1, 4):
    print(i * 2)
```

**Question 2.** Combien de fois le mot « Salut » est-il affiché ?

```javascript
for (let i = 1; i < 5; i++) {
  console.log("Salut");
}
```

```python
for i in range(1, 5):
    print("Salut")
```

**Question 3.** Rappel du chapitre précédent : qu'affiche ce programme ? Pense à ce que fait le `%` (le reste de la division).

```javascript
for (let i = 1; i <= 6; i++) {
  if (i % 2 === 0) {
    console.log(i);
  }
}
```

```python
for i in range(1, 7):
    if i % 2 == 0:
        print(i)
```

**Question 4.** Pourquoi ne faut-il pas écrire `while (true)` sans prévoir de `break` ?

## Code à corriger

Ce programme devait afficher `1`, `2`, `3` puis s'arrêter. À la place, il affiche `1` sans fin. Il y a **un seul bug**.

Attention : ne le lance pas dans la console d'un navigateur, il la gèlerait. Si tu le lances ailleurs, arrête-le avec Ctrl + C.

```javascript
let i = 1;
while (i <= 3) {
  console.log(i);
}
```

```python
i = 1
while i <= 3:
    print(i)
```

## Exercice

Tu épargnes **25 € par mois**. Combien de mois te faut-il pour atteindre **300 €** ? Écris un programme avec une boucle `while` qui ajoute 25 € à ton épargne à chaque mois qui passe, compte les mois, et affiche à la fin :

```plaintext
Objectif atteint en 12 mois
```

Vérifie avec un autre objectif : avec 130 € à atteindre, tu dois obtenir 6 mois (25 × 6 = 150, et 25 × 5 = 125 n'est pas encore assez). C'est ce deuxième test qui prouve que ta condition est correcte.

## Corrigés

**Question 1.** Le programme affiche `2`, `4` puis `6`. Les valeurs de `i` sont 1, 2, 3 (la valeur 4 est exclue), et on affiche chaque fois `i * 2`.

**Question 2.** **4 fois** : `i` prend les valeurs 1, 2, 3 et 4. La borne de fin (5) est exclue, dans `i < 5` comme dans `range(1, 5)`. C'est une erreur très fréquente : pour répéter 5 fois, il faut `range(5)` ou `i` de 0 à 4, ou de 1 à 5 avec `<= 5`.

**Question 3.** Le programme affiche `2`, `4` puis `6` : la boucle passe en revue 1 à 6, et la condition `i % 2 === 0` ne laisse passer que les nombres dont le reste de la division par 2 est zéro, c'est-à-dire les nombres pairs.

**Question 4.** Parce que `true` est toujours vrai : sans `break`, rien n'arrêterait jamais la boucle, qui deviendrait infinie.

**Code à corriger.** Le programme **oublie de faire évoluer `i`** : il vaut toujours 1, donc `i <= 3` est toujours vrai et la boucle ne s'arrête jamais. Il manque l'instruction qui fait avancer le compteur :

```javascript
let i = 1;
while (i <= 3) {
  console.log(i);
  i = i + 1;
}
```

```python
i = 1
while i <= 3:
    print(i)
    i = i + 1
```

C'est la cause numéro un des boucles infinies : la variable du test n'est jamais modifiée dans le bloc.

**Exercice.** Une solution :

```javascript
let objectif = 300;
let epargne = 0;
let mois = 0;

while (epargne < objectif) {
  epargne = epargne + 25;
  mois = mois + 1;
}

console.log(`Objectif atteint en ${mois} mois`);
```

```python
objectif = 300
epargne = 0
mois = 0

while epargne < objectif:
    epargne = epargne + 25
    mois = mois + 1

print(f"Objectif atteint en {mois} mois")
```

Avec `objectif = 130`, ce programme affiche `Objectif atteint en 6 mois`. Remarque que la condition est `epargne < objectif` (strictement plus petit) : on s'arrête dès que l'épargne atteint **ou dépasse** l'objectif. Avec `objectif = 300`, l'épargne vaut exactement 300 au 12e mois, la condition devient fausse, et on s'arrête : c'est bien le bon nombre de mois.

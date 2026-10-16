# Les conditions : faire des choix

> **Objectif** : à la fin de ce chapitre, tu sais écrire un programme qui choisit quoi faire selon la situation, avec `if`, `else`, des comparaisons et des opérateurs logiques.

## L'idée

Jusqu'ici, ton programme fait toujours la même chose, quoi qu'il arrive. Un vrai programme doit **réagir** : une remise si le panier est assez gros, un message d'erreur si le mot de passe est faux.

Pour cela, on pose une **condition** : une question dont la réponse est **vrai** ou **faux** (un booléen, tu te souviens ?). Si c'est vrai, on exécute un bloc d'instructions ; sinon, on en exécute un autre.

## Comparer deux valeurs

Une comparaison produit un booléen :

- **égal à ?** : `===` en JavaScript, `==` en Python ;
- **différent de ?** : `!==` en JavaScript, `!=` en Python ;
- **plus petit que ?** : `<` dans les deux langages ;
- **plus petit ou égal ?** : `<=` ;
- **plus grand que ?** : `>` ;
- **plus grand ou égal ?** : `>=`.

**Attention :** `=` range une valeur dans une variable (chapitre précédent), alors que `==` ou `===` **compare**. Les confondre est l'une des erreurs les plus fréquentes.

## Un exemple pas à pas : la remise du magasin

Deuxième pièce du petit magasin : **10 % de remise dès 50 € d'achats, 20 % dès 100 €.**

```javascript
let total = 64;
let remise = 0;

if (total >= 100) {
  remise = 0.2;
} else if (total >= 50) {
  remise = 0.1;
} else {
  remise = 0;
}

let aPayer = total * (1 - remise);
console.log(`À payer : ${aPayer} €`);
```

```python
total = 64
remise = 0

if total >= 100:
    remise = 0.2
elif total >= 50:
    remise = 0.1
else:
    remise = 0

a_payer = total * (1 - remise)
print(f"À payer : {a_payer} €")
```

Résultat avec un total de 64 :

```plaintext
À payer : 57.6 €
```

Comment ça se lit :

- `if (total >= 100)` : si le total est d'au moins 100, on applique 20 % ;
- `else if` (`elif` en Python) : sinon, **et seulement si** la première condition était fausse, on teste la suivante ;
- `else` : si aucune condition n'était vraie, on exécute ce bloc.

Un seul des blocs s'exécute. Dès qu'une condition est vraie, l'ordinateur saute les suivantes.

**Les accolades et l'indentation.** En JavaScript, les blocs sont entourés d'accolades `{ }`. En Python, il n'y en a pas : un bloc commence après les deux-points `:` et se reconnaît à son **indentation** (le décalage vers la droite, en général 4 espaces). En Python, l'indentation fait partie du code : si elle est fausse, le programme est faux.

**L'ordre des conditions compte.** Avec un total de 120, on veut 20 % de remise. On teste donc d'abord `>= 100`. Si on testait d'abord `>= 50`, 120 serait déjà « plus grand que 50 » : le premier bloc s'exécuterait, le deuxième serait ignoré, et on n'appliquerait que 10 %. On teste toujours le cas **le plus précis (le plus grand) en premier**.

## Combiner des conditions

On peut combiner plusieurs conditions avec des mots logiques :

- **et** (les deux conditions sont vraies) : `&&` en JavaScript, `and` en Python ;
- **ou** (au moins une est vraie) : `||` en JavaScript, `or` en Python ;
- **non** (l'inverse) : `!` en JavaScript, `not` en Python.

Par exemple, pour savoir si quelqu'un a entre 12 et 25 ans **inclus** :

```javascript
if (age >= 12 && age <= 25) {
  console.log("Tarif jeune");
}
```

```python
if age >= 12 and age <= 25:
    print("Tarif jeune")
```

On peut aussi ranger le résultat d'une comparaison dans une variable booléenne : `let estMajeur = age >= 18;`.

## À retenir

- Une **condition** est une question dont la réponse est vrai ou faux ; `if` exécute un bloc seulement si c'est vrai.
- `else if` / `elif` et `else` traitent les autres cas ; **un seul bloc** s'exécute.
- Ne confonds pas `=` (ranger) et `==` / `===` (comparer).
- On combine avec **et**, **ou**, **non** (`&&`, `||`, `!` en JavaScript ; `and`, `or`, `not` en Python).
- Teste les cas **du plus précis au plus général**, et fais attention aux **bornes** (`<` ou `<=`).

## Quiz

**Question 1.** Rappel du chapitre précédent : que vaut `x` après ces instructions ?

```javascript
let x = 4;
x = x + 1;
```

```python
x = 4
x = x + 1
```

**Question 2.** Avec le programme de remise de ce chapitre et `total = 50`, quelle remise est appliquée : 0, 0.1 ou 0.2 ?

**Question 3.** Laquelle de ces conditions est vraie uniquement quand `age` est entre 12 et 25 **inclus** ?

- A. `age >= 12 || age <= 25` (JavaScript) / `age >= 12 or age <= 25` (Python)
- B. `age >= 12 && age <= 25` (JavaScript) / `age >= 12 and age <= 25` (Python)
- C. `age > 12 && age < 25` (JavaScript) / `age > 12 and age < 25` (Python)

**Question 4.** On échange l'ordre des deux premiers tests : on vérifie d'abord `total >= 50`, puis `total >= 100`. Quelle remise obtient-on pour un total de 120 ? Pourquoi ?

## Code à corriger

L'entrée est **gratuite pour les moins de 12 ans**. Mais à 12 ans pile, le programme dit encore « Gratuit ». Il y a **un seul bug**.

```javascript
let age = 12;
if (age <= 12) {
  console.log("Gratuit");
} else {
  console.log("Payant");
}
```

```python
age = 12
if age <= 12:
    print("Gratuit")
else:
    print("Payant")
```

## Exercice

Un cinéma propose trois tarifs :

- moins de 12 ans : **5 €** ;
- de 12 à 25 ans (inclus) : **8 €** ;
- 26 ans et plus : **11 €**.

Écris un programme qui, à partir d'une variable `age`, affiche `Tarif : ... €`. Teste-le avec tous ces âges et vérifie chaque résultat :

- âge 8 : tarif attendu 5 € ;
- âge 11 : 5 € ;
- âge 12 : 8 € ;
- âge 25 : 8 € ;
- âge 26 : 11 € ;
- âge 40 : 11 €.

Les âges **12**, **25** et **26** sont les plus importants : ce sont les **bornes**, là où se cachent les bugs.

## Corrigés

**Question 1.** `x` vaut `5`. On calcule `x + 1` avec la valeur actuelle de `x` (4), puis on range le résultat dans `x`.

**Question 2.** `0.1`. Le premier test (`total >= 100`) est faux pour 50, le deuxième (`total >= 50`) est vrai : le signe `>=` inclut 50. Le total à payer est donc de 45 €.

**Question 3 : B.** Il faut que **les deux** conditions soient vraies, donc un « et ». Avec « ou » (A), presque tout le monde passe le test, puisque tout nombre est au moins 12 *ou* au plus 25. Avec `>` et `<` (C), on exclurait 12 et 25 eux-mêmes.

**Question 4.** On obtient `0.1`, donc 10 % au lieu de 20 %. 120 est plus grand que 50 : le premier test est vrai, son bloc s'exécute, et le test `>= 100` n'est jamais regardé. Il faut tester le cas le plus grand en premier.

**Code à corriger.** Le bug est sur la **borne** : `age <= 12` accepte 12, alors que « moins de 12 ans » exclut 12. Il faut `<` à la place de `<=` :

```javascript
if (age < 12) {
  console.log("Gratuit");
}
```

```python
if age < 12:
    print("Gratuit")
```

C'est un bug de logique classique : une comparaison correcte à un cheveu près. Dès que l'énoncé dit « moins de », « au moins », « jusqu'à », demande-toi si la valeur limite est incluse.

**Exercice.** Une solution :

```javascript
let age = 25;

if (age < 12) {
  console.log("Tarif : 5 €");
} else if (age <= 25) {
  console.log("Tarif : 8 €");
} else {
  console.log("Tarif : 11 €");
}
```

```python
age = 25

if age < 12:
    print("Tarif : 5 €")
elif age <= 25:
    print("Tarif : 8 €")
else:
    print("Tarif : 11 €")
```

Remarque : on n'a pas besoin d'écrire `age >= 12 and age <= 25` dans le deuxième test. Si on arrive dans le `else if`, c'est que `age < 12` était faux : on sait déjà que `age >= 12`. Chaque test profite de ce que les précédents ont éliminé.

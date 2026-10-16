# Les variables et les types

> **Objectif** : à la fin de ce chapitre, tu sais ranger une valeur dans une variable, faire des calculs avec, et afficher une phrase construite à partir de tes variables.

## L'idée

Un programme manipule des données : un prix, un nom, un âge. Pour les retrouver, on leur donne un nom. Une **variable**, c'est une **étiquette collée sur une valeur**.

On crée une variable avec le signe `=`, qu'on appelle une **affectation** :

- en JavaScript : `let prix = 12.5;`
- en Python : `prix = 12.5`

Attention : en programmation, `=` ne veut **pas** dire « égal » comme en mathématiques. Il veut dire : « **range la valeur de droite dans le nom de gauche** ». Une ligne comme `prix = 12.5` se lit « prix prend la valeur 12,5 ».

Une variable peut changer de valeur au fil du programme, c'est même pour ça qu'elle s'appelle ainsi.

## Les types de valeurs

Chaque valeur a un **type**. Les trois premiers à connaître :

- **un nombre** : `3` (entier) ou `12.5` (décimal, avec un point et non une virgule) ;
- **un texte** (une *chaîne de caractères*), entre guillemets : `"Bonjour"` ;
- **un booléen**, qui vaut seulement vrai ou faux : `true` / `false` en JavaScript, `True` / `False` en Python. Tu t'en serviras dès le chapitre suivant.

Le type détermine ce qu'on a le droit de faire avec la valeur : on peut multiplier deux nombres, pas deux mots.

## Choisir un bon nom

Un nom de variable contient des lettres, des chiffres et des tirets bas `_`. Il ne contient **pas d'espace**, ne commence **pas par un chiffre**, et les majuscules comptent (`Prix` et `prix` sont deux variables différentes).

Choisis des noms qui disent ce qu'il y a dedans : `prix_total` est bien meilleur que `x`. Par habitude, on écrit `prixTotal` en JavaScript (une majuscule à chaque mot) et `prix_total` en Python (des tirets bas). Dans ce cours, on garde des noms simples sans accent.

## Un exemple pas à pas : le prix d'un article

Première pièce de ton petit magasin : calculer ce que coûtent 3 articles à 12,50 € l'unité.

```javascript
let prix = 12.5;
let quantite = 3;
let total = prix * quantite;
console.log(`Total : ${total} €`);
```

```python
prix = 12.5
quantite = 3
total = prix * quantite
print(f"Total : {total} €")
```

Résultat :

```plaintext
Total : 37.5 €
```

Ligne par ligne :

1. `prix` reçoit 12.5 ;
2. `quantite` reçoit 3 ;
3. `total` reçoit le résultat de `prix * quantite`, c'est-à-dire 37.5 : l'ordinateur calcule d'abord le côté droit, puis range le résultat à gauche ;
4. on affiche une phrase. Les `${total}` (JavaScript, avec des accents graves autour du texte) et les `{total}` (Python, avec un `f` devant les guillemets) insèrent la valeur de la variable dans le texte.

Les opérations de base sont `+`, `-`, `*` (multiplier), `/` (diviser) et `%` (le **reste** de la division : `7 % 3` vaut `1`).

## Une variable garde une copie, pas un lien

Suis ce programme ligne par ligne avec un papier :

```javascript
let a = 10;
let b = a;
a = a + 5;
console.log(a, b);
```

```python
a = 10
b = a
a = a + 5
print(a, b)
```

À la ligne 2, `b` reçoit **la valeur** de `a` (10), pas un lien vers `a`. Quand `a` change ensuite, `b` ne bouge pas. Le programme affiche `15 10`.

Et `a = a + 5` ? Ce n'est pas une équation impossible : c'est « calcule `a + 5` avec la valeur actuelle de `a`, puis range le résultat dans `a` ». On s'en servira beaucoup.

## Le piège des types

Que se passe-t-il quand on additionne un texte et un nombre ?

```javascript
console.log("5" + 3);
```

```python
print("5" + 3)
```

- **JavaScript** colle les deux et affiche le **texte** `53`. Pas d'erreur, mais pas non plus ce que tu voulais peut-être !
- **Python** refuse : `TypeError: can only concatenate str (not "int") to str`. Il te signale que tu mélanges deux types.

Quand une valeur est du texte alors que tu la voulais en nombre, **convertis-la** : `Number("5")` en JavaScript, `int("5")` en Python. `Number("5") + 3` donne bien `8`.

Dernier détail : les ordinateurs comptent en binaire et arrondissent parfois les décimales. Par exemple `0.1 + 0.2` donne `0.30000000000000004`. Ce n'est pas un bug de ton programme. On en reparlera.

## À retenir

- Une **variable** est un nom collé sur une valeur ; `=` signifie « range à gauche la valeur calculée à droite ».
- Les types de base : **nombre**, **texte** (entre guillemets), **booléen**.
- Une variable **garde une copie** de la valeur : modifier `a` ne modifie pas `b`.
- On insère une variable dans un texte avec `${...}` (JavaScript) ou un `f"...{...}..."` (Python).
- Mélanger texte et nombre est un piège : **convertis** avec `Number(...)` ou `int(...)`.

## Quiz

**Question 1.** Que valent `a` et `b` à la fin de ce programme ?

```javascript
let a = 4;
let b = a * 2;
a = 1;
```

```python
a = 4
b = a * 2
a = 1
```

**Question 2.** Lequel de ces noms est un nom de variable valide (dans les deux langages) ?

- A. `2prix`
- B. `prix total`
- C. `prix_total`
- D. `prix-total`

**Question 3.** Rappel du chapitre précédent : dans quel ordre l'ordinateur exécute-t-il les instructions d'un programme ?

**Question 4.** Qu'affiche ce code JavaScript ? Que se passerait-il avec le même code en Python ?

```javascript
let age = "12";
console.log(age + 1);
```

## Code à corriger

Le programme du magasin doit afficher `Total : 37.5 €` pour 3 articles à 12,50 €. Mais il affiche un total faux. Il y a **un seul bug**. Trouve-le.

```javascript
let prix = 12.5;
let quantite = 3;
let total = prix + quantite;
console.log(`Total : ${total} €`);
```

```python
prix = 12.5
quantite = 3
total = prix + quantite
print(f"Total : {total} €")
```

## Exercice

Un article coûte **20 € hors taxe**, avec une TVA de **20 %**. Écris un programme avec trois variables (`prix_ht`, `tva`, `prix_ttc`) qui calcule le prix toutes taxes comprises et affiche :

```plaintext
Prix TTC : 24 €
```

Teste ensuite avec un prix hors taxe de 50 € : tu dois obtenir 60.

## Corrigés

**Question 1.** À la fin, `a` vaut `1` et `b` vaut `8`. `b` a reçu la valeur de `a * 2` (donc 8) au moment où la ligne s'est exécutée ; changer `a` ensuite ne change pas `b`.

**Question 2 : C.** `2prix` commence par un chiffre, `prix total` contient une espace, et `prix-total` contient un tiret, que le langage lirait comme une soustraction. Le tiret bas `_` est autorisé.

**Question 3.** Les instructions s'exécutent l'une après l'autre, de haut en bas.

**Question 4.** JavaScript affiche `121` : `"12"` est du texte, donc le `+` colle les deux au lieu d'additionner. En Python, la même opération produit une `TypeError`. Dans les deux cas, la solution est de convertir d'abord : `Number(age) + 1` ou `int(age) + 1` donne `13`.

**Code à corriger.** Le bug est dans l'opérateur : on a écrit `prix + quantite` (12.5 + 3 = 15.5) au lieu de `prix * quantite`. C'est un **bug de logique** : le programme fonctionne, mais il calcule autre chose que ce qu'on voulait. La bonne ligne est `let total = prix * quantite;` en JavaScript et `total = prix * quantite` en Python.

**Exercice.** Une solution :

```javascript
let prixHt = 20;
let tva = 0.2;
let prixTtc = prixHt + prixHt * tva;
console.log(`Prix TTC : ${prixTtc} €`);
```

```python
prix_ht = 20
tva = 0.2
prix_ttc = prix_ht + prix_ht * tva
print(f"Prix TTC : {prix_ttc} €")
```

Remarque : Python affiche `24.0` (un nombre décimal garde sa décimale), JavaScript affiche `24`. Les deux sont corrects. Avec un prix hors taxe de 50, tu obtiens bien 60.

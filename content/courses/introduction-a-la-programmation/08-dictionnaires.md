# Les dictionnaires : retrouver par un nom

> **Objectif** : à la fin de ce chapitre, tu sais associer des valeurs à des clés dans un dictionnaire, lire, ajouter et modifier une valeur, parcourir ses éléments, et combiner listes et dictionnaires pour représenter un panier.

## L'idée

Dans une liste, on retrouve un élément par sa **position** : « le troisième ». Mais pour un catalogue de prix, ce n'est pas pratique : tu veux demander « combien coûte le pain ? », pas « combien coûte l'élément numéro 1 ? ».

Un **dictionnaire** (on dit un **objet** en JavaScript) associe des **clés** à des **valeurs**. Comme dans un vrai dictionnaire, on cherche par le mot, pas par le numéro de page.

```javascript
let catalogue = { pomme: 0.5, pain: 1.2, lait: 1.1 };
```

```python
catalogue = {"pomme": 0.5, "pain": 1.2, "lait": 1.1}
```

Un dictionnaire s'écrit entre **accolades**. Chaque entrée est une paire `clé : valeur`, séparées par des virgules. Ici, les clés sont les noms des articles, les valeurs sont leurs prix.

## Lire, modifier, ajouter

On lit la valeur d'une clé en écrivant la clé entre crochets, comme pour une liste, mais avec un nom au lieu d'un indice :

```javascript
console.log(catalogue["pain"]);
catalogue["pain"] = catalogue["pain"] + 0.1;
console.log(catalogue["pain"]);
catalogue["fraise"] = 3;
```

```python
print(catalogue["pain"])
catalogue["pain"] = catalogue["pain"] + 0.1
print(catalogue["pain"])
catalogue["fraise"] = 3
```

Le programme affiche `1.2`, puis `1.3` : on a augmenté le prix du pain de 0,10 €. La dernière ligne **ajoute** une entrée : si la clé n'existe pas encore, l'affectation la crée. En JavaScript, on peut aussi écrire `catalogue.pain` à la place de `catalogue["pain"]`.

Les clés sont **sensibles à la casse** : `"pain"` et `"Pain"` sont deux clés différentes.

## Que se passe-t-il si la clé n'existe pas ?

Demande le prix d'un article qui n'est pas au catalogue :

```javascript
console.log(catalogue["kiwi"]);
```

```python
print(catalogue["kiwi"])
```

- **JavaScript** renvoie `undefined`, sans broncher ;
- **Python** s'arrête avec `KeyError: 'kiwi'`.

Pour **vérifier avant de lire**, on utilise `in`, qui répond par un booléen : `"kiwi" in catalogue` vaut `false` (JavaScript) ou `False` (Python), tandis que `"pain" in catalogue` est vrai. Combiné avec un `if`, on évite l'erreur.

## Parcourir un dictionnaire

```javascript
for (const [nom, prix] of Object.entries(catalogue)) {
  console.log(`${nom} : ${prix} €`);
}
```

```python
for nom, prix in catalogue.items():
    print(f"{nom} : {prix} €")
```

À chaque tour, `nom` reçoit une clé et `prix` sa valeur. Les dictionnaires gardent l'ordre dans lequel on a ajouté les entrées.

## Un exemple pas à pas : le panier du magasin

Tu peux maintenant représenter un vrai panier : une **liste de dictionnaires**, un par ligne d'achat. Le catalogue donne les prix ; le panier dit quoi et combien.

```javascript
let catalogue = { pomme: 0.5, pain: 1.2, lait: 1.1 };

let panier = [
  { nom: "pomme", quantite: 4 },
  { nom: "pain", quantite: 2 },
  { nom: "lait", quantite: 1 },
];

let total = 0;
for (const ligne of panier) {
  let prix = catalogue[ligne.nom];
  total = total + prix * ligne.quantite;
}

console.log(`Total : ${total} €`);
```

```python
catalogue = {"pomme": 0.5, "pain": 1.2, "lait": 1.1}

panier = [
    {"nom": "pomme", "quantite": 4},
    {"nom": "pain", "quantite": 2},
    {"nom": "lait", "quantite": 1},
]

total = 0
for ligne in panier:
    prix = catalogue[ligne["nom"]]
    total = total + prix * ligne["quantite"]

print(f"Total : {total} €")
```

Résultat :

```plaintext
Total : 5.5 €
```

Suis le programme : pour la première ligne du panier, `ligne["nom"]` vaut `"pomme"`, on cherche son prix dans le catalogue (0.5), on le multiplie par la quantité (4), et on ajoute 2 au total. Puis 2.4 pour le pain, 1.1 pour le lait : 5.5 €. Tu viens de combiner **trois chapitres** : une boucle, des listes, des dictionnaires.

## À retenir

- Un **dictionnaire** associe des **clés** à des **valeurs** : `{ pomme: 0.5 }` / `{"pomme": 0.5}`.
- On lit et on modifie avec `catalogue["pain"]` ; affecter à une clé qui n'existe pas **l'ajoute**.
- Une clé absente donne `undefined` (JavaScript) ou une `KeyError` (Python) : vérifie avec `in`.
- Les clés sont **sensibles à la casse**.
- On parcourt avec `Object.entries(...)` (JavaScript) ou `.items()` (Python).
- Liste = **par position**, dictionnaire = **par nom** ; on les combine volontiers.

## Quiz

**Question 1.** Avec le catalogue de ce chapitre, que vaut `catalogue["lait"]` ?

**Question 2.** Que se passe-t-il avec `catalogue["Pomme"]` (avec un P majuscule) en Python ? Et en JavaScript ?

**Question 3.** Rappel du chapitre précédent : dans quel cas préfères-tu une liste, et dans quel cas préfères-tu un dictionnaire ?

**Question 4.** Après ces instructions, que vaut `catalogue["pain"]` ?

```javascript
let catalogue = { pain: 1.2 };
catalogue["pain"] = catalogue["pain"] + 0.1;
```

```python
catalogue = {"pain": 1.2}
catalogue["pain"] = catalogue["pain"] + 0.1
```

## Code à corriger

Ce programme doit afficher le prix du pain, mais le client demande « Pain » avec une majuscule. En Python il plante ; en JavaScript il affiche `Prix : undefined €`. **Corrige le programme** pour qu'il affiche un message poli (`Article inconnu`) quand l'article n'est pas au catalogue, au lieu de planter ou d'afficher n'importe quoi.

```javascript
let catalogue = { pomme: 0.5, pain: 1.2 };
let article = "Pain";
console.log(`Prix : ${catalogue[article]} €`);
```

```python
catalogue = {"pomme": 0.5, "pain": 1.2}
article = "Pain"
print(f"Prix : {catalogue[article]} €")
```

## Exercice

Écris un programme qui **compte les mots** d'une phrase. Avec la phrase `"le chat et le chien et le chat"`, il doit produire un dictionnaire qui dit combien de fois chaque mot apparaît :

```plaintext
le : 3
chat : 2
et : 2
chien : 1
```

Indice : la phrase se découpe en mots avec `phrase.split(" ")` (les deux langages ont cette méthode, et elle renvoie une liste de mots). Pour chaque mot, soit il est déjà dans le dictionnaire (tu ajoutes 1 à son compteur), soit il n'y est pas encore (tu le crées avec la valeur 1).

## Corrigés

**Question 1.** `1.1`.

**Question 2.** Les clés sont sensibles à la casse : `"Pomme"` n'existe pas dans le catalogue (seule `"pomme"` existe). Python s'arrête avec `KeyError: 'Pomme'`. JavaScript, lui, renvoie `undefined` sans prévenir, ce qui donne `Prix : undefined €` si on affiche la valeur.

**Question 3.** On préfère une **liste** quand on a une suite de valeurs dans l'ordre qu'on parcourt ou qu'on retrouve par position (des prix, des notes). On préfère un **dictionnaire** quand on veut retrouver une valeur par un **nom** (le prix *du pain*, l'âge *de Ada*).

**Question 4.** `1.3`. On lit la valeur actuelle (1.2), on lui ajoute 0.1, et on range le résultat dans la même clé.

**Code à corriger.** Le programme lit la clé sans vérifier qu'elle existe. Il faut tester avec `in` avant de lire :

```javascript
let catalogue = { pomme: 0.5, pain: 1.2 };
let article = "Pain";

if (article in catalogue) {
  console.log(`Prix : ${catalogue[article]} €`);
} else {
  console.log("Article inconnu");
}
```

```python
catalogue = {"pomme": 0.5, "pain": 1.2}
article = "Pain"

if article in catalogue:
    print(f"Prix : {catalogue[article]} €")
else:
    print("Article inconnu")
```

Le programme affiche `Article inconnu` : on vérifie qu'une clé existe avant de la lire, plutôt que d'espérer. (Tu pourrais aussi convertir le nom en minuscules avant la recherche, avec `article.toLowerCase()` en JavaScript ou `article.lower()` en Python, pour que « Pain » trouve « pain ».)

**Exercice.** Une solution :

```javascript
let phrase = "le chat et le chien et le chat";
let compteur = {};

for (const mot of phrase.split(" ")) {
  if (mot in compteur) {
    compteur[mot] = compteur[mot] + 1;
  } else {
    compteur[mot] = 1;
  }
}

for (const [mot, nombre] of Object.entries(compteur)) {
  console.log(`${mot} : ${nombre}`);
}
```

```python
phrase = "le chat et le chien et le chat"
compteur = {}

for mot in phrase.split(" "):
    if mot in compteur:
        compteur[mot] = compteur[mot] + 1
    else:
        compteur[mot] = 1

for mot, nombre in compteur.items():
    print(f"{mot} : {nombre}")
```

Le résultat est `le : 3`, `chat : 2`, `et : 2`, `chien : 1`. Ce schéma (« s'il est déjà là, ajoute 1 ; sinon, crée-le à 1 ») est l'un des plus utilisés en programmation : tu le retrouveras pour compter n'importe quoi.
